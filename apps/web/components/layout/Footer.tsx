import Link from "next/link";
import { getProfile, getResumeUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";
import { Lockup } from "@/components/brand/Logo";

type FooterLink = { href: string; label: string; external?: boolean };

export async function Footer() {
  const profile = await getProfile().catch(() => FALLBACK_PROFILE);
  const resumeLink = getResumeUrl(profile);
  const year = new Date().getFullYear();

  const navigate: FooterLink[] = [
    { href: "/#services", label: "What I build" },
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    ...(features.blog ? [{ href: "/blog", label: "Blog" }] : []),
    ...(features.contact ? [{ href: "/contact", label: "Contact" }] : []),
  ];

  const contact = [
    { href: `mailto:${profile.email}`, label: profile.email },
    profile.bookingUrl && { href: profile.bookingUrl, label: "Book a call", external: true },
    profile.facebookUrl && { href: profile.facebookUrl, label: "Facebook", external: true },
    profile.messengerUrl && { href: profile.messengerUrl, label: "Messenger", external: true },
  ].filter(Boolean) as FooterLink[];

  const elsewhere = [
    profile.githubUrl && { href: profile.githubUrl, label: "GitHub", external: true },
    profile.linkedinUrl && { href: profile.linkedinUrl, label: "LinkedIn", external: true },
    resumeLink && { href: resumeLink, label: "Resume (PDF)", external: true },
  ].filter(Boolean) as FooterLink[];

  return (
    <footer className="mx-auto max-w-[1328px] p-3 md:p-6">
      <div className="bg-ink text-paper rounded-[24px] px-5 pt-8 pb-6 md:rounded-[28px] md:px-14 md:pt-14 md:pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" aria-label="Michael Padin, home" className="self-start">
              <Lockup tone="dark" />
            </Link>
            <p className="text-dark-muted max-w-[32ch] text-[15px] leading-normal">
              Booking, ordering, inventory and staff systems for local businesses.
            </p>
            <span className="text-dark-muted text-[14px]">Replies within a day, Mon–Fri.</span>
          </div>
          <Column title="Navigate" links={navigate} />
          <Column title="Contact" links={contact} />
          <Column title="Elsewhere" links={elsewhere} />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-[oklch(35%_0.02_50)] pt-5 text-[13px] text-[oklch(70%_0.02_70)] sm:flex-row sm:justify-between md:mt-12">
          <span>© {year} Michael Padin · Cebu, Philippines</span>
          <span>Built with Next.js, Sanity and Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[oklch(70%_0.02_70)] uppercase">
        {title}
      </span>
      {links.map((l) =>
        l.external || l.href.startsWith("mailto:") ? (
          <a
            key={l.href}
            href={l.href}
            {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="hover:text-mango py-0.5 text-[15px] break-words text-[oklch(92%_0.01_80)] transition-colors duration-200"
          >
            {l.label}
          </a>
        ) : (
          <Link
            key={l.href}
            href={l.href}
            className="hover:text-mango py-0.5 text-[15px] text-[oklch(92%_0.01_80)] transition-colors duration-200"
          >
            {l.label}
          </Link>
        ),
      )}
    </div>
  );
}
