"use client";
import { useState } from "react";
import type { Project, ProjectKind, StaticImage } from "@/lib/sanity";
import { ProjectCard } from "./ProjectCard";

export type GridItem = { project: Project; cover: StaticImage | null; tag: string };

const FILTERS: { value: ProjectKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "booking", label: "Booking" },
  { value: "web-app", label: "Web apps" },
  { value: "website", label: "Websites" },
];

export function ProjectGrid({ items }: { items: GridItem[] }) {
  const [filter, setFilter] = useState<ProjectKind | "all">("all");
  const available = FILTERS.filter(
    (f) => f.value === "all" || items.some((i) => i.project.kind === f.value),
  );
  const shown = filter === "all" ? items : items.filter((i) => i.project.kind === filter);

  return (
    <>
      {available.length > 2 && (
        <div className="container-page pb-6 md:pb-8">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {available.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className="chip px-4"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="container-page grid gap-x-8 gap-y-10 pb-12 md:grid-cols-2 md:gap-y-14 md:pb-24">
        {shown.map((i) => (
          <ProjectCard
            key={i.project._id}
            project={i.project}
            cover={i.cover}
            tag={i.tag}
            showStack
          />
        ))}
      </div>
    </>
  );
}
