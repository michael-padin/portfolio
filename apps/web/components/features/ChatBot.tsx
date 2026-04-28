"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What's your tech stack?",
  "Are you available for freelance?",
  "Tell me about Image Edits",
  "What's your rate?",
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hi! I'm Michael's AI assistant. Ask me anything about his skills, experience, availability, or projects.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-accent text-bg shadow-glow-md hover:shadow-glow-lg hover:bg-accent-dim animate-pulse-glow fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200"
        aria-label="Open AI chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8 10h.01M12 10h.01M16 10h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="border-surface-border bg-bg-secondary animate-fade-up fixed right-6 bottom-24 z-50 flex max-h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="bg-surface border-surface-border flex items-center gap-3 border-b px-4 py-3">
            <div className="relative">
              <div className="bg-accent-subtle border-accent/30 text-accent font-display flex h-8 w-8 items-center justify-center rounded-full border text-sm">
                M
              </div>
              <span className="bg-success border-bg-secondary absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2" />
            </div>
            <div>
              <div className="text-text-primary text-sm font-medium">Michael's AI</div>
              <div className="text-text-muted text-xs">Ask me anything</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary ml-auto transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-bg rounded-br-sm font-medium"
                      : "bg-surface text-text-primary border-surface-border rounded-bl-sm border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface text-text-muted border-surface-border flex gap-1 rounded-2xl rounded-bl-sm border px-4 py-3 text-sm">
                  <span
                    className="bg-text-muted h-1.5 w-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="bg-text-muted h-1.5 w-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="bg-text-muted h-1.5 w-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-error bg-error/10 border-error/20 rounded-lg border px-3 py-2 text-xs">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only before first user message) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="border-surface-border text-text-secondary hover:border-accent/40 hover:text-accent rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-surface-border border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Michael..."
                maxLength={500}
                className="bg-surface border-surface-border text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:ring-accent/20 flex-1 rounded-xl border px-4 py-2.5 text-sm transition-all focus:ring-1 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-accent text-bg hover:bg-accent-dim flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8h14M9 2l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            <p className="text-text-muted text-2xs mt-1.5 text-center">
              AI responses may not be 100% accurate · Max 20 msgs/session
            </p>
          </div>
        </div>
      )}
    </>
  );
}
