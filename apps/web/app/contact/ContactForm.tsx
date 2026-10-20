"use client";
import { useState, useRef } from "react";
import Turnstile from "react-turnstile";
import { currentVisitId } from "@/lib/track";
import { BUDGETS, NEEDS, ROLES, parseContact, type Need, type Role } from "@/lib/contact-options";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [role, setRole] = useState<Role>("owner");
  const [needs, setNeeds] = useState<Need[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const loadTimeRef = useRef(Date.now());

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const toggleNeed = (n: Need) =>
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const fd = new FormData(e.currentTarget);
    const contact = String(fd.get("contact") ?? "");
    if (!parseContact(contact)) {
      setStatus("error");
      setErrorMsg("Please enter an email address or a PH mobile number (09xx xxx xxxx).");
      return;
    }
    if (!turnstileToken && siteKey && !turnstileFailed) {
      setStatus("error");
      setErrorMsg("Please complete the verification widget.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      role,
      name: fd.get("name"),
      business: fd.get("business") || undefined,
      contact,
      needs,
      budget: fd.get("budget") || undefined,
      message: fd.get("message"),
      website_url: fd.get("website_url"),
      "cf-turnstile-response": turnstileToken,
      _loadTime: Date.now() - loadTimeRef.current,
      _vid: currentVisitId(),
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
      setNeeds([]);
      formRef.current?.reset();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="shadow-form flex flex-col items-start gap-3 rounded-[24px] bg-white p-6 md:p-9">
        <h2 className="text-[32px] leading-[1.1] md:text-[40px]">Message sent</h2>
        <p className="text-muted text-[16px] leading-normal">
          I&apos;ll reply within a day, usually sooner.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            loadTimeRef.current = Date.now();
          }}
          className="link-mango mt-3 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="shadow-form flex flex-col gap-[18px] rounded-[24px] bg-white p-[22px] md:gap-[22px] md:p-9"
    >
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-[14px] font-semibold">I&apos;m reaching out as</legend>
        <div role="radiogroup" className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={role === r.value}
              onClick={() => setRole(r.value)}
              className="chip"
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-[18px] md:grid-cols-2 md:gap-4">
        <Label text="Your name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Juan dela Cruz"
            className="field"
          />
        </Label>
        <Label text="Business name" htmlFor="business" optional>
          <input
            id="business"
            name="business"
            type="text"
            maxLength={120}
            autoComplete="organization"
            placeholder="Luna Salon"
            className="field"
          />
        </Label>
      </div>

      <Label text="Email or mobile number" htmlFor="contact">
        <input
          id="contact"
          name="contact"
          type="text"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@business.com or 09xx xxx xxxx"
          className="field"
        />
      </Label>

      <fieldset className="flex flex-col">
        <legend className="mb-2.5 text-[14px] font-semibold">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <button
              key={n.value}
              type="button"
              aria-pressed={needs.includes(n.value)}
              onClick={() => toggleNeed(n.value)}
              className="chip"
            >
              {n.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Label text="Rough budget" htmlFor="budget" optional>
        <div className="relative">
          <select id="budget" name="budget" defaultValue="" className="field appearance-none pr-10">
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[oklch(58%_0.02_50)]"
          >
            ▾
          </span>
        </div>
      </Label>

      <Label text="Tell me about your business" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          placeholder="How do you handle bookings or orders today? What makes you sigh every morning?"
          className="field resize-y"
        />
      </Label>

      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website_url">Website URL</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile hides itself if the widget can't load. Honeypot + timing
         check still protect the endpoint. */}
      {siteKey && !turnstileFailed && (
        <Turnstile
          sitekey={siteKey}
          onVerify={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileFailed(true)}
          theme="light"
          size="flexible"
        />
      )}
      {turnstileFailed && (
        <p className="text-subtle text-[13px]">
          The verification widget didn&apos;t load. If sending fails, email me at{" "}
          <a href={`mailto:${email}`} className="link-mango">
            {email}
          </a>
          .
        </p>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="rounded-[14px] bg-[oklch(95%_0.04_40)] px-4 py-3 text-[14px] text-[oklch(42%_0.14_35)]"
        >
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="text-subtle text-[13px]">I reply within 24 hours, Mon–Fri.</span>
        <button type="submit" disabled={status === "submitting"} className="btn btn-dark px-7">
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Label({
  text,
  htmlFor,
  optional,
  children,
}: {
  text: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold">
        {text}
        {optional && <span className="text-subtle font-normal"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}
