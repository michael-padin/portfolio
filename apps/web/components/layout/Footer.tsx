import Link from "next/link";
import { getProfile, getResumeUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";

const allNavLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing", feature: "blog" as const },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];
const navLinks = allNavLinks.filter((l) => !l.feature || features[l.feature]);

export async function Footer() {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const resumeLink = getResumeUrl(profile);
  const year = new Date().getFullYear();

  const socialLinks = [
    profile.githubUrl && { href: profile.githubUrl, label: "GitHub" },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: "LinkedIn" },
    profile.twitterUrl && { href: profile.twitterUrl, label: "Twitter" },
    { href: `mailto:${profile.email}`, label: "Email" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-surface-border mt-24 border-t">
      <div className="container-custom py-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display text-text-primary hover:text-accent text-2xl transition-colors"
            >
              {profile.name.split(" ")[0]}
              <span className="text-accent">.</span>
            </Link>
            <p className="text-text-muted mt-1 text-sm">
              {profile.title} — {profile.location}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  profile.availableForFreelance || profile.availableForFullTime
                    ? "bg-success animate-pulse"
                    : "bg-error"
                }`}
              />
              <span className="text-text-muted font-mono text-xs">{profile.availabilityNote}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-10 sm:flex-row">
            <div className="flex flex-col gap-2">
              <span className="text-text-muted mb-1 font-mono text-xs tracking-widest uppercase">
                Navigate
              </span>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-text-secondary hover:text-accent text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-text-muted mb-1 font-mono text-xs tracking-widest uppercase">
                Connect
              </span>
              {socialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent text-sm transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-surface-border flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-text-muted font-mono text-xs">
            © {year} {profile.name} · Built with Next.js + Sanity + Cloudflare
          </p>
          <div className="flex items-center gap-4">
            {resumeLink && (
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent font-mono text-xs transition-colors"
              >
                Resume
              </a>
            )}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent font-mono text-xs transition-colors"
            >
              GitHub
            </a>
            {features.contact && (
              <Link href="/contact" className="text-accent font-mono text-xs hover:underline">
                Hire me →
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
