import type { Metadata } from "next";
import { HeroSection }        from "@/components/sections/HeroSection";
import { ProjectsSection }    from "@/components/sections/ProjectsSection";
import { AboutSection }       from "@/components/sections/AboutSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CTASection }         from "@/components/sections/CTASection";
import {
  getFeaturedProjects,
  getFeaturedPosts,
  getProfile,
  FALLBACK_PROFILE,
} from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null) ?? FALLBACK_PROFILE;
  return {
    title: `${profile.name} — ${profile.title}`,
    description: profile.seoDescription,
  };
}

export default async function HomePage() {
  const [projects, posts, profile] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getFeaturedPosts().catch(() => []),
    getProfile().catch(() => null),
  ]);

  const p = profile ?? FALLBACK_PROFILE;

  return (
    <>
      <HeroSection profile={p} />
      <ProjectsSection projects={projects} />
      <AboutSection profile={p} />
      <BlogPreviewSection posts={posts} />
      <CTASection profile={p} />
    </>
  );
}
