"use client";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { currentVisitId } from "@/lib/track";
import { Mark } from "@/components/brand/Logo";

const SUGGESTED = [
  "How much is a system?",
  "Can I take bookings online?",
  "How long does it take?",
];

// Answers that point at a call get "Book a call" / "Not yet" pills underneath.
const OFFERS_CALL = /\b(book|call)\b/i;

function getMessageText(msg: UIMessage): string {
  let text = "";
  for (const part of msg.parts) {
    if (part.type === "text") text += part.text;
  }
  return text;
}

const bubble = "max-w-[85%] px-3.5 py-3 text-[15px] leading-[1.45]";

export function ChatBot({ bookingUrl }: { bookingUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat();
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [messages, open, status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    if (!text.trim() || isBusy) return;
    setInput("");
    await sendMessage({ text }, { body: { vid: currentVisitId() } });
  }

  const last = messages.at(-1);
  const showQuickReplies =
    !!bookingUrl &&
    status === "ready" &&
    last?.role === "assistant" &&
    dismissedFor !== last.id &&
    OFFERS_CALL.test(getMessageText(last));

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-track="open-chat"
          className="bg-ink text-paper shadow-float hover:bg-ink-hover fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-full py-[11px] pr-5 pl-3 text-[15px] font-semibold transition-colors duration-200 md:right-7 md:bottom-7 md:py-[13px] md:pl-3.5"
        >
          <span aria-hidden className="bg-mango size-[26px] rounded-full" />
          Ask me anything
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Michael's assistant"
          className="bg-paper fixed right-3 bottom-3 left-3 z-50 flex max-h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-[24px] shadow-[0_20px_50px_oklch(30%_0.03_50/0.25)] sm:left-auto sm:w-[380px] md:right-7 md:bottom-7"
        >
          <div className="bg-ink text-paper flex items-center gap-3 px-[18px] py-4">
            <div className="bg-mango flex size-10 shrink-0 items-center justify-center rounded-full">
              <Mark size={26} bowl="var(--color-paper)" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-heading text-[17px]">Michael&apos;s assistant</div>
              <div className="flex items-center gap-1.5 text-[12px] opacity-80">
                <span aria-hidden className="size-1.5 rounded-full bg-[oklch(75%_0.13_160)]" />
                Online · Michael follows up personally
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="-mr-2 flex size-11 items-center justify-center text-[22px] opacity-70 transition-opacity hover:opacity-100"
            >
              ×
            </button>
          </div>

          <div className="flex min-h-[300px] flex-1 flex-col gap-3 overflow-y-auto p-[18px]">
            <div className={`${bubble} self-start rounded-[18px_18px_18px_6px] bg-white`}>
              Hi! I&apos;m Michael&apos;s assistant. Ask about what he builds, prices, timelines or
              availability.{" "}
              <span className="highlight">I don&apos;t drink coffee, so I&apos;m up 24/7.</span>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={isBusy}
                    className="hover:border-ink rounded-full border-[1.5px] border-[oklch(85%_0.03_60)] px-3 py-2 text-[13px] font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return msg.role === "user" ? (
                <div
                  key={msg.id}
                  className={`${bubble} bg-mango self-end rounded-[18px_18px_6px_18px]`}
                >
                  {text}
                </div>
              ) : (
                <div
                  key={msg.id}
                  className={`${bubble} self-start rounded-[18px_18px_18px_6px] bg-white`}
                >
                  {text}
                </div>
              );
            })}

            {showQuickReplies && (
              <div className="flex gap-2">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="book-call-chat"
                  className="bg-ink text-paper hover:bg-ink-hover rounded-full px-3.5 py-[9px] text-[13px] font-semibold transition-colors duration-200"
                >
                  Book a call
                </a>
                <button
                  type="button"
                  onClick={() => setDismissedFor(last!.id)}
                  className="border-rule hover:border-ink rounded-full border-[1.5px] px-3.5 py-[9px] text-[13px] font-semibold transition-colors duration-200"
                >
                  Not yet
                </button>
              </div>
            )}

            {status === "submitted" && (
              <div
                className="flex items-center gap-1 self-start rounded-[18px_18px_18px_6px] bg-white px-4 py-4"
                aria-label="Assistant is typing"
              >
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="bg-subtle size-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-[14px] bg-[oklch(95%_0.04_40)] px-3.5 py-2.5 text-[13px] text-[oklch(42%_0.14_35)]"
              >
                {error.message || "Something went wrong. Try again in a moment."}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-[oklch(90%_0.015_70)] p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              maxLength={500}
              className="placeholder:text-subtle min-w-0 flex-1 rounded-full bg-white px-4 py-3 text-[15px] outline-none focus-visible:outline-2 focus-visible:outline-offset-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              aria-label="Send"
              className="bg-ink hover:bg-ink-hover flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-colors duration-200 disabled:opacity-40"
            >
              ↑
            </button>
          </form>
          <p className="text-subtle px-3 pb-3 text-center text-[11px]">
            AI replies may not be 100% accurate
          </p>
        </div>
      )}
    </>
  );
}
