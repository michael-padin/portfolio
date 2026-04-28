import type { Metadata } from "next";
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
  const available = profile?.availableForFreelance || profile?.availableForFullTime;

  const channels = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "LinkedIn", value: "linkedin.com/in/michael-padin", href: linkedin },
    { label: "GitHub", value: "github.com/michael-padin", href: github },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-12">
            <div className="label-tag mb-4">Get in touch</div>
            <h1 className="font-display text-display-lg text-text-primary mb-4">
              Let&apos;s build something <span className="text-accent italic">great.</span>
            </h1>
            <p className="text-text-secondary mb-4 text-lg leading-relaxed">
              Whether you have a project in mind or just want to explore possibilities — I typically
              reply within 24 hours.
            </p>
            {/* Live availability badge */}
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 animate-pulse rounded-full ${available ? "bg-success" : "bg-amber-400"}`}
              />
              <span className="text-text-muted font-mono text-sm">
                {profile?.availabilityNote ?? "Available for new projects"}
              </span>
            </div>
          </div>

          {/* Contact channels */}
          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {channels.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="card group hover:border-accent/30 p-4 transition-colors"
              >
                <div className="text-text-muted mb-1 font-mono text-xs">{label}</div>
                <div className="text-text-primary group-hover:text-accent truncate text-sm transition-colors">
                  {value}
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="card p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
