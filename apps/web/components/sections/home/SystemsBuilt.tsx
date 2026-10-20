import Link from "next/link";
import { imageUrl, projectTag, type Project } from "@/lib/sanity";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function SystemsBuilt({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="container-page pb-11 md:pb-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="eyebrow">Systems I&apos;ve built</h2>
        <Link href="/projects" className="link-mango text-[14px] md:text-[15px]">
          See all work
        </Link>
      </div>
      <div className="mt-5 grid gap-x-8 gap-y-10 md:mt-6 md:grid-cols-2 md:gap-y-14">
        {projects.map((p) => (
          <ProjectCard
            key={p._id}
            project={p}
            coverUrl={imageUrl(p.coverImage, 1200, 750)}
            tag={projectTag(p)}
          />
        ))}
      </div>
    </section>
  );
}
