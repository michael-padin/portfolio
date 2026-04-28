import Link from "next/link";
import type { SanityPost } from "@/lib/sanity";

interface Props {
  posts: SanityPost[];
}

const DEMO_POSTS: SanityPost[] = [
  {
    _id: "1",
    title: "How I migrated 5 Next.js apps to TanStack in a Turborepo monorepo",
    slug: { current: "nextjs-to-tanstack-migration" },
    excerpt:
      "A deep dive into the architectural decisions, tooling challenges, and performance wins from migrating a large monorepo away from Next.js for internal tooling.",
    tags: ["TanStack", "Turborepo", "Next.js", "Migration"],
    readTime: 8,
    publishedAt: "2025-12-01",
    featured: true,
  },
  {
    _id: "2",
    title: "Building a secure AI chatbot for your portfolio with Claude API + Cloudflare Workers",
    slug: { current: "ai-chatbot-portfolio-claude-cloudflare" },
    excerpt:
      "Step-by-step guide to deploying a cost-controlled, prompt-injection-resistant AI chatbot that answers questions about you — for about $1/month.",
    tags: ["Claude API", "Cloudflare Workers", "AI", "Security"],
    readTime: 12,
    publishedAt: "2025-11-15",
    featured: true,
  },
  {
    _id: "3",
    title: "Scaling BullMQ job queues for real estate image processing at volume",
    slug: { current: "bullmq-image-processing-scale" },
    excerpt:
      "What I learned running thousands of image processing jobs through BullMQ with AWS S3, retry strategies, and progress tracking via Socket.io.",
    tags: ["BullMQ", "Node.js", "AWS S3", "Performance"],
    readTime: 10,
    publishedAt: "2025-10-20",
    featured: false,
  },
];

export function BlogPreviewSection({ posts }: Props) {
  const displayPosts = posts.length > 0 ? posts : DEMO_POSTS;

  return (
    <section id="blog" className="py-24">
      <div className="container-custom">
        <div className="mb-12">
          <div className="label-tag mb-4">Writing</div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-display text-display-lg text-text-primary max-w-lg">
              Thoughts on <span className="text-accent italic">shipping</span> software
            </h2>
            <Link href="/blog" className="btn-ghost shrink-0 self-start text-sm sm:self-auto">
              All posts →
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayPosts.slice(0, 3).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: SanityPost }) {
  const slug = typeof post.slug === "string" ? post.slug : post.slug?.current;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="card group hover:border-accent/30 flex flex-col gap-4 p-6"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(post.tags ?? []).slice(0, 3).map((tag) => (
          <span key={tag} className="tech-badge text-2xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="font-display text-text-primary group-hover:text-accent text-lg leading-tight transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-text-secondary flex-1 text-sm leading-relaxed">{post.excerpt}</p>

      {/* Meta */}
      <div className="text-text-muted flex items-center justify-between font-mono text-xs">
        {date && <span>{date}</span>}
        {post.readTime && <span>{post.readTime} min read</span>}
      </div>
    </Link>
  );
}
