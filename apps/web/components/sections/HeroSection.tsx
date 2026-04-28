"use client";
import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/sanity";
import { features } from "@/lib/features";

interface Props {
  profile: Profile;
  resumeUrl?: string | null;
}

export function HeroSection({ profile, resumeUrl }: Props) {
  const [mode, setMode] = useState<"client" | "employer">("client");

  const content = {
    client: {
      eyebrow: profile.availableForFreelance
        ? "Available for freelance projects"
        : "Currently not taking freelance",
      headline: profile.heroTaglineClient,
      sub: profile.heroSubClient,
      cta1: features.contact
        ? { label: "Start a project", href: "/contact" }
        : { label: "See my work", href: "/#projects" },
      cta2: { label: "See my work", href: "/#projects" },
    },
    employer: {
      eyebrow: profile.availableForFullTime
        ? "Open to full-time remote roles"
        : "Not currently job hunting",
      headline: profile.heroTaglineEmployer,
      sub: profile.heroSubEmployer,
      cta1: resumeUrl
        ? { label: "Download resume", href: resumeUrl }
        : { label: "View projects", href: "/#projects" },
      cta2: { label: "View projects", href: "/#projects" },
    },
  };

  const c = content[mode];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20 pb-16">
      {/* Ambient orbs */}
      <div className="bg-accent/5 pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-accent/[0.03] pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 w-full">
        {/* Visitor toggle */}
        <div className="mb-10 flex justify-start">
          <div className="bg-surface border-surface-border flex items-center gap-1 rounded-xl border p-1">
            {(["client", "employer"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
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

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_auto]">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="label-tag mb-6">
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                  (mode === "client" ? profile.availableForFreelance : profile.availableForFullTime)
                    ? "bg-success"
                    : "bg-error"
                }`}
              />
              {c.eyebrow}
            </div>

            {/* Headline */}
            <h1 className="text-display-xl text-text-primary mb-6">
              <HeadlineWithAccent text={c.headline} />
            </h1>

            {/* Sub */}
            <p className="text-text-secondary mb-8 max-w-2xl text-lg leading-relaxed">{c.sub}</p>

            {/* CTAs */}
            <div className="mb-12 flex flex-wrap gap-3">
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
                  <div className="font-display text-accent text-2xl">{value}</div>
                  <div className="text-text-muted mt-0.5 text-xs">{label}</div>
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
        <div className="text-text-muted animate-float absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-xs">scroll</span>
          <div className="from-text-muted h-8 w-px bg-gradient-to-b to-transparent" />
        </div>
      </div>
    </section>
  );
}

const ACCENT_PHRASES = ["actually work.", "join your team."];

function HeadlineWithAccent({ text }: { text: string }) {
  for (const phrase of ACCENT_PHRASES) {
    if (text.includes(phrase)) {
      const [before] = text.split(phrase);
      return (
        <>
          {before}
          <span className="text-accent text-glow italic">{phrase}</span>
        </>
      );
    }
  }
  return <>{text}</>;
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
    <div className="card w-72 overflow-hidden">
      {/* Title bar */}
      <div className="bg-surface border-surface-border flex items-center gap-2 border-b px-4 py-3">
        <span className="bg-error/70 h-3 w-3 rounded-full" />
        <span className="bg-warning/70 h-3 w-3 rounded-full" />
        <span className="bg-success/70 h-3 w-3 rounded-full" />
        <span className="text-text-muted ml-2 font-mono text-xs">
          {name.toLowerCase().replace(" ", "@")} ~
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2 p-4 font-mono text-xs">
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
        <div className="flex flex-wrap gap-1.5 pt-1 pl-3">
          {skills.slice(0, 10).map((s) => (
            <span
              key={s}
              className="text-2xs bg-accent-subtle text-accent border-accent/20 rounded border px-1.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <span className="text-accent">❯</span>
          <span className="text-text-muted"> status</span>
        </div>
        <div className="flex items-center gap-2 pl-3">
          <span
            className={`h-1.5 w-1.5 rounded-full ${available ? "bg-success animate-pulse" : "bg-error"}`}
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
