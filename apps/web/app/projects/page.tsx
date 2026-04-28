import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects, imageUrl, type SanityProject } from "@/lib/sanity";
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
    title: "JimDaisy.com",
    slug: { current: "jimdaisy" },
    tagline:
      "Student housing platform combining 2 California properties — drove first online inquiries within 2 weeks",
    techStack: ["Next.js", "Cloudflare Workers", "Porkbun", "Zoho Mail", "Google Business Profile"],
    category: "Freelance",
    featured: true,
    liveUrl: "https://jimdaisy.com",
    overview:
      "Built for a California-based landlord with no web presence. Full Next.js site, custom domain via Porkbun, deployed on Cloudflare Workers.",
  },
  {
    _id: "2",
    title: "Image Edits Platform",
    slug: { current: "image-edits" },
    tagline:
      "Scalable bulk image processing SaaS — AWS S3, BullMQ job queues, dynamic watermarking",
    techStack: ["Turborepo", "Next.js", "Express", "BullMQ", "AWS S3", "Prisma", "Socket.io"],
    category: "Full-Stack App",
    featured: true,
    overview:
      "5-app Turborepo monorepo for a Brisbane-based real estate photo editing company. Handles bulk uploads, AI editing, marketplace, and bookings.",
  },
  {
    _id: "3",
    title: "Booking Platform",
    slug: { current: "booking-platform" },
    tagline:
      "Aryeo-style photographer booking platform with branded storefronts and client delivery",
    techStack: ["Next.js", "TanStack", "PostgreSQL", "Stripe", "Cloudflare Workers"],
    category: "Full-Stack App",
    featured: false,
    overview:
      "Photographers get their own branded storefront to list services, take bookings, and deliver assets to clients — all in one platform.",
  },
  {
    _id: "4",
    title: "AI Image Editor",
    slug: { current: "ai-image-editor" },
    tagline:
      "Credit-based AI editing platform for real estate photographers with real-time preview",
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
    <div className="min-h-screen pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <div className="label-tag mb-4">Portfolio</div>
          <h1 className="font-display text-display-lg text-text-primary mb-4">All projects</h1>
          <p className="text-text-secondary max-w-2xl text-lg">
            A collection of freelance work, full-time projects, and side experiments. Each one
            shipped to production.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {display.map((project) => {
            const slug = typeof project.slug === "string" ? project.slug : project.slug?.current;
            return (
              <Link
                key={project._id}
                href={`/projects/${slug}`}
                className="card group block overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="from-surface to-bg-secondary relative h-48 overflow-hidden bg-gradient-to-br">
                  {imageUrl(project.coverImage, 600, 300) ? (
                    <Image
                      src={imageUrl(project.coverImage, 600, 300)!}
                      alt={project.coverImage?.alt ?? `${project.title} — ${project.tagline}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-accent/20 text-6xl font-bold">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="label-tag text-2xs">{project.category}</span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent text-bg text-2xs rounded-full px-2 py-0.5 font-mono font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="font-display text-text-primary group-hover:text-accent mb-2 text-xl transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                    {project.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack ?? []).slice(0, 5).map((t) => (
                      <span key={t} className="tech-badge text-2xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
