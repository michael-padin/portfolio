import type { Profile } from "@/lib/sanity";
import { BookButton } from "@/components/ui/BookButton";

/** The mango panel above the footer. The heading changes per page. */
export function CtaBand({ heading, profile }: { heading: string; profile: Profile }) {
  return (
    <section className="mx-auto max-w-[1328px] px-3 md:px-6">
      <div className="bg-mango flex flex-col gap-5 rounded-[24px] px-5 py-10 md:flex-row md:items-end md:justify-between md:gap-10 md:rounded-[28px] md:px-14 md:py-[72px]">
        <h2 className="text-cta max-w-[14ch]">{heading}</h2>
        <div className="flex flex-col gap-3 md:items-end">
          <BookButton
            bookingUrl={profile.bookingUrl}
            email={profile.email}
            variant="dark"
            track="book-call-cta"
            className="w-full md:w-auto"
          />
          <a
            href={`mailto:${profile.email}`}
            className="self-center border-b-[1.5px] border-current pb-0.5 font-mono text-[14px] md:self-auto md:text-[15px]"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </section>
  );
}
