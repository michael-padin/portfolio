import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CTASection } from "@/components/sections/CTASection";
import { getFeaturedProjects, getProfile, imageUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const ogImg = profile.ogImage ? imageUrl(profile.ogImage, 1200, 630) : null;
  return pageMetadata({
    title: `${profile.name} — ${profile.title}`,
    description: profile.seoDescription,
    path: "/",
    image: ogImg,
    imageAlt: `${profile.name} — ${profile.title}`,
  });
}

export default async function HomePage() {
  const [projects, profile] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getProfile().catch(() => null),
  ]);

  const p = profile ?? FALLBACK_PROFILE;

  return (
    <>
      <HeroSection profile={p} />
      <ProjectsSection projects={projects} />
      <AboutSection profile={p} />
      <CTASection profile={p} />
    </>
  );
}
