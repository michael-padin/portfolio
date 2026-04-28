import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, imageUrl, type Post } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Technical writing on React, Next.js, Node.js, monorepo architecture, and full-stack engineering — by Michael Padin.",
  path: "/blog",
});

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  if (!features.blog) notFound();
  const posts = await getAllPosts().catch(() => [] as Post[]);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Michael Padin — Blog",
    url: `${siteUrl}/blog`,
    description:
      "Technical writing on React, Next.js, Node.js, monorepo architecture, and full-stack engineering.",
    author: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteUrl}/blog/${p.slug.current}`,
      datePublished: p.publishedAt,
      ...(p._updatedAt && { dateModified: p._updatedAt }),
      author: { "@type": "Person", name: "Michael Padin", url: siteUrl },
    })),
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
        />
      )}
      <div className="container-custom mb-16">
        <div className="label-tag mb-5">
          <span className="bg-accent h-1.5 w-1.5 rounded-full" />
          Writing
        </div>
        <h1 className="text-display-xl text-text-primary mb-4">
          Thoughts & <span className="text-gradient italic">Deep Dives</span>
        </h1>
        <p className="text-text-secondary max-w-xl text-lg">
          Architecture decisions, problem-solving walkthroughs, and tool comparisons — the kind of
          posts I wish existed when I was debugging at 2am.
        </p>
      </div>

      <div className="container-custom">
        {posts.length === 0 ? (
          <BlogPlaceholder />
        ) : (
          <div className="grid max-w-3xl gap-6">
            {posts.map((post, i) => (
              <PostRow key={post._id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostRow({ post, index }: { post: Post; index: number }) {
  const coverUrl = imageUrl(post.coverImage, 320, 200);

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="card card-hover group animate-fade-up animate-hidden flex gap-6 p-6"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {coverUrl && (
        <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:block">
          <Image
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-2xs bg-accent-subtle text-accent border-accent/20 rounded border px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
          {post.readTime && (
            <span className="text-2xs text-text-muted font-mono">{post.readTime} min read</span>
          )}
        </div>
        <h2 className="font-display text-text-primary group-hover:text-accent mb-2 line-clamp-2 text-xl transition-colors">
          {post.title}
        </h2>
        <p className="text-text-muted mb-3 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
        <span className="text-text-muted font-mono text-xs">{formatDate(post.publishedAt)}</span>
      </div>
    </Link>
  );
}

function BlogPlaceholder() {
  const placeholders = [
    {
      title: "Why I Moved Our Monorepo from Next.js to TanStack — and What I Learned",
      tags: ["Architecture", "TanStack"],
      mins: 8,
      excerpt:
        "At Image Edits we had 5 apps in a Turborepo monorepo. Here's the full story of migrating away from Next.js for internal tooling and what surprised us.",
    },
    {
      title: "BullMQ + AWS S3: Building a Reliable Bulk Image Processing Pipeline",
      tags: ["Node.js", "AWS"],
      mins: 12,
      excerpt:
        "How we handle thousands of photographer uploads, dynamic watermarking, and zipping raw files without losing a single job.",
    },
    {
      title: "From Word-of-Mouth to 10 Online Leads: Building JimDaisy.com",
      tags: ["Freelance", "SEO"],
      mins: 6,
      excerpt:
        "A California client had two student housing properties and zero web presence. Next.js + Cloudflare Workers + Zoho Mail later, inquiries were coming in within 2 weeks.",
    },
    {
      title: "Socket.io in a Turborepo: Lessons from Building Real-Time Chat at Scale",
      tags: ["Socket.io", "Architecture"],
      mins: 10,
      excerpt:
        "Structuring a dedicated Socket.io service alongside your API in a pnpm monorepo, and why we didn't just use Server-Sent Events.",
    },
  ];

  return (
    <div className="grid max-w-3xl gap-6">
      {placeholders.map((p, i) => (
        <div
          key={p.title}
          className="card animate-fade-up animate-hidden p-6"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="mb-2 flex items-center gap-3">
            {p.tags.map((t) => (
              <span
                key={t}
                className="text-2xs bg-accent-subtle text-accent border-accent/20 rounded border px-2 py-0.5"
              >
                {t}
              </span>
            ))}
            <span className="text-2xs text-text-muted font-mono">{p.mins} min read</span>
          </div>
          <h2 className="font-display text-text-primary mb-2 text-xl">{p.title}</h2>
          <p className="text-text-muted mb-3 text-sm leading-relaxed">{p.excerpt}</p>
          <span className="text-text-muted text-xs italic">Coming soon — add in Sanity Studio</span>
        </div>
      ))}
    </div>
  );
}
