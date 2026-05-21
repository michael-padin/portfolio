import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function AboutSection({ profile }: Props) {
  const currentCompany = profile.experience.find((e) => e.current);
  const yearsExperience = profile.experience.length;
  const educationLine = profile.education
    .map((e) => `${e.institution}, ${e.degree} (${e.period})`)
    .join("; ");

  return (
    <section id="about" className="relative py-[clamp(5rem,8vw,8rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Section title */}
        <header className="border-paper-rule flex items-end justify-between border-b pb-3">
          <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
            About
          </h2>
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            §03 · Engineer profile
          </span>
        </header>

        {/* Bio column */}
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2">
            <p className="font-spec text-ink max-w-[60ch] text-[clamp(1.0625rem,1.2vw,1.1875rem)] leading-[1.55]">
              {profile.bioShort}
              {currentCompany && (
                <>
                  {" "}
                  Currently at{" "}
                  {currentCompany.companyUrl ? (
                    <a
                      href={currentCompany.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-px font-medium transition-colors"
                    >
                      {currentCompany.company}
                    </a>
                  ) : (
                    <span className="font-medium">{currentCompany.company}</span>
                  )}{" "}
                  ({currentCompany.role}). Based in {profile.location} ({profile.timezone}); fluent
                  English, async-first, overlaps with US and APAC working hours.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Experience table */}
        <div className="mt-[clamp(4rem,6vw,6rem)]">
          <h3 className="font-spec-mono text-ink-3 mb-3 text-[11px] tracking-[0.04em] uppercase">
            §03·1 Experience ({yearsExperience} engagements)
          </h3>
          <div className="border-paper-rule border-t">
            {profile.experience.map((exp, i) => (
              <ExperienceRow key={`${exp.company}-${i}`} exp={exp} />
            ))}
          </div>
        </div>

        {/* Education + signals */}
        <div className="border-paper-rule mt-[clamp(3rem,4vw,4rem)] grid grid-cols-12 gap-x-6 gap-y-6 border-t pt-6">
          <div className="col-span-12 md:col-span-6">
            <h3 className="font-spec-mono text-ink-3 mb-2 text-[11px] tracking-[0.04em] uppercase">
              §03·2 Education
            </h3>
            <p className="font-spec text-ink-2 text-[14px] leading-[1.5]">{educationLine || "—"}</p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h3 className="font-spec-mono text-ink-3 mb-2 text-[11px] tracking-[0.04em] uppercase">
              §03·3 Stack
            </h3>
            <p className="font-spec text-ink-2 text-[14px] leading-[1.5]">
              {profile.skillGroups
                .flatMap((g) => g.skills)
                .slice(0, 16)
                .join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({ exp }: { exp: Profile["experience"][number] }) {
  const outcome = exp.highlights?.[0] ?? "";
  return (
    <article className="border-paper-rule grid grid-cols-12 gap-x-4 gap-y-1 border-b py-5">
      {/* Period */}
      <div className="font-spec-mono text-ink-3 col-span-12 text-[12px] tabular-nums md:col-span-2">
        {exp.period}
        {exp.current && (
          <span className="text-signal ml-2 inline-flex items-center gap-1 font-medium">
            <span aria-hidden className="bg-signal size-1.5 rounded-full" />
            now
          </span>
        )}
      </div>

      {/* Company + role */}
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
          <span className="font-spec text-ink text-[15px] font-medium">{exp.company}</span>
        )}
        <div className="font-spec text-ink-2 text-[13px]">{exp.role}</div>
        <div className="font-spec-mono text-ink-3 mt-0.5 text-[11px] tracking-[0.02em] uppercase">
          {exp.location}
        </div>
      </div>

      {/* Outcome */}
      <p className="font-spec text-ink-2 col-span-12 max-w-[60ch] text-[14px] leading-[1.5] md:col-span-7">
        {outcome}
      </p>
    </article>
  );
}
