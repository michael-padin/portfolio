import Link from "next/link";
import type { Profile } from "@/lib/sanity";
import { features } from "@/lib/features";

export function Services({ profile }: { profile: Profile }) {
  const showPrices = features.showPrices;
  const quoteHref = features.contact
    ? "/contact"
    : (profile.bookingUrl ?? `mailto:${profile.email}`);

  return (
    <section id="services" className="container-page scroll-mt-6 py-12 md:py-24">
      <div className="grid gap-5 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <h2 className="text-[32px] leading-[1.08] tracking-[-0.015em] md:text-[48px] md:leading-[1.05]">
            What I build
          </h2>
          {showPrices ? (
            <>
              <p className="text-muted mt-4 max-w-[30ch] text-[16px] leading-normal">
                Typical ranges, so our first call skips the awkward “hmm, depends.” You get a fixed
                quote before any work starts, paid in 3 milestones.
              </p>
              <p className="mt-3.5 max-w-[30ch] text-[14px] leading-normal text-[oklch(45%_0.02_50)]">
                What moves the price: number of users, online payments, branches and integrations.
              </p>
            </>
          ) : (
            <div className="hidden md:block">
              <p className="text-muted mt-4 max-w-[30ch] text-[16px] leading-normal">
                Every business runs differently, so every quote is different too. You get a free,
                fixed quote within 48 hours, paid in milestones.
              </p>
              <p className="border-rule mt-[18px] max-w-[30ch] border-t pt-4 text-[15px] leading-normal">
                <strong>Start small, grow later. </strong>Launch with just online booking, then add
                payments and inventory when you&apos;re ready.
              </p>
              <QuoteLink href={quoteHref} className="mt-5" />
            </div>
          )}
        </div>

        <div>
          <ol className="border-ink border-t-[1.5px]">
            {profile.services.map((s, i) => (
              <li
                key={s.name}
                className={`border-rule grid items-center gap-x-5 border-b py-4 transition-[padding] duration-200 md:py-[22px] md:hover:pl-2.5 ${
                  showPrices
                    ? "grid-cols-[1fr_auto] md:grid-cols-[44px_1fr_150px]"
                    : "md:grid-cols-[44px_1fr]"
                }`}
              >
                <span className="font-heading text-mango-deep hidden text-[26px] md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-[19px] leading-[1.2] md:text-[23px]">{s.name}</h3>
                    <span className="hidden font-mono text-[11px] text-[oklch(50%_0.02_50)] uppercase md:inline">
                      {s.kind}
                    </span>
                  </div>
                  <p className="text-muted mt-1 max-w-[52ch] text-[14px] leading-[1.45] md:text-[15px] md:leading-normal">
                    {s.description}
                  </p>
                </div>
                {showPrices && s.priceRange && (
                  <div className="self-start text-right md:self-center">
                    <div className="text-subtle hidden text-[12px] md:block">usually</div>
                    <div className="text-[15px] font-bold whitespace-nowrap tabular-nums md:text-[20px]">
                      {s.priceRange}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>

          {showPrices ? (
            <p className="mt-3.5 text-[13px] text-[oklch(45%_0.02_50)] md:hidden">
              Typical ranges. Fixed quote, paid in 3 milestones.
            </p>
          ) : (
            <div className="md:hidden">
              <p className="text-muted mt-4 text-[14px] leading-normal">
                Free, fixed quote within 48 hours.{" "}
                <strong className="text-ink">Start small, grow later: </strong>begin with booking,
                add payments and inventory when you&apos;re ready.
              </p>
              <QuoteLink href={quoteHref} className="mt-4" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QuoteLink({ href, className }: { href: string; className: string }) {
  const cls = `link-mango inline-flex ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      Get a free quote
    </Link>
  ) : (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
    >
      Get a free quote
    </a>
  );
}
