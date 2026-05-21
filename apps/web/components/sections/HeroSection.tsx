import type { Profile } from "@/lib/sanity";

interface Props {
  profile: Profile;
}

export function HeroSection({ profile }: Props) {
  const available = profile.availableForFreelance || profile.availableForFullTime;
  const status = available ? profile.availabilityNote : "Not currently available";
  const [city] = profile.location.split(",").map((s) => s.trim());

  return (
    <section className="relative pt-[clamp(7rem,12vw,11rem)] pb-[clamp(6rem,10vw,10rem)]">
      <div className="mx-auto w-full max-w-[1280px] px-[clamp(1.5rem,4vw,3rem)]">
        {/* Metadata strip */}
        <div className="border-b border-[color:var(--color-paper-rule)] pb-3">
          <dl className="font-spec-mono text-ink-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
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

        {/* Foot of section: tiny anchor */}
        <div className="mt-[clamp(3rem,6vw,5rem)] flex items-center gap-3 text-[13px]">
          <span className="text-ink-3 font-spec-mono tracking-[0.04em] uppercase">§ Below</span>
          <a
            href="#projects"
            className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-[2px] font-medium transition-colors"
          >
            Selected work
          </a>
          <span className="text-ink-3">·</span>
          <a
            href="#about"
            className="text-ink-2 hover:text-signal hover:border-signal border-b border-transparent pb-[2px] transition-colors"
          >
            About
          </a>
          <span className="text-ink-3">·</span>
          <a
            href={`mailto:${profile.email}`}
            className="text-ink-2 hover:text-signal hover:border-signal border-b border-transparent pb-[2px] transition-colors"
          >
            Write
          </a>
          {profile.bookingUrl && (
            <>
              <span className="text-ink-3">·</span>
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
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-ink-3 select-none">{label}</dt>
      <dd className="text-ink font-normal normal-case">{children}</dd>
    </div>
  );
}
