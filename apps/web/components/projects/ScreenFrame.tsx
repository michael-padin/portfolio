import Image from "next/image";
import type { ProjectTone, StaticImage } from "@/lib/sanity";

const TONE: Record<ProjectTone, string> = {
  rose: "bg-stage-rose",
  clay: "bg-stage-clay",
  sky: "bg-stage-sky",
  mint: "bg-stage-mint",
  tint: "bg-stage-tint",
};

/**
 * The soft coloured ground a screenshot sits on. A faint light from the
 * top-left keeps the flat tone from reading as an empty box.
 */
export function Stage({
  tone = "tint",
  className = "",
  children,
}: {
  tone?: ProjectTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden ${TONE[tone]} ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(110% 90% at 0% 0%, oklch(100% 0 0 / 0.38), transparent 62%)",
      }}
    >
      {children}
    </div>
  );
}

/** A screenshot in a quiet browser window: three dots, no fake URL bar. */
export function BrowserWindow({
  image,
  sizes,
  priority,
  className = "",
  rounded = "rounded-[10px] md:rounded-[12px]",
}: {
  image: StaticImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={`shadow-window overflow-hidden bg-white ${rounded} ${className}`}>
      <div
        aria-hidden
        className="flex h-[14px] items-center gap-[4px] border-b border-[oklch(93%_0.01_70)] bg-[oklch(98.5%_0.006_80)] px-[7px] sm:h-5 sm:gap-[5px] sm:px-2.5 md:h-6"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[4px] rounded-full bg-[oklch(86%_0.02_70)] sm:size-[6px] md:size-[7px]"
          />
        ))}
      </div>
      <Image
        src={image.src}
        alt={image.alt}
        width={1440}
        height={900}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </div>
  );
}

/** A phone-sized screenshot in a slim ink bezel. */
export function PhoneFrame({ image, className = "" }: { image: StaticImage; className?: string }) {
  return (
    <div
      className={`shadow-phone bg-ink overflow-hidden rounded-[22px] p-[5px] md:rounded-[30px] md:p-[7px] ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={375}
        height={844}
        sizes="(min-width: 768px) 220px, 120px"
        className="block h-auto w-full rounded-[17px] md:rounded-[23px]"
      />
    </div>
  );
}
