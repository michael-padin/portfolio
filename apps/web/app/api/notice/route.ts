import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import {
  VISIT_ID,
  clip,
  esc,
  formatDuration,
  isTelegramEnabled,
  notify,
  visitTag,
} from "@/lib/telegram";
import { describeDevice, describePlace, isBot, localTime } from "@/lib/visitor";

/**
 * Browser events → Telegram "Visits" topic, plus "Leads" for high-intent clicks.
 *
 * The first event of a visit posts a loud visitor card and returns its message
 * id. The browser echoes that id back, so later page views and clicks thread
 * under the card as silent replies.
 */

const vid = z.string().regex(VISIT_ID);
const path = z.string().startsWith("/").max(300);
const mid = z.number().int().positive().optional();
/** Seconds since the visit began, capped at a day. */
const at = z.number().int().min(0).max(86_400).optional();

const eventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("visit"),
    vid,
    path,
    referrer: z.string().max(500).optional(),
    utm: z
      .object({
        source: z.string().max(100),
        medium: z.string().max(100),
        campaign: z.string().max(100),
      })
      .partial()
      .optional(),
    visitNo: z.number().int().min(1).max(100_000),
  }),
  z.object({ type: z.literal("pageview"), vid, mid, path, at }),
  z.object({
    type: z.literal("click"),
    vid,
    mid,
    path,
    at,
    label: z.string().max(80),
    href: z.string().max(500).optional(),
    area: z.enum(["footer"]).optional(),
    source: z.string().max(200).optional(),
  }),
  z.object({ type: z.literal("leave"), vid, mid, path, at }),
]);

type Utm = { source?: string; medium?: string; campaign?: string };

/**
 * visit id → card message id. The browser reports this itself, but it never
 * learns the id if the page is reloaded while the first request is still in
 * flight — so remember it here too, and events keep threading either way.
 * Per instance and short-lived, like the rate limiter in proxy.ts.
 */
const visitCards = new Map<string, { mid: number; at: number }>();
const CARD_TTL_MS = 2 * 60 * 60_000;

function rememberCard(visitId: string, messageId: number) {
  visitCards.set(visitId, { mid: messageId, at: Date.now() });
  if (visitCards.size > 500) {
    const cutoff = Date.now() - CARD_TTL_MS;
    for (const [key, card] of visitCards) {
      if (card.at < cutoff) visitCards.delete(key);
    }
  }
}

function recallCard(visitId: string): number | undefined {
  const card = visitCards.get(visitId);
  if (!card) return undefined;
  if (Date.now() - card.at > CARD_TTL_MS) {
    visitCards.delete(visitId);
    return undefined;
  }
  return card.mid;
}

/** Browsers always send Origin on fetch POST; this turns away cross-site and naive scripted posts. */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  try {
    return !!origin && new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function sourceOf(referrer?: string, utm?: Utm): string {
  if (utm?.source) return [utm.source, utm.medium, utm.campaign].filter(Boolean).join(" / ");
  if (!referrer) return "direct";
  try {
    // Native apps report android-app://com.linkedin.android — hostname covers both.
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

/** Escaped HTML for the click, and whether it signals real intent (→ Leads topic). */
function describeClick(label: string, href?: string): { html: string; intent: boolean } {
  let url: URL | null = null;
  try {
    url = href ? new URL(href) : null;
  } catch {
    // unparseable href — fall through to the label
  }

  if (label === "copy-email") return { html: "📋 <b>Copied email address</b>", intent: true };
  if (label === "open-chat") return { html: "💬 Opened the chat", intent: false };
  if (url?.protocol === "mailto:") return { html: "✉️ <b>Clicked email link</b>", intent: true };
  if (url && /(^|\.)(cal\.com|calendly\.com)$/.test(url.hostname)) {
    return { html: "📅 <b>Clicked Book a call</b>", intent: true };
  }
  if (
    url &&
    (url.pathname.endsWith(".pdf") ||
      (url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/files/")))
  ) {
    return { html: "📄 <b>Opened résumé</b>", intent: true };
  }

  const target = url?.hostname
    ? ` → ${esc(clip(url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, ""), 60))}`
    : "";
  return { html: `↗ ${esc(label || "link")}${target}`, intent: false };
}

export async function POST(req: NextRequest) {
  if (!isTelegramEnabled()) return new NextResponse(null, { status: 204 });
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });

  const parsed = eventSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });

  const event = parsed.data;
  const place = esc(describePlace(req.headers));
  const device = esc(describeDevice(ua));
  const where = `<code>${esc(event.path)}</code>`;

  // ── New visit: loud card; its id goes back so the browser can thread replies ──
  if (event.type === "visit") {
    const source = sourceOf(event.referrer, event.utm);
    const time = localTime(req.headers);
    const messageId = await notify(
      [
        event.visitNo > 1
          ? `🔁 <b>Returning visitor</b> · visit #${event.visitNo}`
          : "🟢 <b>New visitor</b>",
        time ? `${place} · ${time} there` : place,
        `via <b>${esc(source)}</b>`,
        `landed on ${where}`,
        `${device} · ${visitTag(event.vid)}`,
      ].join("\n"),
      { topic: "visits" },
    );
    if (messageId) rememberCard(event.vid, messageId);
    return NextResponse.json({ mid: messageId, source });
  }

  // ── Everything else: silent replies under the visit card ──
  const replyTo = event.mid ?? recallCard(event.vid);
  // With no card to reply to, keep the hashtag so the event stays searchable.
  const orphanTag = replyTo ? "" : ` · ${visitTag(event.vid)}`;
  const elapsed = event.at === undefined ? "" : ` · ${formatDuration(event.at)} in`;

  after(async () => {
    if (event.type === "pageview") {
      await notify(`↳ ${where}${elapsed}${orphanTag}`, {
        topic: "visits",
        silent: true,
        replyTo,
      });
      return;
    }

    if (event.type === "leave") {
      await notify(`⏱ left from ${where} after ${formatDuration(event.at ?? 0)}${orphanTag}`, {
        topic: "visits",
        silent: true,
        replyTo,
      });
      return;
    }

    const { html, intent } = describeClick(event.label, event.href);
    const area = event.area ? ` (${event.area})` : "";
    await notify(`${html} · on ${where}${area}${elapsed}${orphanTag}`, {
      topic: "visits",
      silent: true,
      replyTo,
    });

    if (intent) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://michaelpadin.com";
      await notify(
        [
          `🔥 ${html}`,
          `${place} · via <b>${esc(event.source ?? "unknown")}</b>`,
          [
            `on ${where}${area}`,
            event.at === undefined ? null : `after ${formatDuration(event.at)} on the site`,
            device,
            visitTag(event.vid),
          ]
            .filter(Boolean)
            .join(" · "),
        ].join("\n"),
        {
          topic: "leads",
          buttons: [{ text: `↗ Open ${clip(event.path, 24)}`, url: `${siteUrl}${event.path}` }],
        },
      );
    }
  });

  return new NextResponse(null, { status: 202 });
}
