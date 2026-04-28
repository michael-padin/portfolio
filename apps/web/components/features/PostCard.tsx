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
      className="card card-accent group flex flex-col gap-4 p-5"
    >
      <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
        {date && <span>{date}</span>}
        {post.readTime && <span>· {post.readTime} min read</span>}
      </div>

      <div className="flex-1">
        <h3 className="font-display mb-2 text-base leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="tech-badge">
              {tag}
            </span>
          ))}
        </div>
        <span className="font-mono text-xs text-[var(--accent)] transition-transform group-hover:translate-x-1">
          Read →
        </span>
      </div>
    </Link>
  );
}
