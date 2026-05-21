import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getProfile, getResumeUrl, imageUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const ogImg = profile.ogImage ? imageUrl(profile.ogImage, 1200, 630) : null;
  return pageMetadata({
    title: `About ${profile.name}`,
    description: `${profile.title} based in ${profile.location}. ${profile.bioShort}`.slice(0, 160),
    path: "/about",
    image: ogImg,
    type: "profile",
  });
}

export default async function AboutPage() {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const resumeLink = getResumeUrl(profile);
  const photoUrl = imageUrl(profile.photo, 200, 200);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-main">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-8 flex items-start gap-8">
            {photoUrl && (
              <div className="hidden shrink-0 sm:block">
                <Image
                  src={photoUrl}
                  alt={profile.photo?.alt ?? `${profile.name}, ${profile.title}`}
                  width={120}
                  height={120}
                  className="border-surface-border rounded-2xl border"
                />
              </div>
            )}
            <div>
              <div className="label-tag mb-5">
                <span className="bg-accent h-1.5 w-1.5 rounded-full" />
                About me
              </div>
              <h1 className="text-display-xl text-text-primary mb-6">
                Developer, builder, <span className="text-gradient italic">problem solver.</span>
              </h1>
            </div>
          </div>
          {profile.bio && profile.bio.length > 0 ? (
            <div className="prose-portfolio max-w-2xl">
              <PortableText value={profile.bio} />
            </div>
          ) : (
            <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
              {profile.bioShort}
            </p>
          )}
        </div>

        {/* Values */}
        {profile.values.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-text-primary mb-8 text-2xl">How I work</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.values.map((v) => (
                <div key={v.title} className="card hover:border-accent/30 p-6 transition-colors">
                  <div className="mb-3 text-2xl">{v.emoji}</div>
                  <h3 className="text-text-primary mb-2 font-semibold">{v.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="mb-16">
          <h2 className="font-display text-text-primary mb-8 text-2xl">Skills &amp; tools</h2>
          <div className="space-y-6">
            {profile.skillGroups.map(({ category, skills }) => (
              <div key={category}>
                <div className="text-text-muted mb-3 font-mono text-xs tracking-widest uppercase">
                  {category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-surface border-surface-border text-text-secondary hover:border-accent/40 hover:text-accent cursor-default rounded-lg border px-3 py-1.5 text-sm transition-colors"
                    >
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
          <h2 className="font-display text-text-primary mb-8 text-2xl">Work Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="card p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-accent font-semibold transition-colors"
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <span className="text-text-primary font-semibold">{exp.company}</span>
                      )}
                      {exp.current && (
                        <span className="text-2xs bg-accent-subtle text-accent border-accent/20 rounded-full border px-2 py-0.5 font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-accent font-mono text-sm">{exp.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-text-muted font-mono text-xs">{exp.period}</div>
                    <div className="text-text-muted text-xs">{exp.location}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-text-secondary flex gap-2 text-sm leading-relaxed">
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
          <h2 className="font-display text-text-primary mb-8 text-2xl">Education</h2>
          {profile.education.map((edu, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <div className="text-text-primary mb-0.5 font-semibold">{edu.institution}</div>
                  <div className="text-accent font-mono text-sm">{edu.degree}</div>
                  <div className="text-text-muted mt-1 text-xs">
                    {edu.period} · {edu.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Location & availability */}
        <div className="card mb-10 p-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="text-text-muted mb-2 font-mono text-xs tracking-widest uppercase">
                Location
              </div>
              <div className="text-text-primary font-medium">{profile.location}</div>
              <div className="text-text-muted text-sm">
                {profile.timezone} — flexible overlap with US/EU/APAC
              </div>
            </div>
            <div>
              <div className="text-text-muted mb-2 font-mono text-xs tracking-widest uppercase">
                Availability
              </div>
              {profile.availableForFreelance && (
                <div className="mb-1 flex items-center gap-2">
                  <span className="bg-success h-2 w-2 animate-pulse rounded-full" />
                  <span className="text-success text-sm font-medium">Open to freelance</span>
                </div>
              )}
              {profile.availableForFullTime && (
                <div className="flex items-center gap-2">
                  <span className="bg-success h-2 w-2 animate-pulse rounded-full" />
                  <span className="text-success text-sm font-medium">Open to full-time remote</span>
                </div>
              )}
              {!profile.availableForFreelance && !profile.availableForFullTime && (
                <div className="flex items-center gap-2">
                  <span className="bg-error h-2 w-2 rounded-full" />
                  <span className="text-error text-sm font-medium">Not currently available</span>
                </div>
              )}
            </div>
            <div>
              <div className="text-text-muted mb-2 font-mono text-xs tracking-widest uppercase">
                Languages
              </div>
              <div className="text-text-primary font-medium">English (fluent)</div>
              <div className="text-text-muted text-sm">Filipino (native)</div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {features.contact && (
            <Link href="/contact" className="btn-primary">
              Let&apos;s work together →
            </Link>
          )}
          {resumeLink && (
            <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Download resume
              {profile.resumeLastUpdated && (
                <span className="text-text-muted ml-1 text-xs">
                  (Updated{" "}
                  {new Date(profile.resumeLastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                  )
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v8M3 6l4 4 4-4M2 13h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
