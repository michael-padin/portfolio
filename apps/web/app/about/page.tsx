import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, FALLBACK_PROFILE } from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null) ?? FALLBACK_PROFILE;
  return {
    title: "About",
    description: `${profile.name} — ${profile.title} based in ${profile.location}. ${profile.bioShort}`,
  };
}

export default async function AboutPage() {
  const profile = await getProfile().catch(() => null) ?? FALLBACK_PROFILE;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-main">
        {/* Header */}
        <div className="mb-16">
          <div className="label-tag mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            About me
          </div>
          <h1 className="text-display-xl text-text-primary mb-6">
            Developer, builder,{" "}
            <span className="italic" style={{
              background: "linear-gradient(135deg,#00d4aa,#00f0c0,#00b8d9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              problem solver.
            </span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            {profile.bioShort}
          </p>
        </div>

        {/* Values */}
        {profile.values.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl text-text-primary mb-8">How I work</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {profile.values.map((v) => (
                <div key={v.title} className="card p-6 hover:border-accent/30 transition-colors">
                  <div className="text-2xl mb-3">{v.emoji}</div>
                  <h3 className="text-text-primary font-semibold mb-2">{v.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-text-primary mb-8">Skills &amp; tools</h2>
          <div className="space-y-6">
            {profile.skillGroups.map(({ category, skills }) => (
              <div key={category}>
                <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
                  {category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill}
                      className="px-3 py-1.5 rounded-lg text-sm border transition-colors hover:border-accent/40 hover:text-accent cursor-default"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-surface-border)",
                        color: "var(--color-text-secondary)",
                      }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience timeline */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-text-primary mb-8">Work Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {exp.companyUrl ? (
                        <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer"
                          className="text-text-primary font-semibold hover:text-accent transition-colors">
                          {exp.company}
                        </a>
                      ) : (
                        <span className="text-text-primary font-semibold">{exp.company}</span>
                      )}
                      {exp.current && (
                        <span className="text-2xs px-2 py-0.5 rounded-full font-mono"
                          style={{ background: "var(--color-accent-subtle)", color: "var(--color-accent)", border: "1px solid rgba(0,212,170,0.2)" }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-accent text-sm font-mono">{exp.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-text-muted text-xs font-mono">{exp.period}</div>
                    <div className="text-text-muted text-xs">{exp.location}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                      <span className="text-accent mt-0.5 shrink-0">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-text-primary mb-8">Education</h2>
          {profile.education.map((edu, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <div className="text-text-primary font-semibold mb-0.5">{edu.institution}</div>
                  <div className="text-accent text-sm font-mono">{edu.degree}</div>
                  <div className="text-text-muted text-xs mt-1">{edu.period} · {edu.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Location & availability */}
        <div className="card p-8 mb-10">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">Location</div>
              <div className="text-text-primary font-medium">{profile.location}</div>
              <div className="text-text-muted text-sm">{profile.timezone} — flexible overlap with US/EU/APAC</div>
            </div>
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">Availability</div>
              {profile.availableForFreelance && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success font-medium text-sm">Open to freelance</span>
                </div>
              )}
              {profile.availableForFullTime && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success font-medium text-sm">Open to full-time remote</span>
                </div>
              )}
              {!profile.availableForFreelance && !profile.availableForFullTime && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  <span className="text-error font-medium text-sm">Not currently available</span>
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">Languages</div>
              <div className="text-text-primary font-medium">English (fluent)</div>
              <div className="text-text-muted text-sm">Filipino (native)</div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact" className="btn-primary">Let&apos;s work together →</Link>
          <a href="/MichaelPadinResume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Download resume
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M3 6l4 4 4-4M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
