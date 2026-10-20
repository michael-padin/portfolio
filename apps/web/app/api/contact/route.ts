import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { features } from "@/lib/features";
import { log } from "@/lib/logger";
import { contactNotification, contactAutoReply } from "@/lib/email-templates";
import {
  VISIT_ID,
  clip,
  esc,
  isTelegramEnabled,
  notify,
  notifyError,
  visitTag,
} from "@/lib/telegram";
import { describePlace } from "@/lib/visitor";
import { BUDGETS, NEEDS, ROLES, labelOf, parseContact, values } from "@/lib/contact-options";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Rate limiting
const submissions = new Map<string, number[]>();
const MAX_PER_HOUR = 3;

// Zod schema
const contactSchema = z.object({
  role: z.enum(values(ROLES)).default("owner"),
  name: z.string().trim().min(2, "Name too short").max(100),
  business: z.string().trim().max(120).optional(),
  // An email address or a PH mobile number (09xx… / +639…)
  contact: z
    .string()
    .trim()
    .max(254)
    .refine((v) => parseContact(v) !== null, "Enter an email address or a PH mobile number"),
  needs: z
    .array(z.enum(values(NEEDS)))
    .max(NEEDS.length)
    .default([]),
  budget: z.enum(values(BUDGETS)).optional(),
  message: z.string().trim().min(20, "Please tell me a little more").max(5000),
  // Honeypot — must be empty
  website_url: z.string().max(0, "Bot detected").optional(),
  // Turnstile
  "cf-turnstile-response": z.string().min(1, "Please complete the verification"),
  // Timing check (ms since form loaded)
  _loadTime: z.number().min(0).optional(),
  // Visit id for the Telegram feed — never allowed to fail the form
  _vid: z.string().regex(VISIT_ID).optional().catch(undefined),
});

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip in development
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

async function scoreLeadWithAI(data: {
  role: string;
  business?: string;
  needs: string;
  budget?: string;
  message: string;
}): Promise<string> {
  try {
    const response = await getAnthropic().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `A developer in Cebu builds custom booking, ordering, inventory and staff systems for local businesses. Assess this inquiry in 2-3 sentences: rate it High/Medium/Low as a lead and suggest the best angle for the first reply.

Reaching out as: ${data.role}
Business: ${data.business ?? "not given"}
Needs: ${data.needs || "not specified"}
Rough budget: ${data.budget ?? "not specified"}
Message: ${data.message.slice(0, 600)}`,
        },
      ],
    });
    return response.content[0]?.type === "text" ? response.content[0].text : "";
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  if (!features.contact) {
    return NextResponse.json({ error: "Contact form is disabled" }, { status: 404 });
  }
  const ip = req.headers.get("x-real-ip") ?? "unknown";

  try {
    // Per-IP rate limiting
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const timestamps = (submissions.get(ip) ?? []).filter((t) => now - t < hour);
    if (timestamps.length >= MAX_PER_HOUR) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    // Parse body
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: Object.values(fieldErrors).flat()[0] ?? "Validation failed",
          details: fieldErrors,
        },
        { status: 422 },
      );
    }

    const {
      role,
      name,
      business,
      contact,
      needs,
      budget,
      message,
      "cf-turnstile-response": turnstileToken,
      _loadTime,
    } = result.data;
    const { email, phone } = parseContact(contact) ?? {};
    const roleLabel = labelOf(ROLES, role);
    const needsLabel = needs.map((n) => labelOf(NEEDS, n)).join(", ");
    const budgetLabel = budget ? labelOf(BUDGETS, budget) : undefined;
    const who = business ? `${name} (${business})` : name;

    // Honeypot check (already validated as empty by Zod)
    // Timing check — reject if form submitted in under 3 seconds
    if (_loadTime !== undefined && _loadTime < 3000) {
      return NextResponse.json({ success: true }); // Silent reject
    }

    // Verify Turnstile
    const turnstileOk = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 403 },
      );
    }

    const aiAssessment = await scoreLeadWithAI({
      role: roleLabel,
      business,
      needs: needsLabel,
      budget: budgetLabel,
      message,
    });

    // Telegram lead alert — queued before the emails so it still lands if Resend fails
    if (isTelegramEnabled()) {
      const place = describePlace(req.headers);
      const buttons = [
        // Telegram buttons only accept https, so replying goes via Gmail's compose URL.
        // Phone numbers in the message body are tappable already.
        email && {
          text: "✉️ Reply",
          url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Re: your inquiry")}`,
        },
        {
          text: "🔍 Look up",
          url: `https://www.google.com/search?q=${encodeURIComponent(`${business ?? name} Cebu`)}`,
        },
      ].filter(Boolean) as { text: string; url: string }[];
      after(() =>
        notify(
          [
            ["📨 <b>Contact form</b>", esc(roleLabel), budgetLabel && esc(budgetLabel)]
              .filter(Boolean)
              .join(" · "),
            `<b>${esc(who)}</b> · ${esc(email ?? phone ?? contact)}`,
            needsLabel && `Needs: ${esc(needsLabel)}`,
            `<blockquote expandable>${esc(clip(message, 1500))}</blockquote>`,
            aiAssessment && `🤖 ${esc(aiAssessment)}`,
            [esc(place), visitTag(result.data._vid)].filter(Boolean).join(" · "),
          ]
            .filter(Boolean)
            .join("\n"),
          { topic: "leads", buttons },
        ),
      );
    }

    // Notification email to Michael
    await getResend().emails.send({
      from: "Portfolio Contact <noreply@michaelpadin.com>",
      to: process.env.CONTACT_EMAIL ?? "hello@michaelpadin.com",
      ...(email && { replyTo: email }),
      subject: `[Portfolio] New inquiry from ${who}`,
      html: contactNotification({
        name,
        business,
        email,
        phone,
        role: roleLabel,
        needs: needsLabel,
        budget: budgetLabel,
        message: esc(message).replace(/\n/g, "<br>"),
        aiAssessment: aiAssessment || undefined,
        ip,
      }),
    });

    // Auto-reply, only when they left an email address
    if (email) {
      const firstName = name.split(" ")[0] ?? name;
      await getResend().emails.send({
        from: "Michael Padin <hello@michaelpadin.com>",
        to: email,
        subject: `Got your message, ${firstName}!`,
        html: contactAutoReply({ firstName, business }),
      });
    }

    // Log successful submission
    submissions.set(ip, [...timestamps, now]);

    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("contact", "Failed to process submission", {
      error: err instanceof Error ? err.message : String(err),
    });
    after(() => notifyError("Contact form", err, { ip }));
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
