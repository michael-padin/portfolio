import Link from "next/link";
import Image from "next/image";
import type { SanityProject } from "@/lib/sanity";
import { imageUrl } from "@/lib/sanity";
import { ProjectLink } from "../features/ProjectLink";

interface Props {
  projects: SanityProject[];
}

export function ProjectsSection({ projects }: Props) {
  // Fallback demo projects if CMS is empty
  const displayProjects = projects.length > 0 ? projects : DEMO_PROJECTS;

  return (
    <section id="projects" className="py-24">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <div className="label-tag mb-4">Selected work</div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-display text-display-lg text-text-primary max-w-lg">
              Projects that <span className="text-accent italic">shipped</span>
            </h2>
            <Link href="/projects" className="btn-ghost shrink-0 self-start text-sm sm:self-auto">
              View all work →
            </Link>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project._id} project={project} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, featured }: { project: SanityProject; featured: boolean }) {
  const slug = typeof project.slug === "string" ? project.slug : project.slug?.current;

  return (
    <Link
      href={`/projects/${slug}`}
      className={`card group block overflow-hidden ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Image */}
      <div
        className={`bg-surface relative overflow-hidden ${featured ? "aspect-[2/1]" : "aspect-video"}`}
      >
        {imageUrl(project.coverImage, featured ? 1200 : 800, featured ? 600 : 450) ? (
          <Image
            src={imageUrl(project.coverImage, featured ? 1200 : 800, featured ? 600 : 450)!}
            alt={project.title}
            fill
            sizes={
              featured ? "(max-width: 768px) 100vw, 1200px" : "(max-width: 768px) 100vw, 600px"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage title={project.title} />
        )}
        {/* Overlay */}
        <div className="from-bg-card absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="label-tag text-2xs">{project.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-text-primary group-hover:text-accent mb-2 text-xl transition-colors">
          {project.title}
        </h3>
        <p className="text-text-secondary mb-4 text-sm leading-relaxed">{project.tagline}</p>

        {/* Tech stack */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(project.techStack ?? []).slice(0, 5).map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-accent font-medium group-hover:underline">View case study →</span>
          {project.liveUrl && <ProjectLink liveUrl={project.liveUrl} name="Live site ↗" />}
          {project.githubUrl && <ProjectLink liveUrl={project.githubUrl} name="GitHub ↗" />}
        </div>
      </div>
    </Link>
  );
}

function PlaceholderImage({ title }: { title: string }) {
  return (
    <div className="from-surface to-bg-secondary absolute inset-0 flex items-center justify-center bg-gradient-to-br">
      <div className="text-center">
        <div className="font-display text-accent/30 text-4xl font-bold">
          {title.charAt(0).toUpperCase()}
        </div>
        <div className="text-text-muted mt-2 font-mono text-xs">{title}</div>
      </div>
    </div>
  );
}

// Demo data shown when Sanity is not yet configured
const DEMO_PROJECTS: SanityProject[] = [
  {
    _id: "1",
    title: "JimDaisy.com",
    slug: { current: "jimdaisy" },
    tagline:
      "Student housing website combining 2 California properties — drove first online inquiries within 2 weeks of launch",
    techStack: ["Next.js", "Cloudflare Workers", "Porkbun", "Zoho Mail", "SEO"],
    category: "Freelance",
    featured: true,
    liveUrl: "https://jimdaisy.com",
    overview:
      "Built a combined property listing site for a California-based landlord targeting student housing.",
  },
  {
    _id: "2",
    title: "Image Edits Platform",
    slug: { current: "image-edits" },
    tagline:
      "Scalable bulk image processing pipeline with AWS S3, dynamic watermarking, and BullMQ job queues",
    techStack: ["Turborepo", "Next.js", "Express", "BullMQ", "AWS S3", "Prisma"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "Architected and delivered a scalable Express.js + TypeScript backend for a real estate photo editing SaaS.",
  },
  {
    _id: "3",
    title: "Booking Platform (Aryeo-style)",
    slug: { current: "booking-platform" },
    tagline:
      "Photographer booking and delivery platform with branded storefronts, TanStack Query migration",
    techStack: ["Next.js", "TanStack", "Socket.io", "PostgreSQL", "Stripe"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "End-to-end booking app for photographers with branded storefronts, appointment scheduling, and client delivery.",
  },
  {
    _id: "4",
    title: "AI Image Editor (Fotello-style)",
    slug: { current: "ai-image-editor" },
    tagline:
      "Credit-based AI image editing platform for real estate photographers with real-time previews",
    techStack: ["Next.js", "Cloudflare Workers", "Hono", "Socket.io", "Stripe"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "AI-powered frontend allowing real estate photographers to purchase editing credits and receive processed images.",
  },
];
