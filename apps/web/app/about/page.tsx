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
  const photoUrl = imageUrl(profile.photo, 240, 320);
  const available = profile.availableForFreelance || profile.availableForFullTime;
  const [city] = profile.location.split(",").map((s) => s.trim());

  return (
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip */}
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">About</Field>
            <Field label="Subject">{profile.name}</Field>
            <Field label="Role">{profile.title}</Field>
            <Field label="Origin">
              {city}, PH · {profile.timezone}
            </Field>
            <Field label="Status">
              <span className={available ? "text-signal" : "text-ink"}>
                <span
                  aria-hidden
                  className={`mr-1.5 inline-block size-[6px] -translate-y-px rounded-full ${
                    available ? "bg-signal" : "bg-ink"
                  }`}
                />
                {available ? profile.availabilityNote : "Not currently available"}
              </span>
            </Field>
          </dl>
        </div>

        {/* Header: photo + declaration */}
        <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-12 gap-x-6 gap-y-8">
          {photoUrl && (
            <div className="col-span-12 sm:col-span-3 md:col-span-2">
              <Image
                src={photoUrl}
                alt={profile.photo?.alt ?? `${profile.name}, ${profile.title}`}
                width={240}
                height={320}
                className="border-paper-rule w-full max-w-[180px] border object-cover grayscale"
              />
            </div>
          )}
          <div className={photoUrl ? "col-span-12 sm:col-span-9 md:col-span-10" : "col-span-12"}>
            <h1 className="font-spec text-ink max-w-[22ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
              {profile.name}, {profile.title.toLowerCase()}.
            </h1>
            <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
              {profile.bioShort}
            </p>
          </div>
        </div>

        {/* Bio long-form (if present) */}
        {profile.bio && profile.bio.length > 0 && (
          <section className="mt-[clamp(3rem,5vw,4.5rem)] grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-9 lg:col-start-2">
              <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
                <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
                  Background
                </h2>
                <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
                  §01 · Long form
                </span>
              </header>
              <div className="prose-paper">
                <PortableText value={profile.bio} />
              </div>
            </div>
          </section>
        )}

        {/* Values / principles */}
        {profile.values?.length > 0 && (
          <section className="mt-[clamp(4rem,6vw,6rem)]">
            <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
              <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
                Principles
              </h2>
              <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
                §02 · How I work
              </span>
            </header>
            <ol>
              {profile.values.map((v, i) => (
                <li
                  key={v.title}
                  className="border-paper-rule grid grid-cols-12 gap-x-4 gap-y-2 border-b py-5"
                >
                  <span className="font-spec-mono text-signal col-span-2 text-[15px] tabular-nums sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-spec text-ink col-span-10 text-[clamp(1rem,1.3vw,1.1875rem)] font-medium sm:col-span-3">
                    {v.title}
                  </h3>
                  <p className="font-spec text-ink-2 col-span-12 max-w-[60ch] text-[14px] leading-[1.55] sm:col-span-8">
                    {v.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Skills */}
        <section className="mt-[clamp(4rem,6vw,6rem)]">
          <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Stack
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §03 · Tools & technologies
            </span>
          </header>
          <dl>
            {profile.skillGroups.map(({ category, skills }) => (
              <div
                key={category}
                className="border-paper-rule grid grid-cols-12 gap-x-4 gap-y-1 border-b py-4"
              >
                <dt className="font-spec-mono text-ink-3 col-span-12 text-[11px] tracking-[0.04em] uppercase sm:col-span-3">
                  {category}
                </dt>
                <dd className="font-spec text-ink-2 col-span-12 text-[14px] leading-[1.6] sm:col-span-9">
                  {skills.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Experience */}
        <section className="mt-[clamp(4rem,6vw,6rem)]">
          <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Experience
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §04 · {profile.experience.length} engagements
            </span>
          </header>
          <div>
            {profile.experience.map((exp, i) => (
              <article
                key={`${exp.company}-${i}`}
                className="border-paper-rule grid grid-cols-12 gap-x-4 gap-y-2 border-b py-6"
              >
                <div className="font-spec-mono text-ink-3 col-span-12 text-[12px] tabular-nums md:col-span-2">
                  {exp.period}
                  {exp.current && (
                    <span className="text-signal ml-2 inline-flex items-center gap-1 font-medium">
                      <span aria-hidden className="bg-signal size-1.5 rounded-full" />
                      now
                    </span>
                  )}
                </div>
                <div className="col-span-12 md:col-span-3">
                  {exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-spec text-ink hover:text-signal border-ink hover:border-signal border-b pb-px text-[15px] font-medium transition-colors"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <span className="font-spec text-ink text-[15px] font-medium">
                      {exp.company}
                    </span>
                  )}
                  <div className="font-spec text-ink-2 text-[13px]">{exp.role}</div>
                  <div className="font-spec-mono text-ink-3 mt-0.5 text-[11px] tracking-[0.02em] uppercase">
                    {exp.location}
                  </div>
                </div>
                <ul className="col-span-12 max-w-[60ch] space-y-1.5 md:col-span-7">
                  {exp.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="font-spec text-ink-2 flex gap-3 text-[14px] leading-[1.55]"
                    >
                      <span
                        aria-hidden
                        className="text-ink-3 mt-[0.55em] inline-block size-1 shrink-0 rounded-full bg-current"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mt-[clamp(4rem,6vw,6rem)]">
          <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Education
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §05
            </span>
          </header>
          <ul>
            {profile.education.map((edu, i) => (
              <li
                key={i}
                className="border-paper-rule grid grid-cols-12 gap-x-4 gap-y-1 border-b py-4"
              >
                <span className="font-spec-mono text-ink-3 col-span-12 text-[12px] tabular-nums md:col-span-2">
                  {edu.period}
                </span>
                <span className="font-spec text-ink col-span-12 text-[15px] font-medium md:col-span-6">
                  {edu.institution}
                </span>
                <span className="font-spec text-ink-2 col-span-12 text-[14px] md:col-span-4">
                  {edu.degree} · {edu.location}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Logistics + signature */}
        <section className="mt-[clamp(4rem,6vw,6rem)]">
          <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Logistics
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §06 · Reach + working
            </span>
          </header>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-[14px]">
            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              Location
            </dt>
            <dd className="font-spec text-ink-2">
              {profile.location}{" "}
              <span className="text-ink-3 font-spec-mono ml-1 text-[12px]">
                · {profile.timezone}, flexible overlap with US, EU, and APAC
              </span>
            </dd>

            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              Languages
            </dt>
            <dd className="font-spec text-ink-2">English (fluent) · Filipino (native)</dd>

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

            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              Reach
            </dt>
            <dd className="font-spec text-ink-2 flex flex-wrap gap-x-5 gap-y-1">
              {features.contact && (
                <Link
                  href="/contact"
                  className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-px font-medium transition-colors"
                >
                  Write
                </Link>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="font-spec-mono text-ink hover:text-signal border-ink hover:border-signal border-b pb-px text-[14px] transition-colors"
              >
                {profile.email}
              </a>
              {resumeLink && (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-signal border-ink-3 hover:border-signal border-b pb-px transition-colors"
                >
                  Resume (PDF)
                  {profile.resumeLastUpdated && (
                    <span className="text-ink-3 font-spec-mono ml-1 text-[12px]">
                      · upd{" "}
                      {new Date(profile.resumeLastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </a>
              )}
            </dd>
          </dl>
        </section>

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
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-ink-3 select-none">{label}</dt>
      <dd className="text-ink font-normal normal-case">{children}</dd>
    </div>
  );
}
