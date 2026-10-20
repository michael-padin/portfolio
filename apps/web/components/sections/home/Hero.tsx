import type { Profile, StaticImage } from "@/lib/sanity";
import { AvailabilityLine, Marked } from "@/components/ui/Marked";
import { BookButton } from "@/components/ui/BookButton";
import { SalonDashboard } from "@/components/mocks/SalonDashboard";
import { HeroCollage, type CollageShot } from "./HeroCollage";

export function Hero({
  profile,
  shots,
  phone,
}: {
  profile: Profile;
  shots: CollageShot[];
  phone?: StaticImage | null;
}) {
  return (
    <section className="container-page grid items-center gap-7 pt-5 pb-12 md:grid-cols-[1fr_1.05fr] md:gap-12 md:pt-14 md:pb-24">
      <div>
        <AvailabilityLine text={profile.availabilityLine} />
        <h1 className="text-h1 mt-5 md:mt-7">{profile.heroTagline}</h1>
        <p className="text-lead text-body mt-4 max-w-[38ch] md:mt-6">
          <Marked text={profile.heroSub} />
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-9">
          <BookButton
            bookingUrl={profile.bookingUrl}
            email={profile.email}
            track="book-call-hero"
            className="w-full sm:w-auto"
          />
          <a href="#services" className="btn btn-outline hidden sm:inline-flex">
            See what I build
          </a>
        </div>
        <p className="mt-5 text-[14px] text-[oklch(45%_0.02_50)]">{profile.heroAside}</p>
      </div>
      {/* Until two systems have screenshots, the example dashboard stands in */}
      {shots.length >= 2 ? <HeroCollage shots={shots} phone={phone} /> : <SalonDashboard />}
    </section>
  );
}
