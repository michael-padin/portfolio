import Link from "next/link";
import type { Project, StaticImage } from "@/lib/sanity";
import { TeamCalendar } from "@/components/mocks/TeamCalendar";
import { SalonDashboard } from "@/components/mocks/SalonDashboard";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { BrowserWindow, PhoneFrame, Stage } from "./ScreenFrame";

/**
 * A project's visual: its screenshot staged in a browser window, a built-in
 * HTML mock, or a striped placeholder. Images are resolved server-side so this
 * stays usable from client components.
 *
 * The window is wider than the stage on purpose: it runs off the bottom-right
 * edge, which crops the app to its top-left corner and keeps the text readable
 * at card size.
 */
export function ProjectVisual({
  project,
  cover,
  phone,
  variant = "card",
  sizes,
  priority,
}: {
  project: Project;
  cover: StaticImage | null;
  phone?: StaticImage | null;
  variant?: "card" | "hero";
  sizes: string;
  priority?: boolean;
}) {
  const hero = variant === "hero";
  const frame = hero
    ? "h-[300px] rounded-[20px] sm:h-[420px] md:h-[600px] md:rounded-[24px]"
    : "aspect-[16/10] rounded-[16px] md:rounded-[20px]";

  if (!cover) {
    return (
      <div className={`bg-tint relative overflow-hidden ${frame}`}>
        {project.coverMock === "team-calendar" ? (
          <TeamCalendar />
        ) : project.coverMock === "salon-dashboard" ? (
          <div className="flex h-full items-center p-6">
            <SalonDashboard />
          </div>
        ) : (
          <ImageSlot label={`${project.title} screenshot`} />
        )}
      </div>
    );
  }

  return (
    <Stage tone={project.tone} className={frame}>
      <BrowserWindow
        image={cover}
        sizes={sizes}
        priority={priority}
        rounded="rounded-tl-[10px] md:rounded-tl-[14px]"
        className={
          hero
            ? "absolute top-[7%] left-[4%] w-[118%] sm:w-[104%] md:top-[8%] md:left-[5%] md:w-[97%]"
            : "absolute top-[11%] left-[7%] w-[118%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-1.5 group-hover:-translate-y-1.5"
        }
      />
      {hero && phone && (
        <PhoneFrame
          image={phone}
          className="absolute right-[5%] -bottom-[14%] w-[104px] sm:w-[150px] md:-bottom-[12%] md:w-[214px]"
        />
      )}
    </Stage>
  );
}

export function ProjectCard({
  project,
  cover,
  tag,
  showStack = false,
}: {
  project: Project;
  cover: StaticImage | null;
  tag: string;
  showStack?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group flex flex-col gap-3 md:gap-3.5"
    >
      <ProjectVisual project={project} cover={cover} sizes="(min-width: 768px) 584px, 100vw" />
      <span className="text-eyebrow text-[12px] font-semibold md:text-[13px]">{tag}</span>
      <h3 className="text-[22px] leading-[1.15] tracking-[-0.01em] transition-colors duration-200 group-hover:text-[oklch(55%_0.15_55)] md:text-[28px] md:leading-[1.12]">
        {project.headline ?? project.title}
      </h3>
      <p className="text-muted max-w-[50ch] text-[14px] leading-[1.55] md:text-[15px]">
        {project.tagline}
      </p>
      {showStack && project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <span key={t} className="stack-chip">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
