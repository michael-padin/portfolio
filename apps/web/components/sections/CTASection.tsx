import Link from "next/link";
import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function CTASection({ profile }: Props) {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div
          className="relative rounded-3xl border overflow-hidden p-12 md:p-16 text-center"
          style={{
            borderColor: "rgba(0,212,170,0.2)",
            background:
              "linear-gradient(135deg, rgba(0,212,170,0.05) 0%, var(--color-bg-secondary) 50%, var(--color-bg-secondary) 100%)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl pointer-events-none"
            style={{ background: "rgba(0,212,170,0.08)" }}
          />

          <div className="relative z-10">
            <div className="label-tag mx-auto mb-6 w-fit">Let&apos;s work together</div>

            <h2 className="text-display-lg text-text-primary max-w-2xl mx-auto mb-4">
              Got a project in mind?
              <br />
              <span className="italic text-accent">Let&apos;s talk.</span>
            </h2>

            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
              {profile.availableForFreelance && profile.availableForFullTime
                ? "Available for freelance projects and full-time remote opportunities."
                : profile.availableForFreelance
                  ? "Taking on freelance projects. Reach out to discuss yours."
                  : profile.availableForFullTime
                    ? "Open to full-time remote roles. Let's connect."
                    : "Not currently available, but feel free to reach out for future work."}{" "}
              Based in {profile.location} ({profile.timezone}) — I work flexible hours to overlap
              with your team.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Start a conversation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8h14M9 2l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a href={`mailto:${profile.email}`} className="btn-ghost text-base px-8 py-4">
                {profile.email}
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 justify-center text-text-muted text-sm">
              {[
                "Fast async replies",
                "No-BS communication",
                "Timezone flexible",
                "English fluent",
              ].map((s) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="text-success">✓</span> {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
