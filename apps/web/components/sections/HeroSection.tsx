"use client";
import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function HeroSection({ profile }: Props) {
  const [mode, setMode] = useState<"client" | "employer">("client");

  const content = {
    client: {
      eyebrow: profile.availableForFreelance
        ? "Available for freelance projects"
        : "Currently not taking freelance",
      headline: profile.heroTaglineClient,
      sub: profile.heroSubClient,
      cta1: { label: "Start a project", href: "/contact" },
      cta2: { label: "See my work", href: "/#projects" },
    },
    employer: {
      eyebrow: profile.availableForFullTime
        ? "Open to full-time remote roles"
        : "Not currently job hunting",
      headline: profile.heroTaglineEmployer,
      sub: profile.heroSubEmployer,
      cta1: { label: "Download resume", href: "/MichaelPadinResume.pdf" },
      cta2: { label: "View projects", href: "/#projects" },
    },
  };

  const c = content[mode];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(0,212,170,0.05)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(0,212,170,0.03)" }}
      />

      <div className="container-custom relative z-10 w-full">
        {/* Visitor toggle */}
        <div className="flex justify-start mb-10">
          <div
            className="flex items-center gap-1 p-1 rounded-xl border border-surface-border"
            style={{ background: "var(--color-surface)" }}
          >
            {(["client", "employer"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === v
                    ? "bg-accent text-bg shadow-glow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                I&apos;m {v === "employer" ? "a Recruiter" : "a Client"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="label-tag mb-6">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  (mode === "client" ? profile.availableForFreelance : profile.availableForFullTime)
                    ? "bg-success"
                    : "bg-error"
                }`}
              />
              {c.eyebrow}
            </div>

            {/* Headline */}
            <h1 className="text-display-xl text-text-primary mb-6">
              {c.headline.split("actually work.")[0]}
              {c.headline.includes("actually work.") && (
                <span
                  className="text-accent italic"
                  style={{ textShadow: "0 0 40px rgba(0,212,170,0.5)" }}
                >
                  actually work.
                </span>
              )}
              {!c.headline.includes("actually work.") &&
                !c.headline.includes("join your team.") &&
                c.headline}
              {c.headline.includes("join your team.") && (
                <>
                  {c.headline.split("join your team.")[0]}
                  <span
                    className="text-accent italic"
                    style={{ textShadow: "0 0 40px rgba(0,212,170,0.5)" }}
                  >
                    join your team.
                  </span>
                </>
              )}
            </h1>

            {/* Sub */}
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mb-8">{c.sub}</p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Link href={c.cta1.href} className="btn-primary">
                {c.cta1.label}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href={c.cta2.href} className="btn-ghost">
                {c.cta2.label}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {profile.heroStats.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl text-accent">{value}</div>
                  <div className="text-text-muted text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — terminal */}
          <div className="hidden lg:block">
            <TerminalCard
              name={profile.name}
              title={profile.title}
              location={profile.location}
              skills={profile.terminalSkills}
              available={profile.availableForFreelance || profile.availableForFullTime}
              availabilityNote={profile.availabilityNote}
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-float">
          <span className="text-xs font-mono">scroll</span>
          <div
            className="w-px h-8"
            style={{
              background: "linear-gradient(to bottom, var(--color-text-muted), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function TerminalCard({
  name,
  title,
  location,
  skills,
  available,
  availabilityNote,
}: {
  name: string;
  title: string;
  location: string;
  skills: string[];
  available: boolean;
  availabilityNote: string;
}) {
  return (
    <div className="w-72 card overflow-hidden">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-surface-border"
        style={{ background: "var(--color-surface)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "rgba(239,68,68,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "rgba(245,158,11,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "rgba(34,197,94,0.7)" }} />
        <span className="ml-2 text-text-muted text-xs font-mono">
          {name.toLowerCase().replace(" ", "@")} ~
        </span>
      </div>

      {/* Body */}
      <div className="p-4 font-mono text-xs space-y-2">
        <div>
          <span className="text-accent">❯</span>
          <span className="text-text-muted"> whoami</span>
        </div>
        <div className="text-text-secondary pl-3">{title}</div>

        <div className="pt-1">
          <span className="text-accent">❯</span>
          <span className="text-text-muted"> location</span>
        </div>
        <div className="text-text-secondary pl-3">{location}</div>

        <div className="pt-1">
          <span className="text-accent">❯</span>
          <span className="text-text-muted"> cat skills.json</span>
        </div>
        <div className="pl-3 flex flex-wrap gap-1.5 pt-1">
          {skills.slice(0, 10).map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 rounded text-2xs border"
              style={{
                background: "var(--color-accent-subtle)",
                color: "var(--color-accent)",
                borderColor: "rgba(0,212,170,0.2)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <span className="text-accent">❯</span>
          <span className="text-text-muted"> status</span>
        </div>
        <div className="pl-3 flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${available ? "bg-success animate-pulse" : "bg-error"}`}
          />
          <span className={available ? "text-success" : "text-error"}>{availabilityNote}</span>
        </div>

        <div className="pt-1">
          <span className="text-accent">❯</span>
          <span className="animate-blink">█</span>
        </div>
      </div>
    </div>
  );
}
