"use client";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

const SUGGESTED = [
  "What's your tech stack?",
  "Are you available for freelance?",
  "Tell me about Image Edits",
  "What's your rate?",
];

const GREETING =
  "I'm Michael's assistant. Ask about his stack, projects, experience, availability, or rates.";

function getMessageText(msg: UIMessage): string {
  let text = "";
  for (const part of msg.parts) {
    if (part.type === "text") text += part.text;
  }
  return text;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat();
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open, status]);

  async function send(text: string) {
    if (!text.trim() || isBusy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`font-spec-mono fixed right-5 bottom-5 z-50 inline-flex h-11 items-center gap-2 px-4 text-[12px] tracking-[0.04em] uppercase transition-colors ${
          open
            ? "text-paper bg-signal border-signal border"
            : "text-paper bg-ink hover:bg-signal border-ink hover:border-signal border"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <>
            <span aria-hidden>×</span>
            Close
          </>
        ) : (
          <>
            <span aria-hidden className="bg-paper inline-block size-1.5 rounded-full" />
            Ask AI
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Ask Michael's AI assistant"
          className="bg-paper border-paper-rule fixed right-5 bottom-20 z-50 flex max-h-[560px] w-[min(380px,calc(100vw-2.5rem))] flex-col border shadow-[0_24px_48px_-12px_oklch(20%_0.02_270/0.18)]"
        >
          {/* Header */}
          <div className="border-paper-rule flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-baseline gap-2">
              <span className="font-spec text-ink text-[14px] font-medium">Michael&apos;s AI</span>
              <span className="font-spec-mono text-ink-3 text-[10px] tracking-[0.04em] uppercase">
                · assistant
              </span>
            </div>
            <span className="font-spec-mono text-ink-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.04em] uppercase">
              <span aria-hidden className="bg-signal size-1.5 animate-pulse rounded-full" />
              Online
            </span>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {/* Static greeting (not part of useChat state) */}
            <div className="flex justify-start">
              <div className="font-spec text-ink bg-paper-tint border-paper-rule max-w-[85%] border px-3 py-2 text-[13.5px] leading-[1.5]">
                {GREETING}
              </div>
            </div>

            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`font-spec max-w-[85%] px-3 py-2 text-[13.5px] leading-[1.5] ${
                      msg.role === "user"
                        ? "text-paper bg-signal border-signal border"
                        : "text-ink bg-paper-tint border-paper-rule border"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="bg-paper-tint border-paper-rule text-ink-3 inline-flex items-center gap-1 border px-3 py-2.5">
                  <span
                    className="bg-ink-3 size-1 animate-bounce rounded-full"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="bg-ink-3 size-1 animate-bounce rounded-full"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="bg-ink-3 size-1 animate-bounce rounded-full"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="border-signal text-signal bg-signal/10 font-spec border px-3 py-2 text-[12px]">
                {error.message ?? "Something went wrong"}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only before any user message) */}
          {messages.length === 0 && (
            <div className="border-paper-rule flex flex-wrap gap-1.5 border-t px-4 py-3">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={isBusy}
                  className="font-spec text-ink-2 hover:text-signal border-paper-rule hover:border-signal bg-paper border px-2 py-1 text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-paper-rule flex gap-2 border-t p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Michael…"
              maxLength={500}
              className="font-spec text-ink placeholder:text-ink-3 border-paper-rule focus:border-signal bg-paper flex-1 border px-3 py-2 text-[13.5px] transition-colors focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              className="font-spec text-paper bg-ink hover:bg-signal flex h-auto shrink-0 items-center px-4 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
          <p className="font-spec-mono text-ink-3 px-4 pb-3 text-center text-[10px] tracking-[0.04em] uppercase">
            AI replies may not be 100% accurate · 20 msg session limit
          </p>
        </div>
      )}
    </>
  );
}
