import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function AboutSection({ profile }: Props) {
  return (
    <section id="about" className="bg-bg-secondary/40 py-24">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <div className="label-tag mb-4">About me</div>
          <h2 className="text-display-lg text-text-primary max-w-2xl">
            Developer from{" "}
            <span className="text-accent italic">{profile.location.split(",")[0]}</span>
            ,<br />
            building for the world
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          {/* Left — bio + skills */}
          <div>
            <p className="text-text-secondary mb-4 text-lg leading-relaxed">
              I&apos;m <span className="text-text-primary font-medium">{profile.name}</span> — a
              full-stack JavaScript developer with 3+ years building production-grade web apps and
              APIs. Currently working remotely for{" "}
              <a
                href={profile.experience[0]?.companyUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {profile.experience[0]?.company ?? "Image Edits"}
              </a>
              , where I architect backend pipelines, lead frontend migrations, and help plan
              technical decisions across a 5-app Turborepo monorepo.
            </p>
            <p className="text-text-secondary mb-8 text-lg leading-relaxed">
              I specialise in the React and Node.js ecosystem with a strong focus on performance and
              shipping things that actually work. Fluent in English, comfortable with async-first
              workflows, and overlap with US and APAC timezones from {profile.timezone}.
            </p>

            {/* Skills */}
            <div className="space-y-5">
              {profile.skillGroups.map(({ category, skills }) => (
                <div key={category}>
                  <div className="text-text-muted mb-2 font-mono text-xs tracking-wider uppercase">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-surface border-surface-border text-text-secondary hover:border-accent/40 hover:text-accent cursor-default rounded-lg border px-2.5 py-1 text-sm transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — experience + education */}
          <div>
            <h3 className="font-display text-text-primary mb-6 text-xl">Experience</h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="bg-surface-border absolute top-0 bottom-0 left-3 w-px" />

              <div className="space-y-6">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="relative pl-10">
                    {/* Dot */}
                    <div
                      className={`absolute top-1.5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        exp.current
                          ? "border-accent bg-accent-subtle"
                          : "border-surface-border bg-bg"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          exp.current ? "bg-accent animate-pulse" : "bg-text-muted"
                        }`}
                      />
                    </div>

                    <div className="card p-4">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-primary hover:text-accent text-sm font-semibold transition-colors"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <div className="text-text-primary text-sm font-semibold">
                              {exp.company}
                            </div>
                          )}
                          <div className="text-accent font-mono text-xs">{exp.role}</div>
                        </div>
                        <div className="text-text-muted text-2xs text-right">
                          <div className="font-mono">{exp.period}</div>
                          <div>{exp.location}</div>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, j) => (
                          <li
                            key={j}
                            className="text-text-secondary flex gap-2 text-xs leading-relaxed"
                          >
                            <span className="text-accent mt-0.5 shrink-0">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {profile.education.map((edu, i) => (
              <div key={i} className="card border-accent/20 mt-6 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-accent-subtle text-accent rounded-lg p-2 text-lg">🎓</div>
                  <div>
                    <div className="text-text-primary text-sm font-semibold">{edu.institution}</div>
                    <div className="text-text-secondary text-xs">
                      {edu.degree} · {edu.period}
                    </div>
                    <div className="text-text-muted text-xs">{edu.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
