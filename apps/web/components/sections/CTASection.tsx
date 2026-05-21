"use client";
import { useState } from "react";
import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function CTASection({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const available = profile.availableForFreelance || profile.availableForFullTime;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section className="relative py-[clamp(5rem,8vw,8rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Section title */}
        <header className="border-paper-rule flex items-end justify-between border-b pb-3">
          <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
            Signature
          </h2>
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            §04 · Reach out
          </span>
        </header>

        <div className="mt-[clamp(3rem,5vw,5rem)] grid grid-cols-12 gap-x-6 gap-y-6">
          {/* Statement */}
          <div className="col-span-12 lg:col-span-7">
            <p className="font-spec text-ink max-w-[24ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.025em]">
              Have engineering work that needs a steady pair of hands? Write.
            </p>
          </div>

          {/* Signature block */}
          <div className="col-span-12 lg:col-span-5 lg:pt-3">
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-[14px]">
              <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
                Email
              </dt>
              <dd>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="font-spec-mono text-ink hover:text-signal border-ink hover:border-signal group inline-flex items-center gap-3 border-b pb-px text-[15px] transition-colors"
                  aria-label={`Copy email ${profile.email}`}
                >
                  <span>{profile.email}</span>
                  <span
                    aria-live="polite"
                    className={`font-spec text-[11px] tracking-[0.04em] uppercase transition-opacity ${
                      copied
                        ? "text-signal opacity-100"
                        : "text-ink-3 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {copied ? "copied" : "copy"}
                  </span>
                </button>
              </dd>

              <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
                Where
              </dt>
              <dd className="font-spec text-ink-2">
                {profile.location}{" "}
                <span className="text-ink-3 font-spec-mono ml-1 text-[12px]">
                  · {profile.timezone}
                </span>
              </dd>

              <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
                Reply
              </dt>
              <dd className="font-spec text-ink-2">
                Within <span className="font-spec-mono text-ink tabular-nums">~24h</span>{" "}
                <span className="text-ink-3">on weekdays</span>
              </dd>

              <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
                Status
              </dt>
              <dd className="font-spec inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${available ? "bg-signal" : "bg-ink-3"}`}
                />
                <span className={available ? "text-signal font-medium" : "text-ink-2"}>
                  {available ? profile.availabilityNote : "Not currently available"}
                </span>
              </dd>

              {(profile.githubUrl || profile.linkedinUrl) && (
                <>
                  <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
                    Elsewhere
                  </dt>
                  <dd className="font-spec text-ink-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-signal border-ink-3 hover:border-signal border-b pb-px transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-signal border-ink-3 hover:border-signal border-b pb-px transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(4rem,6vw,6rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            End of document · {profile.name}
          </span>
          <span className="font-spec-mono text-ink-3 text-[11px] tabular-nums">
            REV {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </section>
  );
}
