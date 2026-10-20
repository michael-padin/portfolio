import Link from "next/link";
import Image from "next/image";
import type { Project, StaticImage } from "@/lib/sanity";
import { TeamCalendar } from "@/components/mocks/TeamCalendar";
import { SalonDashboard } from "@/components/mocks/SalonDashboard";
import { ImageSlot } from "@/components/ui/ImageSlot";

/**
 * A project's visual: its cover image, a built-in HTML mock, or a striped
 * placeholder. `cover` is resolved server-side so this stays usable from
 * client components.
 */
export function ProjectVisual({
  project,
  cover,
  sizes,
  priority,
  className = "aspect-[16/10] rounded-[16px] md:rounded-[20px]",
}: {
  project: Project;
  cover: StaticImage | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-tint relative overflow-hidden ${className}`}>
      {cover ? (
        // Screenshots keep their header in view when the frame crops them
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      ) : project.coverMock === "team-calendar" ? (
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
