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
  projectCover,
  projectPhone,
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

  // The hero collage shows systems, not marketing sites
  const systems = projects.filter((p) => p.kind !== "website");
  const shots = systems
    .map((p) => {
      const image = projectCover(p, 1440);
      return image && { href: `/projects/${p.slug.current}`, label: p.title, tone: p.tone, image };
    })
    .filter((s) => s !== null);
  const phone = systems.map(projectPhone).find(Boolean) ?? null;

  return (
    <>
      <Hero profile={profile} shots={shots} phone={phone} />
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
