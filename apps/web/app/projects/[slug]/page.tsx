import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug, getAllProjects, imageUrl } from "@/lib/sanity";
import { pageMetadata, siteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) {
    return { title: "Project Not Found", robots: { index: false, follow: false } };
  }
  const ogImg =
    (project.ogImage && imageUrl(project.ogImage, 1200, 630)) ??
    imageUrl(project.coverImage, 1200, 630);
  return pageMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.tagline,
    path: `/projects/${project.slug.current}`,
    image: ogImg,
    imageAlt: project.coverImage?.alt ?? project.title,
    type: "article",
    publishedTime: project.publishedAt,
    modifiedTime: project._updatedAt,
    tags: project.techStack,
  });
}

export async function generateStaticParams() {
  const projects = await getAllProjects().catch(() => []);
  return projects.map((p) => ({ slug: p.slug.current }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const coverUrl = imageUrl(project.coverImage, 1200, 630);
  const projectUrl = `${siteUrl}/projects/${project.slug.current}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.tagline,
    url: projectUrl,
    ...(coverUrl && { image: coverUrl }),
    ...(project.publishedAt && { datePublished: project.publishedAt }),
    ...(project._updatedAt && { dateModified: project._updatedAt }),
    author: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    creator: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    ...(project.techStack &&
      project.techStack.length > 0 && {
        keywords: project.techStack.join(", "),
      }),
    ...(project.category && { genre: project.category }),
    ...(project.liveUrl && { sameAs: project.liveUrl }),
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }}
      />
      <div className="container-main">
        {/* Back */}
        <Link
          href="/projects"
          className="text-text-muted hover:text-accent group mb-10 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path
              d="M13 7H1M6 2L1 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          {project.category && (
            <span className="label-tag mb-4 inline-flex">{project.category}</span>
          )}
          <h1 className="text-display-xl text-text-primary mb-4">{project.title}</h1>
          <p className="text-text-secondary max-w-2xl text-xl leading-relaxed">{project.tagline}</p>
        </div>

        {/* Links */}
        <div className="mb-10 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              View live site
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 11L11 1M11 1H4M11 1v7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View source
            </a>
          )}
        </div>

        {/* Cover image */}
        {coverUrl && (
          <div className="border-surface-border relative mb-12 h-64 overflow-hidden rounded-xl border sm:h-96">
            <Image
              src={coverUrl}
              alt={project.coverImage?.alt ?? `${project.title} — ${project.tagline}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div className="card mb-8 p-6">
            <h2 className="text-text-muted mb-4 font-mono text-xs tracking-widest uppercase">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-accent-subtle text-accent border-accent/20 rounded-lg border px-3 py-1.5 font-mono text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Case study content */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {project.overview && (
            <div className="card p-6">
              <h2 className="text-text-muted mb-3 font-mono text-xs tracking-widest uppercase">
                Overview
              </h2>
              <p className="text-text-secondary leading-relaxed">{project.overview}</p>
            </div>
          )}
          {project.problem && (
            <div className="card p-6">
              <h2 className="text-text-muted mb-3 font-mono text-xs tracking-widest uppercase">
                The Problem
              </h2>
              <p className="text-text-secondary leading-relaxed">{project.problem}</p>
            </div>
          )}
        </div>

        {/* Solution */}
        {project.solution && project.solution.length > 0 && (
          <div className="card mb-8 p-6">
            <h2 className="text-text-muted mb-4 font-mono text-xs tracking-widest uppercase">
              The Solution
            </h2>
            <div className="prose-portfolio">
              <PortableText value={project.solution} />
            </div>
          </div>
        )}

        {/* Results */}
        {project.results && project.results.length > 0 && (
          <div className="card mb-10 p-6">
            <h2 className="text-text-muted mb-6 font-mono text-xs tracking-widest uppercase">
              Results & Impact
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {project.results.map((r) => (
                <div key={r.metric}>
                  <div className="font-display text-accent mb-1 text-3xl">{r.value}</div>
                  <div className="text-text-muted text-sm">{r.metric}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="border-surface-border flex flex-col items-start justify-between gap-4 border-t pt-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-text-primary mb-1 font-medium">Interested in working together?</p>
            <p className="text-text-muted text-sm">
              I build things like this for clients worldwide.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">
            Start a project →
          </Link>
        </div>
      </div>
    </div>
  );
}
