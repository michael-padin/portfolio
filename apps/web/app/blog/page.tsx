import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, imageUrl, type Post } from "@/lib/sanity";
import { features } from "@/lib/features";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing on React, Next.js, Node.js, system design, and full-stack development from Michael Padin.",
};

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

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-custom mb-16">
        <div className="label-tag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Writing
        </div>
        <h1 className="text-display-xl text-text-primary mb-4">
          Thoughts & <span className="text-gradient italic">Deep Dives</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl">
          Architecture decisions, problem-solving walkthroughs, and tool comparisons — the kind of
          posts I wish existed when I was debugging at 2am.
        </p>
      </div>

      <div className="container-custom">
        {posts.length === 0 ? (
          <BlogPlaceholder />
        ) : (
          <div className="grid gap-6 max-w-3xl">
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
      className="card card-hover group flex gap-6 p-6 animate-fade-up animate-hidden"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {coverUrl && (
        <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-2xs px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/20"
            >
              {tag}
            </span>
          ))}
          {post.readTime && (
            <span className="text-2xs text-text-muted font-mono">{post.readTime} min read</span>
          )}
        </div>
        <h2 className="font-display text-xl text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
        <span className="text-xs text-text-muted font-mono">{formatDate(post.publishedAt)}</span>
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
    <div className="grid gap-6 max-w-3xl">
      {placeholders.map((p, i) => (
        <div
          key={p.title}
          className="card p-6 animate-fade-up animate-hidden"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="flex items-center gap-3 mb-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="text-2xs px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/20"
              >
                {t}
              </span>
            ))}
            <span className="text-2xs text-text-muted font-mono">{p.mins} min read</span>
          </div>
          <h2 className="font-display text-xl text-text-primary mb-2">{p.title}</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-3">{p.excerpt}</p>
          <span className="text-xs text-text-muted italic">Coming soon — add in Sanity Studio</span>
        </div>
      ))}
    </div>
  );
}
