import Link from "next/link";
import { getProfile, FALLBACK_PROFILE } from "@/lib/sanity";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const year = new Date().getFullYear();

  const socialLinks = [
    profile.githubUrl && { href: profile.githubUrl, label: "GitHub" },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: "LinkedIn" },
    profile.twitterUrl && { href: profile.twitterUrl, label: "Twitter" },
    { href: `mailto:${profile.email}`, label: "Email" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--color-surface-border)", marginTop: "6rem" }}
    >
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display text-2xl text-text-primary hover:text-accent transition-colors"
            >
              {profile.name.split(" ")[0]}
              <span className="text-accent">.</span>
            </Link>
            <p className="text-sm text-text-muted mt-1">
              {profile.title} — {profile.location}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profile.availableForFreelance || profile.availableForFullTime
                    ? "bg-success animate-pulse"
                    : "bg-error"
                }`}
              />
              <span className="text-xs text-text-muted font-mono">{profile.availabilityNote}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">
                Navigate
              </span>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">
                Connect
              </span>
              {socialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <p className="text-text-muted text-xs font-mono">
            © {year} {profile.name} · Built with Next.js + Sanity + Cloudflare
          </p>
          <div className="flex items-center gap-4">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent transition-colors font-mono"
            >
              View source
            </a>
            <Link href="/contact" className="text-xs text-accent hover:underline font-mono">
              Hire me →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
