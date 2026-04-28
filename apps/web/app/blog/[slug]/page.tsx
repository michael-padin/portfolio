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

  const coverUrl = imageUrl(post.coverImage, 1200, 630);
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
    <div className="min-h-screen pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <div className="container-main">
        {/* Back */}
        <Link
          href="/blog"
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
          All posts
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {post.tags?.map((tag) => (
              <span key={tag} className="label-tag">
                {tag}
              </span>
            ))}
            {post.readTime && (
              <span className="text-text-muted font-mono text-sm">{post.readTime} min read</span>
            )}
          </div>
          <h1 className="text-display-xl text-text-primary mb-4 leading-tight">{post.title}</h1>
          <p className="text-text-secondary mb-6 text-lg leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="bg-accent/20 text-accent flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              M
            </div>
            <div>
              <div className="text-text-primary text-sm font-medium">Michael Padin</div>
              <div className="text-text-muted text-xs">{formatDate(post.publishedAt)}</div>
            </div>
          </div>
        </div>

        {/* Cover */}
        {coverUrl && (
          <div className="border-surface-border relative mb-12 h-64 overflow-hidden rounded-xl border sm:h-80">
            <Image
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-portfolio">
          {post.content && post.content.length > 0 ? (
            <PortableText value={post.content} />
          ) : (
            <p className="text-text-muted italic">{post.excerpt}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-surface-border mt-16 border-t pt-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-text-primary mb-1 font-medium">Found this useful?</p>
              <p className="text-text-muted text-sm">
                Reach out — I'm always happy to discuss further.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                Work with me
              </Link>
              <Link href="/blog" className="btn-ghost text-sm">
                More posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
