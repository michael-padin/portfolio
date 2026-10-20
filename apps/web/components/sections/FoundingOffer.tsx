import Link from "next/link";
import type { Profile } from "@/lib/sanity";
import { features } from "@/lib/features";
import { Marked } from "@/components/ui/Marked";

const WORDS = ["zero", "one", "two", "three", "four", "five", "six"];

/**
 * The founding-client offer box. Shown only when the env flag is on and the
 * offer is enabled in Sanity, so it can be retired without a deploy.
 */
export function FoundingOffer({
  profile,
  variant = "home",
}: {
  profile: Profile;
  variant?: "home" | "work";
}) {
  const offer = profile.foundingOffer;
  if (!features.foundingOffer || !offer?.enabled) return null;

  const spots = offer.spots ?? 3;
  const heading =
    variant === "home"
      ? "Founding client offer for Cebu businesses"
      : "Your business could be the next case study";
  const body =
    variant === "home"
      ? (offer.body ?? "")
      : `The first ${WORDS[spots] ?? spots} Cebu businesses get ${offer.discount ?? "20%"} off their system in exchange for a write-up and a short testimonial.`;

  const cta = "btn btn-dark w-full md:w-auto";

  return (
    <section className="container-page pb-11 md:pb-24">
      <div className="border-ink grid items-center gap-4 rounded-[20px] border-[1.5px] px-5 py-6 md:grid-cols-[auto_1fr_auto] md:gap-9 md:rounded-[24px] md:px-11 md:py-10">
        <div className="font-heading text-mango-deep hidden text-[64px] leading-none md:block">
          {spots}
        </div>
        <div>
          <h2 className="text-[22px] leading-[1.2] md:text-[28px] md:leading-[1.15]">{heading}</h2>
          <p className="text-muted mt-2 max-w-[60ch] text-[15px] leading-normal md:text-[16px]">
            <Marked text={body} />
          </p>
        </div>
        {features.contact ? (
          <Link href="/contact" className={cta}>
            Claim a spot
          </Link>
        ) : (
          <a
            href={profile.bookingUrl ?? `mailto:${profile.email}`}
            className={cta}
            {...(profile.bookingUrl && { target: "_blank", rel: "noopener noreferrer" })}
          >
            Claim a spot
          </a>
        )}
      </div>
    </section>
  );
}
