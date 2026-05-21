import Link from "next/link";
import { getProfile, getResumeUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";

const allNavLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog", feature: "blog" as const },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];
const navLinks = allNavLinks.filter((l) => !l.feature || features[l.feature]);

export async function Footer() {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const resumeLink = getResumeUrl(profile);
  const year = new Date().getFullYear();
  const available = profile.availableForFreelance || profile.availableForFullTime;

  const elsewhere = [
    profile.bookingUrl && { href: profile.bookingUrl, label: "Book a call" },
    profile.githubUrl && { href: profile.githubUrl, label: "GitHub" },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: "LinkedIn" },
    profile.twitterUrl && { href: profile.twitterUrl, label: "Twitter" },
    resumeLink && { href: resumeLink, label: "Resume (PDF)" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-paper-rule mt-[clamp(4rem,8vw,7rem)] border-t">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)] py-[clamp(2.5rem,4vw,4rem)]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* Brand block */}
          <div className="col-span-12 md:col-span-5">
            <Link
              href="/"
              className="font-spec text-ink hover:text-signal inline-flex items-baseline text-xl font-medium transition-colors"
            >
              <span className="text-signal">M</span>
              <span>ichael Padin</span>
            </Link>
            <p className="font-spec text-ink-2 mt-2 text-[14px]">
              {profile.title}, {profile.location}
            </p>
            <div className="mt-3 inline-flex items-center gap-2">
              <span
                aria-hidden
                className={`size-1.5 rounded-full ${available ? "bg-signal" : "bg-ink-3"}`}
              />
              <span
                className={`font-spec-mono text-[11px] tracking-[0.04em] uppercase ${available ? "text-signal" : "text-ink-2"}`}
              >
                {available ? profile.availabilityNote : "Not currently available"}
              </span>
            </div>
          </div>

          {/* Navigate */}
          <div className="col-span-6 md:col-span-3">
            <h3 className="font-spec-mono text-ink-3 mb-3 text-[11px] tracking-[0.04em] uppercase">
              Navigate
            </h3>
            <ul className="space-y-1.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-spec text-ink-2 hover:text-signal text-[14px] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Elsewhere */}
          <div className="col-span-6 md:col-span-4">
            <h3 className="font-spec-mono text-ink-3 mb-3 text-[11px] tracking-[0.04em] uppercase">
              Elsewhere
            </h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="font-spec-mono text-ink hover:text-signal text-[14px] transition-colors"
                >
                  {profile.email}
                </a>
              </li>
              {elsewhere.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="font-spec text-ink-2 hover:text-signal text-[14px] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="border-paper-rule mt-[clamp(2.5rem,4vw,3.5rem)] flex flex-col items-start justify-between gap-3 border-t pt-5 sm:flex-row sm:items-baseline">
          <p className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            © {year} {profile.name} · Built with Next.js, Sanity, Cloudflare
          </p>
          <p className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase tabular-nums">
            REV {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
