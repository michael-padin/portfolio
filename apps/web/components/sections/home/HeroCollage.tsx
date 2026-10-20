import Link from "next/link";
import type { ProjectTone, StaticImage } from "@/lib/sanity";
import { BrowserWindow, PhoneFrame } from "@/components/projects/ScreenFrame";

export type CollageShot = {
  href: string;
  label: string;
  tone?: ProjectTone;
  image: StaticImage;
};

const DOT: Record<ProjectTone, string> = {
  rose: "bg-[oklch(70%_0.12_32)]",
  clay: "bg-[oklch(50%_0.08_45)]",
  sky: "bg-[oklch(62%_0.11_235)]",
  mint: "bg-[oklch(64%_0.11_165)]",
  tint: "bg-mango",
};

// Three overlapping windows, back to front. Percentages keep the arrangement
// intact as the column narrows.
const SLOTS = [
  "top-0 left-0 w-[80%] z-10",
  "top-[24%] right-0 w-[72%] z-20",
  "bottom-[2%] left-[6%] w-[64%] z-30 hidden sm:block",
];

/** The home hero's collage: real systems, shown with example data. */
export function HeroCollage({
  shots,
  phone,
}: {
  shots: CollageShot[];
  phone?: StaticImage | null;
}) {
  return (
    <figure className="relative">
      <div className="relative aspect-[1/0.78] sm:aspect-[1/0.92]">
        {shots.slice(0, 3).map((shot, i) => (
          <Link
            key={shot.href}
            href={shot.href}
            aria-label={`${shot.label} case study`}
            className={`group absolute ${SLOTS[i]}`}
          >
            <BrowserWindow
              image={shot.image}
              sizes="(min-width: 1024px) 460px, (min-width: 768px) 40vw, 80vw"
              priority={i === 0}
              className="transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1.5"
            />
            <span className="bg-ink text-paper absolute -top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shadow-[0_6px_16px_-6px_oklch(25%_0.03_50/0.5)] md:left-4 md:text-[12px]">
              <span aria-hidden className={`size-1.5 rounded-full ${DOT[shot.tone ?? "tint"]}`} />
              {shot.label}
            </span>
          </Link>
        ))}
        {phone && (
          <PhoneFrame
            image={phone}
            className="absolute right-[3%] -bottom-[4%] z-40 w-[22%] min-w-[78px] sm:right-[2%] sm:w-[20%]"
          />
        )}
      </div>
      <figcaption className="text-subtle mt-6 text-right font-mono text-[11px] md:mt-8">
        Real systems, example data
      </figcaption>
    </figure>
  );
}
