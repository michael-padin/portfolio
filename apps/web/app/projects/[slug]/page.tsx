import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import {
  getProjectBySlug,
  getAllProjects,
  getProfile,
  imageUrl,
  projectCover,
  projectGallery,
  projectPhone,
  FALLBACK_PROFILE,
} from "@/lib/sanity";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { ProjectVisual } from "@/components/projects/ProjectCard";
import { BrowserWindow, Stage } from "@/components/projects/ScreenFrame";
import { CtaBand } from "@/components/sections/CtaBand";

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
    projectCover(project, 1200, 630)?.src;
  return pageMetadata({
    title: project.seoTitle ?? project.headline ?? project.title,
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
  const [project, all, profile] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getAllProjects().catch(() => []),
    getProfile().catch(() => FALLBACK_PROFILE),
  ]);
  if (!project) notFound();

  // Width only: screenshots keep their ratio and the frame crops from the top
  const cover = projectCover(project, 2400);
  const coverUrl = cover && new URL(cover.src, siteUrl).toString();
  const phone = projectPhone(project);
  const gallery = projectGallery(project);
  const projectUrl = `${siteUrl}/projects/${project.slug.current}`;
  const heading = project.headline ?? project.title;
  const index = all.findIndex((p) => p.slug.current === project.slug.current);
  const next = all.length > 1 ? all[(index + 1) % all.length] : undefined;

  const facts = [
    project.client && { label: "Client", value: project.client },
    project.role && { label: "My role", value: project.role },
    project.typeLabel && { label: "Type", value: project.typeLabel },
    project.techStack?.length > 0 && { label: "Stack", value: project.techStack.join(" · ") },
  ].filter(Boolean) as { label: string; value: string }[];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: heading,
    description: project.tagline,
    url: projectUrl,
    ...(coverUrl && { image: coverUrl }),
    ...(project.publishedAt && { datePublished: project.publishedAt }),
    ...(project._updatedAt && { dateModified: project._updatedAt }),
    author: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    creator: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    ...(project.techStack?.length > 0 && { keywords: project.techStack.join(", ") }),
    ...(project.typeLabel && { genre: project.typeLabel }),
    ...(project.liveUrl && { sameAs: project.liveUrl }),
  };

  const problem = project.problem ?? project.overview;
  const highlights = project.highlights ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="container-page text-muted hidden pt-10 text-[14px] md:block"
      >
        <Link href="/projects" className="hover:text-ink transition-colors">
          Work
        </Link>{" "}
        / {project.title}
      </nav>

      <header className="container-page grid gap-5 pt-5 pb-8 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-14 md:pt-6 md:pb-12">
        <div>
          <p className="eyebrow">Case study</p>
          <h1 className="mt-3 text-[34px] leading-[1.06] tracking-[-0.02em] md:mt-4 md:text-[60px] md:leading-[1.04]">
            {heading}
          </h1>
        </div>
        <div>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-[14px] md:gap-x-6 md:gap-y-3 md:text-[15px]">
            {facts.map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-muted">{f.label}</dt>
                <dd className="font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-5 flex gap-6 text-[15px]">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-mango"
                >
                  Visit the live site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-mango"
                >
                  Source code
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-3 md:px-14">
        <ProjectVisual
          project={project}
          cover={cover}
          phone={phone}
          variant="hero"
          sizes="(min-width: 1280px) 1168px, 100vw"
          priority
        />
      </div>

      {problem && (
        <section className="container-page grid gap-3 pt-10 md:grid-cols-[1fr_2fr] md:gap-14 md:pt-24">
          <h2 className="text-[26px] leading-[1.1] md:text-[36px]">The problem</h2>
          <p className="max-w-[58ch] text-[16px] leading-[1.6] text-[oklch(32%_0.02_50)] md:text-[20px]">
            {problem}
          </p>
        </section>
      )}

      {(highlights.length > 0 || (project.solution?.length ?? 0) > 0) && (
        <section className="container-page grid gap-3 pt-9 md:grid-cols-[1fr_2fr] md:gap-14 md:pt-24">
          <h2 className="text-[26px] leading-[1.1] md:text-[36px]">What I built</h2>
          {highlights.length > 0 ? (
            <ol className="md:border-ink md:border-t-[1.5px]">
              {highlights.map((h, i) => (
                <li
                  key={h.title}
                  className="border-rule grid grid-cols-[32px_1fr] gap-3 border-t py-4 md:grid-cols-[48px_1fr] md:gap-5 md:border-t-0 md:border-b md:py-6"
                >
                  <span className="font-heading text-mango-deep text-[20px] md:text-[28px]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[16px] font-semibold md:text-[20px]">
                      {h.title}
                    </h3>
                    <p className="text-muted mt-1 max-w-[56ch] text-[14px] leading-normal md:mt-1.5 md:text-[16px] md:leading-[1.55]">
                      {h.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="prose-post">
              <PortableText value={project.solution!} />
            </div>
          )}
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-page pt-9 md:pt-24">
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
            <h2 className="text-[26px] leading-[1.1] md:text-[36px]">Inside the system</h2>
            <p className="text-subtle text-[14px]">
              Shown with example data, not the client&apos;s real records.
            </p>
          </div>
          <div className="mt-5 grid gap-x-6 gap-y-8 md:mt-8 md:grid-cols-2 md:gap-y-12">
            {gallery.map((img, i) => {
              // The first screen gets the full width; the rest pair up below it
              const wide = i === 0 && gallery.length !== 2;
              return (
                <figure key={img.src} className={wide ? "md:col-span-2" : ""}>
                  <a
                    href={img.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open full size: ${img.alt}`}
                    className="group block"
                  >
                    <Stage
                      tone={project.tone}
                      className={`rounded-[16px] md:rounded-[20px] ${wide ? "p-3 sm:p-6 md:px-16 md:pt-14 md:pb-0" : "p-3 sm:p-5 md:p-7"}`}
                    >
                      <BrowserWindow
                        image={img}
                        sizes={
                          wide
                            ? "(min-width: 1280px) 1040px, 100vw"
                            : "(min-width: 768px) 540px, 100vw"
                        }
                        rounded={
                          wide ? "rounded-[10px] md:rounded-t-[14px] md:rounded-b-none" : undefined
                        }
                        className="transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1"
                      />
                    </Stage>
                  </a>
                  {img.caption && (
                    <figcaption className="text-muted mt-3 flex gap-3 text-[14px] leading-normal md:mt-4 md:text-[15px]">
                      <span className="font-heading text-mango-deep tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{img.caption}</span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {project.results && project.results.length > 0 && (
        <section className="container-page grid gap-3 pt-9 md:grid-cols-[1fr_2fr] md:gap-14 md:pt-24">
          <h2 className="text-[26px] leading-[1.1] md:text-[36px]">The result</h2>
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.metric}>
                <dd className="font-heading text-mango-deep text-[36px] leading-none tabular-nums md:text-[44px]">
                  {r.value}
                </dd>
                <dt className="text-muted mt-2 text-[14px]">{r.metric}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {project.localAngle?.text && (
        <section className="mx-auto mt-10 max-w-[1280px] px-3 md:mt-24 md:px-14">
          <div className="bg-ink text-paper grid gap-4 rounded-[24px] px-5 py-8 md:grid-cols-[1fr_2fr] md:gap-14 md:px-14 md:py-12">
            <h2 className="text-[24px] leading-[1.15] md:text-[32px]">
              What this means for a Cebu business
            </h2>
            <div>
              <p className="max-w-[56ch] text-[16px] leading-[1.6] text-[oklch(88%_0.02_70)] md:text-[18px]">
                {project.localAngle.text}
              </p>
              {(project.localAngle.chips?.length ?? 0) > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2 md:mt-6">
                  {project.localAngle.chips!.map((c) => (
                    <li
                      key={c}
                      className="border-dark-rule rounded-full border-[1.5px] px-3.5 py-2 text-[14px] font-semibold"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {next ? (
        <div className="container-page">
          <div className="border-rule mt-10 mb-12 flex items-center justify-between gap-4 border-t pt-7 md:mt-24 md:mb-24">
            <span className="text-muted text-[14px]">Next case study</span>
            <Link
              href={`/projects/${next.slug.current}`}
              className="font-heading text-right text-[22px] transition-colors duration-200 hover:text-[oklch(55%_0.15_55)] md:text-[28px]"
            >
              {next.title}
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-12 md:h-24" />
      )}

      <CtaBand heading="Need something like this for your business?" profile={profile} />
    </>
  );
}
