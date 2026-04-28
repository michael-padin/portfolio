import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/sanity";
import { imageUrl } from "@/lib/sanity";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="card card-accent group flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-[var(--surface-2)]">
        {imageUrl(project.coverImage, 600, 350) ? (
          <Image
            src={imageUrl(project.coverImage, 600, 350)!}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="dot-grid absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-[var(--text-muted)]">[ preview ]</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 font-mono text-xs text-[var(--accent)]">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
            {project.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{project.tagline}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 5).map((t) => (
            <span key={t} className="tech-badge">
              {t}
            </span>
          ))}
          {(project.techStack?.length ?? 0) > 5 && (
            <span className="tech-badge">+{project.techStack.length - 5}</span>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--border)] pt-2">
          {project.liveUrl && (
            <span className="font-mono text-xs text-[var(--accent)]">↗ Live</span>
          )}
          {project.githubUrl && (
            <span className="font-mono text-xs text-[var(--text-muted)]">⌥ Code</span>
          )}
          <span className="ml-auto font-mono text-xs text-[var(--accent)] transition-transform group-hover:translate-x-1">
            Case study →
          </span>
        </div>
      </div>
    </Link>
  );
}
