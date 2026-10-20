import type { Metadata } from "next";
import Image from "next/image";
import { getProfile, getResumeUrl, imageUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";
import { BookButton } from "@/components/ui/BookButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => FALLBACK_PROFILE);
  const ogImg = profile.ogImage ? imageUrl(profile.ogImage, 1200, 630) : null;
  return pageMetadata({
    title: `About ${profile.name}`,
    description: profile.bioShort.slice(0, 160),
    path: "/about",
    image: ogImg,
    type: "profile",
  });
}

export default async function AboutPage() {
  const profile = await getProfile().catch(() => FALLBACK_PROFILE);
  const resumeLink = getResumeUrl(profile);
  const photoUrl = imageUrl(profile.photo, 840, 1040);

  return (
    <>
      <section className="container-page grid items-center gap-8 pt-6 pb-12 md:grid-cols-[minmax(280px,420px)_1fr] md:gap-[72px] md:pt-14 md:pb-24">
        <div className="bg-tint relative mx-auto h-[400px] w-full max-w-[320px] overflow-hidden rounded-[220px_220px_24px_24px] md:h-[520px] md:max-w-none">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={profile.photo?.alt ?? `${profile.name}, software developer in Cebu`}
              fill
              sizes="(min-width: 768px) 420px, 320px"
              className="object-cover"
              priority
            />
          ) : (
            <ImageSlot label="Portrait" />
          )}
        </div>
        <div>
          <p className="eyebrow">About</p>
          <h1 className="text-h1 mt-3 md:mt-4">Hi, I&apos;m Michael.</h1>
          {profile.aboutIntro.map((para, i) => (
            <p
              key={i}
              className={`max-w-[46ch] text-[17px] leading-[1.6] text-[oklch(32%_0.02_50)] md:text-[20px] ${i === 0 ? "mt-5 md:mt-6" : "mt-4"}`}
            >
              {para}
            </p>
          ))}
          <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
            <BookButton
              bookingUrl={profile.bookingUrl}
              email={profile.email}
              track="book-call-about"
              className="w-full sm:w-auto"
            />
            {resumeLink && (
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full sm:w-auto"
              >
                Resume (PDF)
              </a>
            )}
          </div>
        </div>
      </section>

      {profile.workPrinciples.length > 0 && (
        <section className="bg-tint">
          <div className="container-page py-12 md:py-[88px]">
            <h2 className="text-[30px] leading-[1.05] tracking-[-0.015em] md:text-[44px]">
              How I work
            </h2>
            <ol className="mt-6 grid md:mt-9 md:grid-cols-2 md:gap-x-14">
              {profile.workPrinciples.map((w, i) => (
                <li
                  key={w.title}
                  className="border-ink grid grid-cols-[36px_1fr] gap-3 border-t-[1.5px] py-6 md:grid-cols-[48px_1fr] md:gap-4 md:py-7"
                >
                  <span className="font-heading text-mango-deep text-[24px] md:text-[28px]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[20px] leading-[1.2] md:text-[24px]">{w.title}</h3>
                    <p className="text-muted mt-2 max-w-[44ch] text-[15px] leading-[1.55] md:text-[16px]">
                      {w.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="container-page grid gap-5 py-12 md:grid-cols-[1fr_2fr] md:gap-14 md:py-24">
        <h2 className="text-[28px] leading-[1.1] md:text-[40px]">Experience</h2>
        <ol className="border-ink border-t-[1.5px]">
          {profile.experience.map((exp) => (
            <li
              key={`${exp.company}-${exp.period}`}
              className="border-rule grid gap-2 border-b py-6 md:grid-cols-[200px_1fr] md:gap-6"
            >
              <span className="text-muted font-mono text-[13px] md:pt-1">
                {exp.period}
                {exp.current && (
                  <span className="font-semibold text-[oklch(50%_0.13_160)]"> · now</span>
                )}
              </span>
              <div>
                <h3 className="text-[22px] md:text-[24px]">{exp.company}</h3>
                <div className="text-muted mt-0.5 text-[14px]">
                  {exp.role} · {exp.location}
                </div>
                {(exp.outcome ?? exp.highlights?.[0]) && (
                  <p className="mt-2.5 max-w-[56ch] text-[15px] leading-[1.55] md:text-[16px]">
                    {exp.outcome ?? exp.highlights?.[0]}
                  </p>
                )}
              </div>
            </li>
          ))}
          {profile.education.map((edu) => (
            <li key={edu.institution} className="grid gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-6">
              <span className="text-muted font-mono text-[13px] md:pt-1">{edu.period}</span>
              <div>
                <h3 className="text-[22px] md:text-[24px]">{edu.institution}</h3>
                <div className="text-muted mt-0.5 text-[14px]">{edu.degree}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page grid gap-3 pb-12 md:grid-cols-[1fr_2fr] md:gap-14 md:pb-24">
        <h2 className="text-[28px] leading-[1.1] md:text-[40px]">Tools I use</h2>
        <p className="text-muted text-[16px] leading-[1.8] md:text-[17px]">
          {profile.terminalSkills.join(" · ")}
        </p>
      </section>

      <CtaBand heading="Let's grab a coffee and talk shop." profile={profile} />
    </>
  );
}
