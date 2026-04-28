import type { MetadataRoute } from "next";
import { getAllProjects, getAllPosts } from "@/lib/sanity";
import { features } from "@/lib/features";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://michaelpadin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getAllProjects().catch(() => []),
    features.blog ? getAllPosts().catch(() => []) : Promise.resolve([]),
  ]);

  const projectUpdates = projects
    .map((p) => p._updatedAt ?? p.publishedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .reverse();
  const postUpdates = posts
    .map((p) => p._updatedAt ?? p.publishedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .reverse();

  const homeLastMod = new Date(projectUpdates[0] ?? Date.now());
  const projectsIndexLastMod = new Date(projectUpdates[0] ?? Date.now());
  const blogIndexLastMod = new Date(postUpdates[0] ?? Date.now());

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: homeLastMod, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/about`,
      lastModified: homeLastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: projectsIndexLastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  if (features.contact) {
    staticRoutes.push({
      url: `${SITE_URL}/contact`,
      lastModified: homeLastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  if (features.blog) {
    staticRoutes.push({
      url: `${SITE_URL}/blog`,
      lastModified: blogIndexLastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug.current}`,
    lastModified: new Date(p._updatedAt ?? p.publishedAt ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug.current}`,
    lastModified: new Date(p._updatedAt ?? p.publishedAt ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
