import type { Metadata } from "next";
import { getProfile } from "@/lib/sanity";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Michael Padin for freelance projects or full-time remote opportunities.",
};

export default async function ContactPage() {
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="label-tag mb-4">Get in touch</div>
            <h1 className="font-display text-display-lg text-text-primary mb-4">
              Let&apos;s build something <span className="italic text-accent">great.</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Whether you have a project in mind or just want to explore possibilities — I typically
              reply within 24 hours.
            </p>
            {/* Live availability badge */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${available ? "bg-success" : "bg-amber-400"}`}
              />
              <span className="text-sm font-mono text-text-muted">
                {profile?.availabilityNote ?? "Available for new projects"}
              </span>
            </div>
          </div>

          {/* Contact channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {channels.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="card p-4 group hover:border-accent/30 transition-colors"
              >
                <div className="text-text-muted text-xs font-mono mb-1">{label}</div>
                <div className="text-text-primary text-sm group-hover:text-accent transition-colors truncate">
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
