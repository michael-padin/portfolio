import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllPosts, imageUrl } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata, siteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) {
    return { title: "Post Not Found", robots: { index: false, follow: false } };
  }
  const ogImg =
    (post.ogImage && imageUrl(post.ogImage, 1200, 630)) ?? imageUrl(post.coverImage, 1200, 630);
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug.current}`,
    image: ogImg,
    imageAlt: post.coverImage?.alt ?? post.title,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
    tags: post.tags,
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug.current }));
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  if (!features.blog) notFound();
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const coverUrl = imageUrl(post.coverImage, 1600, 900);
  const postUrl = `${siteUrl}/blog/${post.slug.current}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    ...(coverUrl && { image: coverUrl }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post._updatedAt && { dateModified: post._updatedAt }),
    author: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    publisher: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    ...(post.readTime && { timeRequired: `PT${post.readTime}M` }),
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    inLanguage: "en-US",
  };

  return (
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip — mobile collapsed, sm+ full */}
        <div className="border-paper-rule border-b pb-3">
          <div className="font-spec-mono text-ink-3 flex items-center gap-2 text-[11px] tracking-[0.04em] uppercase sm:hidden">
            <span>§</span>
            <span className="text-ink normal-case">Post</span>
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <span className="text-ink tabular-nums">{formatDate(post.publishedAt)}</span>
              </>
            )}
            {post.readTime && (
              <span className="ml-auto">
                <span className="tabular-nums">{post.readTime}</span> min
              </span>
            )}
          </div>
          <dl className="font-spec-mono text-ink-3 hidden text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">Post</Field>
            <Field label="Author">Michael Padin</Field>
            {post.publishedAt && (
              <Field label="Published">
                <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
              </Field>
            )}
            {post.readTime && (
              <Field label="Read">
                <span className="tabular-nums">{post.readTime}</span> min
              </Field>
            )}
          </dl>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/blog"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← All writing
          </Link>
        </div>

        {/* Title block */}
        <div className="mt-[clamp(2rem,4vw,3.5rem)]">
          {post.tags && post.tags.length > 0 && (
            <div className="font-spec-mono text-ink-3 mb-4 flex flex-wrap gap-x-3 text-[11px] tracking-[0.04em] uppercase">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <h1 className="font-spec text-ink max-w-[24ch] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="font-spec text-ink-2 mt-6 text-[clamp(1.0625rem,1.3vw,1.1875rem)] leading-[1.55]">
            {post.excerpt}
          </p>
        </div>

        {/* Cover image */}
        {coverUrl && (
          <div className="border-paper-rule bg-paper-tint relative mt-[clamp(2.5rem,4vw,3.5rem)] aspect-[16/9] overflow-hidden border">
            <Image
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article className="mt-[clamp(3rem,5vw,5rem)]">
          <div className="prose-paper">
            {post.content && post.content.length > 0 ? (
              <PortableText value={post.content} />
            ) : (
              <p className="text-ink-3">{post.excerpt}</p>
            )}
          </div>
        </article>

        {/* Footer CTA */}
        <div className="border-paper-rule mt-[clamp(5rem,8vw,7rem)] flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-baseline">
          <div>
            <p className="font-spec text-ink text-[clamp(1.125rem,1.5vw,1.375rem)] font-medium tracking-[-0.015em]">
              Found this useful?
            </p>
            <p className="font-spec text-ink-2 mt-1 text-[14px]">
              Reply, ask a question, or share what you're working on.
            </p>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[14px]">
            {features.contact && (
              <Link
                href="/contact"
                className="text-ink hover:text-signal border-ink hover:border-signal font-spec border-b pb-px font-medium transition-colors"
              >
                Write
              </Link>
            )}
            <Link
              href="/blog"
              className="text-ink-2 hover:text-signal border-ink-3 hover:border-signal font-spec border-b pb-px transition-colors"
            >
              More posts
            </Link>
          </div>
        </div>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(2rem,3vw,3rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            End of post · {post.title}
          </span>
          {post._updatedAt && (
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase tabular-nums">
              Updated{" "}
              {new Date(post._updatedAt).toLocaleDateString("en-US", {
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
