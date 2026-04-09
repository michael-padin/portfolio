import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { features } from "@/lib/features";

const resend = new Resend(process.env.RESEND_API_KEY!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Rate limiting
const submissions = new Map<string, number[]>();
const MAX_PER_HOUR = 3;

// Zod schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(254)
    .refine((e) => !e.includes("\r") && !e.includes("\n"), "Invalid email"),
  subject: z.string().trim().min(5).max(200),
  message: z.string().trim().min(20, "Please provide more detail").max(5000),
  type: z.enum(["client", "employer", "other"]).optional(),
  budget: z.string().optional(),
  // Honeypot — must be empty
  website_url: z.string().max(0, "Bot detected").optional(),
  // Turnstile
  "cf-turnstile-response": z.string().min(1, "Please complete the verification"),
  // Timing check (ms since form loaded)
  _loadTime: z.number().min(0).optional(),
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
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: string;
  budget?: string;
}): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Analyze this contact form submission for a freelance full-stack developer and give a brief assessment (2-3 sentences max). Rate lead quality (High/Medium/Low) and suggest the best reply angle.

Name: ${data.name}
Email domain: ${data.email.split("@")[1]}
Type: ${data.type ?? "unknown"}
Subject: ${data.subject}
Budget mentioned: ${data.budget ?? "not specified"}
Message: ${data.message.slice(0, 300)}`,
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

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
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const {
      name,
      email,
      subject,
      message,
      type,
      budget,
      "cf-turnstile-response": turnstileToken,
      _loadTime,
    } = result.data;

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

    // AI lead scoring (non-blocking, runs in background)
    const aiAssessmentPromise = scoreLeadWithAI({
      name,
      email,
      subject,
      message,
      type,
      budget,
    });

    // Sanitize message for email
    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

    const aiAssessment = await aiAssessmentPromise;

    // Send notification email to Michael
    await resend.emails.send({
      from: "Portfolio Contact <noreply@michaelpadin.com>",
      to: process.env.CONTACT_EMAIL ?? "hello@michaelpadin.com",
      replyTo: email,
      subject: `[Portfolio] ${subject} — from ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <div style="background:#080c14;border:1px solid #1e3044;border-radius:12px;padding:24px;margin-bottom:16px">
            <h2 style="color:#00d4ff;margin:0 0 16px;font-size:18px">New contact from ${name}</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="color:#8fa3be;padding:4px 0;width:100px">Name</td><td style="color:#e8f0fe">${name}</td></tr>
              <tr><td style="color:#8fa3be;padding:4px 0">Email</td><td style="color:#e8f0fe"><a href="mailto:${email}" style="color:#00d4ff">${email}</a></td></tr>
              <tr><td style="color:#8fa3be;padding:4px 0">Type</td><td style="color:#e8f0fe">${type ?? "Not specified"}</td></tr>
              ${budget ? `<tr><td style="color:#8fa3be;padding:4px 0">Budget</td><td style="color:#e8f0fe">${budget}</td></tr>` : ""}
              <tr><td style="color:#8fa3be;padding:4px 0">Subject</td><td style="color:#e8f0fe">${subject}</td></tr>
            </table>
          </div>
          <div style="background:#0d1420;border:1px solid #1e3044;border-radius:12px;padding:20px;margin-bottom:16px">
            <p style="color:#8fa3be;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Message</p>
            <p style="color:#e8f0fe;margin:0;line-height:1.7">${safeMessage}</p>
          </div>
          ${
            aiAssessment
              ? `
          <div style="background:#0d2020;border:1px solid #00d4ff33;border-radius:12px;padding:16px">
            <p style="color:#00d4ff;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">🤖 AI Lead Assessment</p>
            <p style="color:#8fa3be;margin:0;font-size:13px;line-height:1.6">${aiAssessment}</p>
          </div>`
              : ""
          }
          <p style="color:#4a6080;font-size:11px;margin-top:16px">Sent from michaelpadin.com · IP: ${ip}</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: "Michael Padin <hello@michaelpadin.com>",
      to: email,
      subject: `Got your message, ${name.split(" ")[0]}!`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#00d4ff;margin:0 0 16px">Thanks for reaching out!</h2>
          <p style="color:#8fa3be;line-height:1.7">Hi ${name.split(" ")[0]},</p>
          <p style="color:#8fa3be;line-height:1.7">I received your message about "<strong style="color:#e8f0fe">${subject}</strong>" and I'll get back to you within 24 hours.</p>
          <p style="color:#8fa3be;line-height:1.7">If you need something urgent, feel free to connect on <a href="https://linkedin.com/in/michael-padin" style="color:#00d4ff">LinkedIn</a>.</p>
          <p style="color:#8fa3be;line-height:1.7">— Michael</p>
          <hr style="border:none;border-top:1px solid #1e3044;margin:24px 0"/>
          <p style="color:#4a6080;font-size:12px">michaelpadin.com · Cebu, Philippines (UTC+8)</p>
        </div>
      `,
    });

    // Log successful submission
    submissions.set(ip, [...timestamps, now]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
