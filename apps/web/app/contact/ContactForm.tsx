"use client";
import { useState, useRef } from "react";
import Turnstile from "react-turnstile";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [visitorType, setVisitorType] = useState<"client" | "employer" | "other">("client");
  const formRef = useRef<HTMLFormElement>(null);
  const loadTimeRef = useRef(Date.now());

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!turnstileToken && siteKey) {
      setErrorMsg("Please complete the verification widget.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      type: visitorType,
      budget: fd.get("budget"),
      // Honeypot
      website_url: fd.get("website_url"),
      "cf-turnstile-response": turnstileToken,
      _loadTime: Date.now() - loadTimeRef.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setStatus("success");
      formRef.current?.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatus("error");
      setErrorMsg(message);
    }
  }

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <div className="bg-success/10 border-success/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-3xl">
          ✓
        </div>
        <h3 className="font-display text-text-primary mb-2 text-2xl">Message sent!</h3>
        <p className="text-text-secondary">I'll get back to you within 24 hours.</p>
        <button
          onClick={() => {
            setStatus("idle");
            loadTimeRef.current = Date.now();
          }}
          className="btn-ghost mt-6 text-sm"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Visitor type */}
      <div>
        <label className="text-text-secondary mb-2 block text-sm">I'm reaching out as a…</label>
        <div className="flex gap-2">
          {(["client", "employer", "other"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setVisitorType(t)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                visitorType === t
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-surface-border text-text-muted hover:border-accent/30 hover:text-text-primary"
              }`}
            >
              {t === "client"
                ? "Potential client"
                : t === "employer"
                  ? "Recruiter / Hiring"
                  : "Other"}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-text-secondary mb-1.5 block text-sm" htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            className="bg-surface border-surface-border text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:ring-accent/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:ring-1 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1.5 block text-sm" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@company.com"
            className="bg-surface border-surface-border text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:ring-accent/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-text-secondary mb-1.5 block text-sm" htmlFor="subject">
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          placeholder={
            visitorType === "employer"
              ? "Senior React Developer — Remote Role"
              : "Project idea or question"
          }
          className="bg-surface border-surface-border text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:ring-accent/20 w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Budget (client only) */}
      {visitorType === "client" && (
        <div>
          <label className="text-text-secondary mb-1.5 block text-sm" htmlFor="budget">
            Approximate budget
          </label>
          <select
            id="budget"
            name="budget"
            className="bg-surface border-surface-border text-text-secondary focus:border-accent/40 w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none"
          >
            <option value="">Select a range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 – $5,000</option>
            <option value="5k-15k">$5,000 – $15,000</option>
            <option value="15k-plus">$15,000+</option>
            <option value="ongoing">Ongoing / retainer</option>
          </select>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="text-text-secondary mb-1.5 block text-sm" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          placeholder={
            visitorType === "employer"
              ? "Tell me about the role, team, and tech stack..."
              : visitorType === "client"
                ? "Describe your project, goals, and timeline..."
                : "What's on your mind?"
          }
          className="bg-surface border-surface-border text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:ring-accent/20 w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition-all focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Honeypot - hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website_url">Website URL</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile */}
      {siteKey && (
        <div>
          <Turnstile
            sitekey={siteKey}
            onVerify={(token) => setTurnstileToken(token)}
            theme="dark"
            size="normal"
          />
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="bg-error/10 border-error/30 text-error rounded-xl border px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full justify-center py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? (
          <>
            <span className="border-bg/30 border-t-bg h-4 w-4 animate-spin rounded-full border-2" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8h14M9 2l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      <p className="text-text-muted text-center text-xs">
        Protected by Cloudflare Turnstile · No spam, I reply personally.
      </p>
    </form>
  );
}
