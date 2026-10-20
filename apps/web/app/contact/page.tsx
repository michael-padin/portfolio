import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";
import { AvailabilityLine } from "@/components/ui/Marked";
import { BookButton } from "@/components/ui/BookButton";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell me how your business runs. Send a message or book a free 30-minute call, and get a fixed quote within 48 hours.",
  path: "/contact",
});

type Option = { title: string; detail: string; href?: string; external?: boolean };

export default async function ContactPage() {
  if (!features.contact) notFound();
  const profile = await getProfile().catch(() => FALLBACK_PROFILE);

  const social = profile.messengerUrl ?? profile.facebookUrl;
  const options = [
    profile.bookingUrl && {
      title: "Book a free 30-min call",
      detail: profile.bookingUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: profile.bookingUrl,
      external: true,
    },
    { title: "Email", detail: profile.email, href: `mailto:${profile.email}` },
    social && {
      title: "Facebook & Messenger",
      detail: profile.name,
      href: social,
      external: true,
    },
    { title: "Meet in person", detail: "Cebu City and nearby. Coffee's on me" },
  ].filter(Boolean) as Option[];

  return (
    <section className="container-page grid items-start gap-6 pt-6 pb-12 md:grid-cols-[1fr_1.15fr] md:gap-[72px] md:pt-14 md:pb-24">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="text-h1 mt-3 md:mt-4">Tell me about your business.</h1>
        <p className="text-lead text-body mt-3.5 max-w-[38ch] md:mt-5">
          Send a message, or book a free call. Either way, you&apos;ll talk to me, not a sales team
          reading from a script.
        </p>
        <BookButton
          bookingUrl={profile.bookingUrl}
          email={profile.email}
          track="book-call-contact"
          className="mt-5 w-full md:hidden"
        />

        <ul className="border-ink mt-10 hidden border-t-[1.5px] md:block">
          {options.map((o) => (
            <li key={o.title} className="border-rule border-b">
              <OptionRow option={o} />
            </li>
          ))}
        </ul>
        <AvailabilityLine text={profile.availabilityLine} className="mt-7 hidden md:block" />
      </div>

      <div>
        <ContactForm email={profile.email} />
        <ul className="mt-6 md:hidden">
          {options
            .filter((o) => !o.title.startsWith("Book"))
            .map((o) => (
              <li key={o.title} className="border-rule border-t">
                <OptionRow option={o} compact />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

function OptionRow({ option, compact }: { option: Option; compact?: boolean }) {
  const inner = (
    <>
      <div className={`font-heading ${compact ? "text-[17px]" : "text-[20px]"}`}>
        {option.title}
      </div>
      <div className={`text-muted mt-0.5 ${compact ? "text-[13px]" : "text-[14px]"}`}>
        {option.detail}
      </div>
    </>
  );
  const cls = `block transition-[padding] duration-200 ${compact ? "py-3.5" : "py-[18px]"}`;
  if (!option.href) return <div className={cls}>{inner}</div>;
  return (
    <a
      href={option.href}
      {...(option.external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`${cls} hover:pl-2`}
    >
      {inner}
    </a>
  );
}
