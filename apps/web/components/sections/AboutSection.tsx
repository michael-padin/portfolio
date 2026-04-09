import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function AboutSection({ profile }: Props) {
  return (
    <section id="about" className="py-24" style={{ background: "rgba(15,15,26,0.4)" }}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <div className="label-tag mb-4">About me</div>
          <h2 className="text-display-lg text-text-primary max-w-2xl">
            Developer from{" "}
            <span className="italic text-accent">{profile.location.split(",")[0]}</span>
            ,<br />
            building for the world
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16">
          {/* Left — bio + skills */}
          <div>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
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
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              I specialise in the React and Node.js ecosystem with a strong focus on performance and
              shipping things that actually work. Fluent in English, comfortable with async-first
              workflows, and overlap with US and APAC timezones from {profile.timezone}.
            </p>

            {/* Skills */}
            <div className="space-y-5">
              {profile.skillGroups.map(({ category, skills }) => (
                <div key={category}>
                  <div className="text-text-muted text-xs font-mono mb-2 tracking-wider uppercase">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-sm border transition-colors hover:border-accent/40 hover:text-accent cursor-default"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-surface-border)",
                          color: "var(--color-text-secondary)",
                        }}
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
            <h3 className="font-display text-xl text-text-primary mb-6">Experience</h3>

            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute left-3 top-0 bottom-0 w-px"
                style={{ background: "var(--color-surface-border)" }}
              />

              <div className="space-y-6">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="relative pl-10">
                    {/* Dot */}
                    <div
                      className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        exp.current ? "border-accent" : "border-surface-border"
                      }`}
                      style={{
                        background: exp.current ? "var(--color-accent-subtle)" : "var(--color-bg)",
                      }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          exp.current ? "bg-accent animate-pulse" : "bg-text-muted"
                        }`}
                      />
                    </div>

                    <div className="card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-text-primary text-sm hover:text-accent transition-colors"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <div className="font-semibold text-text-primary text-sm">
                              {exp.company}
                            </div>
                          )}
                          <div className="text-accent text-xs font-mono">{exp.role}</div>
                        </div>
                        <div
                          className="text-right"
                          style={{ color: "var(--color-text-muted)", fontSize: "0.65rem" }}
                        >
                          <div className="font-mono">{exp.period}</div>
                          <div>{exp.location}</div>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, j) => (
                          <li
                            key={j}
                            className="text-text-secondary text-xs leading-relaxed flex gap-2"
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
              <div key={i} className="mt-6 card p-4" style={{ borderColor: "rgba(0,212,170,0.2)" }}>
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg text-lg"
                    style={{
                      background: "var(--color-accent-subtle)",
                      color: "var(--color-accent)",
                    }}
                  >
                    🎓
                  </div>
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
