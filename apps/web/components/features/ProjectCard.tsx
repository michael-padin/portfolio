import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug.current}`} className="card card-accent flex flex-col overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-44 bg-[var(--surface-2)] overflow-hidden">
        {project.coverImage ? (
          <Image
            src={urlFor(project.coverImage).width(600).height(350).url()}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center dot-grid">
            <span className="font-mono text-xs text-[var(--text-muted)]">[ preview ]</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-mono bg-[var(--background)] border border-[var(--border)] px-2 py-1 rounded text-[var(--accent)]">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{project.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.techStack?.slice(0, 5).map((t) => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
          {(project.techStack?.length ?? 0) > 5 && (
            <span className="tech-badge">+{project.techStack.length - 5}</span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
          {project.liveUrl && (
            <span className="text-xs text-[var(--accent)] font-mono">↗ Live</span>
          )}
          {project.githubUrl && (
            <span className="text-xs text-[var(--text-muted)] font-mono">⌥ Code</span>
          )}
          <span className="ml-auto text-xs text-[var(--accent)] font-mono group-hover:translate-x-1 transition-transform">
            Case study →
          </span>
        </div>
      </div>
    </Link>
  );
}
