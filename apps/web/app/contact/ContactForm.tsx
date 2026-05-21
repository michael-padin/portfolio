"use client";
import { useState, useRef } from "react";
import Turnstile from "react-turnstile";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "font-spec text-ink placeholder:text-ink-3 border-paper-rule focus:border-signal focus:ring-signal/20 bg-paper w-full border px-3 py-2.5 text-[15px] transition-all focus:ring-2 focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [visitorType, setVisitorType] = useState<"client" | "employer" | "other">("client");
  const formRef = useRef<HTMLFormElement>(null);
  const loadTimeRef = useRef(Date.now());

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!turnstileToken && siteKey && !turnstileFailed) {
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
      <div className="border-paper-rule border-t border-b py-12 text-center">
        <p className="font-spec-mono text-signal text-[11px] tracking-[0.04em] uppercase">
          ✓ Transmitted
        </p>
        <h3 className="font-spec text-ink mt-3 text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
          Message sent
        </h3>
        <p className="font-spec text-ink-2 mt-2 text-[14px]">
          I&apos;ll reply within ~24h, usually sooner.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            loadTimeRef.current = Date.now();
          }}
          className="font-spec-mono text-ink-3 hover:text-signal mt-6 text-[11px] tracking-[0.04em] uppercase transition-colors"
        >
          ↶ Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
      {/* Visitor type */}
      <Field label="01" name="Reaching out as">
        <div className="flex flex-wrap gap-2">
          {(["client", "employer", "other"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setVisitorType(t)}
              className={`font-spec px-4 py-2 text-[14px] font-medium transition-colors ${
                visitorType === t
                  ? "text-paper bg-signal border-signal border"
                  : "text-ink-2 hover:text-signal hover:border-signal border-paper-rule border"
              }`}
            >
              {t === "client" ? "Client" : t === "employer" ? "Recruiter" : "Other"}
            </button>
          ))}
        </div>
      </Field>

      {/* Name */}
      <Field label="02" name="Name" required htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="Your name"
          className={inputClass}
        />
      </Field>

      {/* Email */}
      <Field label="03" name="Email" required htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          placeholder="you@company.com"
          className={inputClass}
        />
      </Field>

      {/* Subject */}
      <Field label="04" name="Subject" required htmlFor="subject">
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          placeholder={
            visitorType === "employer"
              ? "Senior React Developer, remote role"
              : "Project idea or question"
          }
          className={inputClass}
        />
      </Field>

      {/* Budget (client only) */}
      {visitorType === "client" && (
        <Field label="05" name="Approximate budget" htmlFor="budget">
          <select id="budget" name="budget" className={`${inputClass} appearance-none`}>
            <option value="">Select a range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 to $5,000</option>
            <option value="5k-15k">$5,000 to $15,000</option>
            <option value="15k-plus">$15,000+</option>
            <option value="ongoing">Ongoing / retainer</option>
          </select>
        </Field>
      )}

      {/* Message */}
      <Field
        label={visitorType === "client" ? "06" : "05"}
        name="Message"
        required
        htmlFor="message"
      >
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={6}
          placeholder={
            visitorType === "employer"
              ? "Tell me about the role, team, and tech stack."
              : visitorType === "client"
                ? "Describe your project, goals, and timeline."
                : "What's on your mind?"
          }
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website_url">Website URL</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile — hides itself if the widget can't connect or the domain
         isn't allowed. Honeypot + timing-check still protect the endpoint. */}
      {siteKey && !turnstileFailed && (
        <div>
          <Turnstile
            sitekey={siteKey}
            onVerify={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileFailed(true)}
            theme="light"
            size="normal"
          />
        </div>
      )}
      {turnstileFailed && (
        <p className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
          Verification widget unavailable. If submission fails, write to{" "}
          <a
            href="mailto:hello@michaelpadin.com"
            className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-px transition-colors"
          >
            hello@michaelpadin.com
          </a>{" "}
          directly.
        </p>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="border-signal text-signal bg-signal/10 font-spec border px-3 py-2 text-[13px]">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div className="border-paper-rule flex items-center justify-between border-t pt-5">
        <p className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
          Protected by Cloudflare Turnstile · No spam
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="font-spec text-paper bg-ink hover:bg-signal inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? (
            <>
              <span className="border-paper/30 border-t-paper size-3 animate-spin rounded-full border-2" />
              Transmitting
            </>
          ) : (
            <>
              Transmit
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  htmlFor,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="col-span-12 md:col-span-3">
        <label
          htmlFor={htmlFor}
          className="font-spec-mono text-ink-3 inline-flex items-baseline gap-2 text-[11px] tracking-[0.04em] uppercase"
        >
          <span className="text-signal tabular-nums">{label}</span>
          <span>{name}</span>
          {required && <span className="text-signal">*</span>}
        </label>
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
