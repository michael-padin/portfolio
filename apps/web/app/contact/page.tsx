import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact Michael Padin",
  description:
    "Get in touch for freelance projects, full-time remote roles, or technical consultation. Replies within 24 hours.",
  path: "/contact",
});

export default async function ContactPage() {
  if (!features.contact) notFound();
  const profile = await getProfile().catch(() => null);

  const email = profile?.email ?? "hello@michaelpadin.com";
  const linkedin = profile?.linkedinUrl ?? "https://linkedin.com/in/michael-padin";
  const github = profile?.githubUrl ?? "https://github.com/michael-padin";
  const location = profile?.location ?? "Cebu, Philippines";
  const timezone = profile?.timezone ?? "UTC+8";
  const available = profile?.availableForFreelance || profile?.availableForFullTime;
  const availabilityNote = profile?.availabilityNote ?? "Available for new projects";

  return (
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip */}
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">Contact</Field>
            <Field label="Subject">{profile?.name ?? "Michael Padin"}</Field>
            <Field label="Reply">~24h on weekdays</Field>
            <Field label="Status">
              <span className={available ? "text-signal" : "text-ink"}>
                <span
                  aria-hidden
                  className={`mr-1.5 inline-block size-[6px] -translate-y-px rounded-full ${
                    available ? "bg-signal" : "bg-ink"
                  }`}
                />
                {available ? availabilityNote : "Not currently available"}
              </span>
            </Field>
          </dl>
        </div>

        {/* Title */}
        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <h1 className="font-spec text-ink max-w-[22ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            Have a project to build? Write.
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
            Send me a project brief, a job spec, or a technical question. I read everything and
            reply personally, usually within a day.
          </p>
        </div>

        {/* Channels */}
        <section className="mt-[clamp(3rem,5vw,4rem)]">
          <header className="border-paper-rule mb-5 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Channels
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §01 · Reach
            </span>
          </header>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-[14px]">
            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              Email
            </dt>
            <dd>
              <a
                href={`mailto:${email}`}
                className="font-spec-mono text-ink hover:text-signal border-ink hover:border-signal border-b pb-px text-[15px] transition-colors"
              >
                {email}
              </a>
            </dd>

            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              LinkedIn
            </dt>
            <dd>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-2 hover:text-signal border-ink-3 hover:border-signal font-spec border-b pb-px transition-colors"
              >
                linkedin.com/in/michael-padin ↗
              </a>
            </dd>

            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              GitHub
            </dt>
            <dd>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-2 hover:text-signal border-ink-3 hover:border-signal font-spec border-b pb-px transition-colors"
              >
                github.com/michael-padin ↗
              </a>
            </dd>

            <dt className="font-spec-mono text-ink-3 pt-[3px] text-[11px] tracking-[0.04em] uppercase">
              Where
            </dt>
            <dd className="font-spec text-ink-2">
              {location}{" "}
              <span className="text-ink-3 font-spec-mono ml-1 text-[12px]">· {timezone}</span>
            </dd>
          </dl>
        </section>

        {/* Form */}
        <section className="mt-[clamp(4rem,6vw,5rem)]">
          <header className="border-paper-rule mb-6 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Form
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §02 · Structured submission
            </span>
          </header>
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-9 lg:col-start-2">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(4rem,6vw,6rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            End of document
          </span>
          <Link
            href="/"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← Back to /
          </Link>
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
