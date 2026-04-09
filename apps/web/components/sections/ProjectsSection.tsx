import Link from "next/link";
import Image from "next/image";
import type { SanityProject } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-display text-display-lg text-text-primary max-w-lg">
              Projects that <span className="italic text-accent">shipped</span>
            </h2>
            <Link href="/projects" className="btn-ghost text-sm shrink-0 self-start sm:self-auto">
              View all work →
            </Link>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
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
      <div className={`relative overflow-hidden bg-surface ${featured ? "h-72" : "h-48"}`}>
        {project.coverImage ? (
          <Image
            src={urlFor(project.coverImage)
              .width(800)
              .height(featured ? 400 : 280)
              .url()}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage title={project.title} featured={featured} />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60" />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="label-tag text-2xs">{project.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl text-text-primary mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{project.tagline}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
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

function PlaceholderImage({ title, featured }: { title: string; featured: boolean }) {
  return (
    <div
      className={`w-full ${featured ? "h-72" : "h-48"} flex items-center justify-center bg-gradient-to-br from-surface to-bg-secondary`}
    >
      <div className="text-center">
        <div className="text-4xl font-display text-accent/30 font-bold">
          {title.charAt(0).toUpperCase()}
        </div>
        <div className="text-text-muted text-xs mt-2 font-mono">{title}</div>
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
