import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { StillRunning } from "@/components/sections/home/StillRunning";
import { Services } from "@/components/sections/home/Services";
import { SystemsBuilt } from "@/components/sections/home/SystemsBuilt";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { AboutTeaser } from "@/components/sections/home/AboutTeaser";
import { FoundingOffer } from "@/components/sections/FoundingOffer";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  getFeaturedProjects,
  getProfile,
  imageUrl,
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
} from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => FALLBACK_PROFILE);
  const ogImg = profile.ogImage ? imageUrl(profile.ogImage, 1200, 630) : null;
  return pageMetadata({
    title: `${profile.name}: ${profile.heroTagline}`,
    description: profile.seoDescription,
    path: "/",
    image: ogImg,
    imageAlt: `${profile.name}: ${profile.heroTagline}`,
  });
}

export default async function HomePage() {
  const [projects, profile] = await Promise.all([
    getFeaturedProjects().catch(() => FALLBACK_PROJECTS.filter((p) => p.featured)),
    getProfile().catch(() => FALLBACK_PROFILE),
  ]);

  return (
    <>
      <Hero profile={profile} />
      <StillRunning pains={profile.pains} />
      <Services profile={profile} />
      <SystemsBuilt projects={projects} />
      <FoundingOffer profile={profile} />
      <HowItWorks steps={profile.steps} />
      <AboutTeaser profile={profile} />
      <CtaBand heading="Show me how your business runs today." profile={profile} />
    </>
  );
}
