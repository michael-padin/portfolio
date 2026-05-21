import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug, getAllProjects, imageUrl } from "@/lib/sanity";
import { features } from "@/lib/features";
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

  const coverUrl = imageUrl(project.coverImage, 1600, 900);
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

  const sections: { num: string; title: string; body: React.ReactNode }[] = [];
  if (project.overview)
    sections.push({
      num: "§01",
      title: "Overview",
      body: (
        <p className="font-spec text-ink-2 text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6]">
          {project.overview}
        </p>
      ),
    });
  if (project.problem)
    sections.push({
      num: "§02",
      title: "Problem",
      body: (
        <p className="font-spec text-ink-2 text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6]">
          {project.problem}
        </p>
      ),
    });
  if (project.solution && project.solution.length > 0)
    sections.push({
      num: `§0${sections.length + 1}`,
      title: "Solution",
      body: (
        <div className="prose-paper">
          <PortableText value={project.solution} />
        </div>
      ),
    });

  return (
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip — mobile collapsed, sm+ full */}
        <div className="border-paper-rule border-b pb-3">
          <div className="font-spec-mono text-ink-3 flex items-center gap-2 text-[11px] tracking-[0.04em] uppercase sm:hidden">
            <span>§</span>
            <span className="text-ink normal-case">Project</span>
            <span aria-hidden>·</span>
            <span className="text-ink normal-case truncate">{project.title}</span>
            <span
              aria-hidden
              className="bg-signal ml-auto inline-block size-1.5 shrink-0 rounded-full"
            />
          </div>
          <dl className="font-spec-mono text-ink-3 hidden text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">Project</Field>
            <Field label="Subject">{project.title}</Field>
            {project.category && <Field label="Category">{project.category}</Field>}
            <Field label="Status">
              <span className="text-signal">
                <span
                  aria-hidden
                  className="bg-signal mr-1.5 inline-block size-[6px] -translate-y-px rounded-full"
                />
                shipped
              </span>
            </Field>
          </dl>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/projects"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← All projects
          </Link>
        </div>

        {/* Title block */}
        <div className="mt-[clamp(2rem,4vw,3.5rem)]">
          <h1 className="font-spec text-ink max-w-[18ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            {project.title}
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.55]">
            {project.tagline}
          </p>
        </div>

        {/* Spec strip: stack + links */}
        <div className="border-paper-rule mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-12 gap-x-4 gap-y-2 border-t border-b py-5">
          {project.techStack?.length > 0 && (
            <>
              <dt className="font-spec-mono text-ink-3 col-span-12 text-[11px] tracking-[0.04em] uppercase md:col-span-2">
                Stack
              </dt>
              <dd className="font-spec text-ink-2 col-span-12 text-[14px] leading-[1.55] md:col-span-7">
                {project.techStack.join(" · ")}
              </dd>
            </>
          )}
          <dd className="font-spec text-ink-2 col-span-12 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[14px] md:col-span-3 md:justify-end md:text-right">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-px font-medium transition-colors"
              >
                Live site ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-signal border-ink-3 hover:border-signal border-b pb-px transition-colors"
              >
                Source ↗
              </a>
            )}
          </dd>
        </div>

        {/* Cover image */}
        {coverUrl && (
          <div className="border-paper-rule bg-paper-tint relative mt-[clamp(2rem,4vw,3rem)] aspect-[16/9] overflow-hidden border">
            <Image
              src={coverUrl}
              alt={project.coverImage?.alt ?? `${project.title} — ${project.tagline}`}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Case study sections */}
        {sections.length > 0 && (
          <div className="mt-[clamp(3rem,5vw,5rem)] grid grid-cols-12 gap-x-6 gap-y-12">
            {sections.map((s) => (
              <section key={s.num} className="col-span-12">
                <header className="border-paper-rule mb-5 flex items-end justify-between border-b pb-3">
                  <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
                    {s.title}
                  </h2>
                  <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
                    {s.num}
                  </span>
                </header>
                {s.body}
              </section>
            ))}
          </div>
        )}

        {/* Results */}
        {project.results && project.results.length > 0 && (
          <section className="mt-[clamp(3rem,5vw,5rem)]">
            <header className="border-paper-rule mb-3 flex items-end justify-between border-b pb-3">
              <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
                Results
              </h2>
              <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
                §0{sections.length + 1} · Measured impact
              </span>
            </header>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {project.results.map((r) => (
                <div key={r.metric}>
                  <dt className="font-spec-mono text-ink-3 mb-1 text-[11px] tracking-[0.04em] uppercase">
                    {r.metric}
                  </dt>
                  <dd className="font-spec text-signal text-[clamp(2rem,3.5vw,2.75rem)] leading-[1] font-medium tracking-[-0.025em] tabular-nums">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Footer CTA */}
        <div className="border-paper-rule mt-[clamp(5rem,8vw,7rem)] flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-baseline">
          <div>
            <p className="font-spec text-ink text-[clamp(1.125rem,1.5vw,1.375rem)] font-medium tracking-[-0.015em]">
              Building something similar?
            </p>
            <p className="font-spec text-ink-2 mt-1 text-[14px]">
              I take on full stack development work from Cebu, Philippines.
            </p>
          </div>
          {features.contact ? (
            <Link
              href="/contact"
              className="text-ink hover:text-signal border-ink hover:border-signal font-spec border-b pb-px text-[15px] font-medium transition-colors"
            >
              Start a conversation →
            </Link>
          ) : (
            <Link
              href="/projects"
              className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
            >
              ← Back to projects
            </Link>
          )}
        </div>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(2rem,3vw,3rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            End of document
          </span>
          {project._updatedAt && (
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase tabular-nums">
              Updated{" "}
              {new Date(project._updatedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-ink-3 select-none">{label}</dt>
      <dd className="text-ink font-normal normal-case">{children}</dd>
    </div>
  );
}
