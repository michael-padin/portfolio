import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function HeroSection({ profile }: Props) {
  const available = profile.availableForFreelance || profile.availableForFullTime;
  const status = available ? profile.availabilityNote : "Not currently available";
  const [city] = profile.location.split(",").map((s) => s.trim());

  return (
    <section className="relative pt-[clamp(6rem,12vw,11rem)] pb-12 sm:pb-[clamp(6rem,10vw,10rem)]">
      <div className="mx-auto w-full max-w-[1280px] px-[clamp(1.5rem,4vw,3rem)]">
        {/* Metadata strip — mobile: single identity line; sm+: full 4-field grid */}
        <div className="border-b border-[color:var(--color-paper-rule)] pb-3">
          <div className="font-spec-mono text-ink-3 flex items-center gap-2 text-[11px] tracking-[0.04em] uppercase sm:hidden">
            <span>§</span>
            <span className="text-ink normal-case">{profile.name}</span>
            <span aria-hidden>·</span>
            <span className="text-ink normal-case">{profile.title}</span>
            <span
              aria-hidden
              className={`ml-auto inline-block size-1.5 rounded-full ${available ? "bg-signal" : "bg-ink-3"}`}
            />
          </div>
          <dl className="font-spec-mono text-ink-3 hidden text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">{profile.name}</Field>
            <Field label="Role">{profile.title}</Field>
            <Field label="Origin">
              {city}, PH · {profile.timezone}
            </Field>
            <Field label="Status">
              <span className={available ? "text-signal" : "text-ink"}>
                <span
                  aria-hidden
                  className={`mr-1.5 inline-block size-[6px] -translate-y-[1px] rounded-full ${
                    available ? "bg-signal" : "bg-ink"
                  }`}
                />
                {status}
              </span>
            </Field>
          </dl>
        </div>

        {/* Declaration */}
        <h1 className="font-spec text-ink mt-[clamp(3rem,8vw,6rem)] max-w-[18ch] text-[clamp(2.75rem,7.5vw,6.25rem)] leading-[0.98] font-medium tracking-[-0.035em]">
          {profile.heroTaglineClient}
        </h1>

        {/* Sub */}
        <p className="font-spec text-ink-2 mt-[clamp(1.5rem,2.5vw,2.25rem)] max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
          {profile.heroSubClient}
        </p>

        {/* Foot of section: tiny anchor row — desktop only.
           On mobile the visitor just scrolls; navbar carries the wayfinding. */}
        <div className="mt-[clamp(3rem,6vw,5rem)] hidden text-[13px] sm:block">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-ink-3 font-spec-mono tracking-[0.04em] uppercase">§ Below</span>
            <a
              href="#projects"
              className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-[2px] font-medium transition-colors"
            >
              Selected work
            </a>
            <span className="text-ink-3" aria-hidden>
              ·
            </span>
            <a
              href="#about"
              className="text-ink-2 hover:text-signal hover:border-signal border-b border-transparent pb-[2px] transition-colors"
            >
              About
            </a>
            <span className="text-ink-3" aria-hidden>
              ·
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="text-ink-2 hover:text-signal hover:border-signal border-b border-transparent pb-[2px] transition-colors"
            >
              Write
            </a>
            {profile.bookingUrl && (
              <>
                <span className="text-ink-3" aria-hidden>
                  ·
                </span>
                <a
                  href={profile.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-2 hover:text-signal hover:border-signal border-b border-transparent pb-[2px] transition-colors"
                >
                  Book a call ↗
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2">
      <dt className="text-ink-3 select-none">{label}</dt>
      <dd className="text-ink font-normal normal-case">{children}</dd>
    </div>
  );
}
