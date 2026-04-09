import Link from "next/link";
import type { Post } from "@/lib/sanity";

export function PostCard({ post }: { post: Post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="card card-accent flex flex-col p-5 gap-4 group"
    >
      <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
        {date && <span>{date}</span>}
        {post.readTime && <span>· {post.readTime} min read</span>}
      </div>

      <div className="flex-1">
        <h3 className="font-display text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="tech-badge">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-[var(--accent)] font-mono group-hover:translate-x-1 transition-transform">
          Read →
        </span>
      </div>
    </Link>
  );
}
