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
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h3 className="font-display text-2xl text-text-primary mb-2">Message sent!</h3>
        <p className="text-text-secondary">I'll get back to you within 24 hours.</p>
        <button
          onClick={() => { setStatus("idle"); loadTimeRef.current = Date.now(); }}
          className="mt-6 btn-ghost text-sm"
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
        <label className="block text-text-secondary text-sm mb-2">I'm reaching out as a…</label>
        <div className="flex gap-2">
          {(["client", "employer", "other"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setVisitorType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                visitorType === t
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-surface-border text-text-muted hover:border-accent/30 hover:text-text-primary"
              }`}
            >
              {t === "client" ? "Potential client" : t === "employer" ? "Recruiter / Hiring" : "Other"}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-text-secondary text-sm mb-1.5" htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-1.5" htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@company.com"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-text-secondary text-sm mb-1.5" htmlFor="subject">Subject *</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          placeholder={visitorType === "employer" ? "Senior React Developer — Remote Role" : "Project idea or question"}
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Budget (client only) */}
      {visitorType === "client" && (
        <div>
          <label className="block text-text-secondary text-sm mb-1.5" htmlFor="budget">Approximate budget</label>
          <select
            id="budget"
            name="budget"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-accent/40 transition-all"
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
        <label className="block text-text-secondary text-sm mb-1.5" htmlFor="message">Message *</label>
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
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
        />
      </div>

      {/* Honeypot - hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website_url">Website URL</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
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
        <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>

      <p className="text-text-muted text-xs text-center">
        Protected by Cloudflare Turnstile · No spam, I reply personally.
      </p>
    </form>
  );
}
