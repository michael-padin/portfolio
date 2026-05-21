import Link from "next/link";
import Image from "next/image";
import type { SanityProject } from "@/lib/sanity";
import { imageUrl } from "@/lib/sanity";

interface Props {
  projects: SanityProject[];
}

export function ProjectsSection({ projects }: Props) {
  const display = projects.length > 0 ? projects : DEMO_PROJECTS;
  const [lead, ...rest] = display;

  return (
    <section id="projects" className="relative py-[clamp(5rem,8vw,8rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Section title */}
        <header className="border-paper-rule flex items-end justify-between border-b pb-3">
          <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
            Selected work
          </h2>
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            §02 · {display.length} {display.length === 1 ? "entry" : "entries"}
          </span>
        </header>

        {/* Lead project */}
        {lead && <LeadRow project={lead} index={0} />}

        {/* Rest as list rows */}
        {rest.length > 0 && (
          <ol className="border-paper-rule mt-2 border-t">
            {rest.map((p, i) => (
              <ListRow key={p._id} project={p} index={i + 1} />
            ))}
          </ol>
        )}

        {/* All-work link */}
        <div className="border-paper-rule mt-12 flex items-center gap-3 border-t pt-4 text-[13px]">
          <span className="font-spec-mono text-ink-3 tracking-[0.04em] uppercase">More</span>
          <Link
            href="/projects"
            className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-0.5 font-medium transition-colors"
          >
            All projects, including non-featured
          </Link>
        </div>
      </div>
    </section>
  );
}

function LeadRow({ project, index }: { project: SanityProject; index: number }) {
  const slug = typeof project.slug === "string" ? project.slug : project.slug?.current;
  const cover = imageUrl(project.coverImage, 1600, 900);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-12 gap-x-6 gap-y-6"
    >
      {/* Number + meta column */}
      <div className="col-span-12 md:col-span-3 md:pt-2">
        <div className="flex items-baseline gap-3">
          <span className="font-spec-mono text-signal text-[clamp(1.5rem,2vw,2rem)] leading-none tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            Lead
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[12px]">
          <dt className="font-spec-mono text-ink-3 tracking-[0.04em] uppercase">Category</dt>
          <dd className="text-ink">{project.category ?? "—"}</dd>
          <dt className="font-spec-mono text-ink-3 tracking-[0.04em] uppercase">Stack</dt>
          <dd className="text-ink-2">{(project.techStack ?? []).slice(0, 4).join(", ")}</dd>
          <dt className="font-spec-mono text-ink-3 tracking-[0.04em] uppercase">Status</dt>
          <dd className="text-signal font-medium">Shipped</dd>
        </dl>
      </div>

      {/* Image + title column */}
      <div className="col-span-12 md:col-span-9">
        {cover ? (
          <div className="border-paper-rule bg-paper-tint relative aspect-[16/9] overflow-hidden border">
            <Image
              src={cover}
              alt={project.coverImage?.alt ?? `${project.title} — ${project.tagline}`}
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-cover transition-[filter] duration-300 ease-out group-hover:grayscale-0"
              priority
            />
          </div>
        ) : (
          <div className="border-paper-rule bg-paper-tint relative flex aspect-[16/9] items-end border p-6">
            <span className="font-spec text-ink-3 text-[clamp(1rem,1.5vw,1.25rem)]">
              {project.title}
            </span>
          </div>
        )}

        <h3 className="font-spec text-ink mt-5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.025em]">
          {project.title}
          <span className="text-ink-3 group-hover:text-signal ml-3 inline-block align-middle text-[0.6em] font-normal transition-colors">
            ↗
          </span>
        </h3>
        <p className="font-spec text-ink-2 mt-3 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
          {project.tagline}
        </p>
      </div>
    </Link>
  );
}

function ListRow({ project, index }: { project: SanityProject; index: number }) {
  const slug = typeof project.slug === "string" ? project.slug : project.slug?.current;
  const stack = (project.techStack ?? []).slice(0, 5).join(" · ");

  return (
    <li className="border-paper-rule border-b">
      <Link
        href={`/projects/${slug}`}
        className="group hover:bg-paper-tint grid grid-cols-12 items-baseline gap-x-4 py-5 transition-colors"
      >
        {/* Number */}
        <span className="text-ink-3 group-hover:text-signal font-spec-mono col-span-2 pl-2 text-[13px] tabular-nums transition-colors sm:col-span-1">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <span className="font-spec text-ink group-hover:text-signal col-span-10 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug font-medium tracking-[-0.015em] transition-colors sm:col-span-4">
          {project.title}
        </span>

        {/* Category */}
        <span className="text-ink-2 font-spec col-span-6 mt-1 text-[13px] sm:col-span-2 sm:mt-0">
          {project.category ?? "—"}
        </span>

        {/* Stack */}
        <span className="text-ink-3 font-spec col-span-6 mt-1 truncate text-[13px] sm:col-span-4 sm:mt-0">
          {stack}
        </span>

        {/* Status + arrow */}
        <span className="text-signal font-spec-mono col-span-12 mt-2 flex items-center justify-end gap-2 pr-2 text-[12px] sm:col-span-1 sm:mt-0">
          <span className="font-medium">shipped</span>
          <span
            aria-hidden
            className="text-ink-3 group-hover:text-signal -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          >
            ↗
          </span>
        </span>
      </Link>
    </li>
  );
}

// Demo data shown when Sanity is not yet configured
const DEMO_PROJECTS: SanityProject[] = [
  {
    _id: "1",
    title: "Image Edits Platform",
    slug: { current: "image-edits" },
    tagline:
      "Scalable bulk image processing pipeline. Express + TypeScript backend, AWS S3, dynamic watermarking, BullMQ job queues, Socket.io progress.",
    techStack: ["Turborepo", "Next.js", "Express", "BullMQ", "AWS S3", "Prisma"],
    category: "Full-Stack App",
    featured: true,
    overview:
      "Architected and delivered a scalable Express.js + TypeScript backend for a real estate photo editing SaaS.",
  },
  {
    _id: "2",
    title: "JimDaisy.com",
    slug: { current: "jimdaisy" },
    tagline:
      "Student housing site combining two California properties. Drove first online inquiries within two weeks of launch.",
    techStack: ["Next.js", "Cloudflare Workers", "Porkbun", "Zoho Mail", "SEO"],
    category: "Freelance",
    featured: true,
    liveUrl: "https://jimdaisy.com",
    overview:
      "Built a combined property listing site for a California-based landlord targeting student housing.",
  },
  {
    _id: "3",
    title: "Booking Platform (Aryeo-style)",
    slug: { current: "booking-platform" },
    tagline:
      "Photographer booking and delivery platform with branded storefronts and a TanStack Query migration.",
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
      "Credit-based AI image editing platform for real estate photographers with real-time previews.",
    techStack: ["Next.js", "Cloudflare Workers", "Hono", "Socket.io", "Stripe"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "AI-powered frontend allowing real estate photographers to purchase editing credits and receive processed images.",
  },
];
