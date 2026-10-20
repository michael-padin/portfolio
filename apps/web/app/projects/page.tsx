import type { Metadata } from "next";
import {
  getAllProjects,
  getProfile,
  imageUrl,
  projectTag,
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
} from "@/lib/sanity";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { FoundingOffer } from "@/components/sections/FoundingOffer";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Booking, POS, inventory and payroll systems built for businesses in Cebu, plus work for clients abroad.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([
    getAllProjects().catch(() => FALLBACK_PROJECTS),
    getProfile().catch(() => FALLBACK_PROFILE),
  ]);

  const items = projects.map((p) => ({
    project: p,
    coverUrl: imageUrl(p.coverImage, 1200, 750),
    tag: projectTag(p),
  }));

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work: Michael Padin",
    url: `${siteUrl}/projects`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/projects/${p.slug.current}`,
        name: p.headline ?? p.title,
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/projects` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <header className="container-page flex flex-col gap-4 pt-6 pb-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-14 md:pb-10">
        <div>
          <p className="eyebrow">Work</p>
          <h1 className="text-h1 mt-3 md:mt-4">Systems I&apos;ve built</h1>
        </div>
        <p className="text-muted max-w-[40ch] text-[16px] leading-[1.55] md:text-[17px]">
          Systems running in Cebu businesses today, plus work for clients abroad.
        </p>
      </header>
      <ProjectGrid items={items} />
      <FoundingOffer profile={profile} variant="work" />
    </>
  );
}
