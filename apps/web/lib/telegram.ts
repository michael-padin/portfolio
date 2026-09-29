import "server-only";
import { log } from "@/lib/logger";

/**
 * Telegram Bot API notifier — plain fetch, no SDK.
 *
 * Messages go to a forum supergroup split into Visits / Chats / Leads / Errors
 * topics. Topic ids are optional: unset ones land in General (or in your DM
 * with the bot when TELEGRAM_CHAT_ID is your own user id).
 */

export type Topic = "visits" | "chats" | "leads" | "errors";

/** Shape of the short visit id minted in the browser (lib/track.ts). */
export const VISIT_ID = /^[a-z0-9]{8}$/;

export function isTelegramEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

interface NotifyOptions {
  topic: Topic;
  /** Deliver without a sound or push notification. */
  silent?: boolean;
  /** Thread the message under an earlier one. */
  replyTo?: number;
  /** One row of tap-through buttons. Telegram only accepts https:// links. */
  buttons?: { text: string; url: string }[];
}

interface TelegramResponse {
  ok: boolean;
  result?: { message_id: number };
  description?: string;
  parameters?: { retry_after?: number };
}

/**
 * Sends an HTML-formatted message. Resolves to the new message id, or null on
 * any failure — alerts are best-effort and must never break a request.
 */
export async function notify(
  html: string,
  { topic, silent = false, replyTo, buttons }: NotifyOptions,
): Promise<number | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  const threadId = Number(process.env[`TELEGRAM_TOPIC_${topic.toUpperCase()}`]) || undefined;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_thread_id: threadId,
        text: html,
        parse_mode: "HTML",
        disable_notification: silent,
        link_preview_options: { is_disabled: true },
        reply_parameters: replyTo
          ? { message_id: replyTo, allow_sending_without_reply: true }
          : undefined,
        reply_markup: buttons?.length ? { inline_keyboard: [buttons] } : undefined,
      }),
      signal: AbortSignal.timeout(5000),
    });

    const data = (await res.json()) as TelegramResponse;
    if (!data.ok) {
      log.warn("telegram", "sendMessage rejected", {
        topic,
        status: res.status,
        description: data.description,
        retryAfter: data.parameters?.retry_after,
      });
      return null;
    }
    return data.result?.message_id ?? null;
  } catch (err) {
    log.error("telegram", "sendMessage failed", {
      topic,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

// An outage repeats the same failure on every request, so each one is muted
// after the first report. Per instance, like the rest of our in-memory state.
const reportedErrors = new Map<string, number>();
const ERROR_MUTE_MS = 10 * 60_000;

/** Reports a server-side failure to the Errors topic. Deduplicated, never throws. */
export async function notifyError(
  context: string,
  err: unknown,
  extra?: Record<string, string>,
): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  const key = `${context}:${message}`;
  const now = Date.now();

  const reportedAt = reportedErrors.get(key);
  if (reportedAt && now - reportedAt < ERROR_MUTE_MS) return;
  reportedErrors.set(key, now);

  if (reportedErrors.size > 50) {
    for (const [k, at] of reportedErrors) {
      if (now - at > ERROR_MUTE_MS) reportedErrors.delete(k);
    }
  }

  const lines = [`⚠️ <b>${esc(context)} failed</b>`, `<code>${esc(clip(message, 300))}</code>`];
  for (const [label, value] of Object.entries(extra ?? {})) {
    lines.push(`${esc(label)}: ${esc(clip(value, 100))}`);
  }
  await notify(lines.join("\n"), { topic: "errors" });
}

/** Escapes text for parse_mode HTML. Everything visitor-supplied must go through this. */
export function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** 8 → "8s", 134 → "2m 14s", 3780 → "1h 3m". */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const rest = seconds % 60;
    return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return restMinutes ? `${hours}h ${restMinutes}m` : `${hours}h`;
}

/** Clickable, searchable hashtag that ties a visit to its chats and leads. */
export function visitTag(vid?: string): string {
  return vid ? `#v_${vid}` : "";
}
