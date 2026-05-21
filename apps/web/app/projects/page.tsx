import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, type SanityProject } from "@/lib/sanity";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Selected full-stack web work by Michael Padin — production React, Next.js, Node.js, and Cloudflare apps shipped for clients in Australia, the US, and beyond.",
  path: "/projects",
});

const DEMO_PROJECTS: SanityProject[] = [
  {
    _id: "1",
    title: "Image Edits Platform",
    slug: { current: "image-edits" },
    tagline:
      "Scalable bulk image processing pipeline. AWS S3, BullMQ job queues, dynamic watermarking, Socket.io progress.",
    techStack: ["Turborepo", "Next.js", "Express", "BullMQ", "AWS S3", "Prisma", "Socket.io"],
    category: "Full-Stack App",
    featured: true,
    overview:
      "5-app Turborepo monorepo for a Brisbane-based real estate photo editing company. Handles bulk uploads, AI editing, marketplace, and bookings.",
  },
  {
    _id: "2",
    title: "JimDaisy.com",
    slug: { current: "jimdaisy" },
    tagline:
      "Student housing platform combining two California properties. Drove first online inquiries within two weeks.",
    techStack: ["Next.js", "Cloudflare Workers", "Porkbun", "Zoho Mail", "Google Business Profile"],
    category: "Freelance",
    featured: true,
    liveUrl: "https://jimdaisy.com",
    overview:
      "Built for a California-based landlord with no web presence. Full Next.js site, custom domain via Porkbun, deployed on Cloudflare Workers.",
  },
  {
    _id: "3",
    title: "Booking Platform",
    slug: { current: "booking-platform" },
    tagline:
      "Aryeo-style photographer booking platform with branded storefronts and client delivery.",
    techStack: ["Next.js", "TanStack", "PostgreSQL", "Stripe", "Cloudflare Workers"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "Photographers get their own branded storefront to list services, take bookings, and deliver assets to clients in one platform.",
  },
  {
    _id: "4",
    title: "AI Image Editor",
    slug: { current: "ai-image-editor" },
    tagline:
      "Credit-based AI editing platform for real estate photographers with real-time preview.",
    techStack: ["Next.js", "Cloudflare Workers", "Hono", "Socket.io", "Stripe", "BullMQ"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "Fotello-style platform allowing photographers to purchase editing credits and submit real estate photos for AI-powered editing.",
  },
];

export default async function ProjectsPage() {
  const projects = await getAllProjects().catch(() => DEMO_PROJECTS);
  const display = projects.length > 0 ? projects : DEMO_PROJECTS;

  const featuredCount = display.filter((p) => p.featured).length;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects — Michael Padin",
    url: `${siteUrl}/projects`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: display.map((p, i) => {
        const slug = typeof p.slug === "string" ? p.slug : p.slug?.current;
        return {
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/projects/${slug}`,
          name: p.title,
        };
      }),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
    ],
  };

  return (
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip */}
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">Projects</Field>
            <Field label="Total">
              <span className="tabular-nums">{display.length}</span> entries
            </Field>
            <Field label="Featured">
              <span className="tabular-nums">{featuredCount}</span>
            </Field>
            <Field label="Catalog">Reverse chronological</Field>
          </dl>
        </div>

        {/* Title */}
        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <h1 className="font-spec text-ink max-w-[20ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            All projects, shipped to production.
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
            Freelance work, full-time engagements, and side experiments. Each entry links to a case
            study with the problem, the build, and the result.
          </p>
        </div>

        {/* Index header */}
        <section className="mt-[clamp(4rem,6vw,5rem)]">
          <header className="border-paper-rule mb-3 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Index
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §01 · {display.length} entries
            </span>
          </header>

          {/* Header row labels */}
          <div className="font-spec-mono text-ink-3 border-paper-rule hidden grid-cols-12 gap-x-4 border-b py-2 text-[11px] tracking-[0.04em] uppercase sm:grid">
            <span className="col-span-1 pl-2">No.</span>
            <span className="col-span-4">Project</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-4">Stack</span>
            <span className="col-span-1 pr-2 text-right">Status</span>
          </div>

          <ol>
            {display.map((project, i) => (
              <ProjectRow key={project._id} project={project} index={i} />
            ))}
          </ol>
        </section>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(4rem,6vw,6rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            End of catalog · {display.length} entries
          </span>
          <Link
            href="/"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← Back to /
          </Link>
        </div>
      </div>
    </main>
  );
}

function ProjectRow({ project, index }: { project: SanityProject; index: number }) {
  const slug = typeof project.slug === "string" ? project.slug : project.slug?.current;
  const stack = (project.techStack ?? []).slice(0, 5).join(" · ");

  return (
    <li className="border-paper-rule border-b">
      <Link
        href={`/projects/${slug}`}
        className="group hover:bg-paper-tint grid grid-cols-12 items-baseline gap-x-4 py-5 transition-colors"
      >
        <span className="text-ink-3 group-hover:text-signal font-spec-mono col-span-2 pl-2 text-[13px] tabular-nums transition-colors sm:col-span-1">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="font-spec text-ink group-hover:text-signal col-span-10 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug font-medium tracking-[-0.015em] transition-colors sm:col-span-4">
          {project.title}
          {project.featured && (
            <span className="text-signal font-spec-mono ml-2 text-[10px] tracking-[0.04em] uppercase">
              ★ featured
            </span>
          )}
        </span>

        <span className="text-ink-2 font-spec col-span-6 mt-1 text-[13px] sm:col-span-2 sm:mt-0">
          {project.category ?? "—"}
        </span>

        <span className="text-ink-3 font-spec col-span-6 mt-1 truncate text-[13px] sm:col-span-4 sm:mt-0">
          {stack}
        </span>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-ink-3 select-none">{label}</dt>
      <dd className="text-ink font-normal normal-case">{children}</dd>
    </div>
  );
}
