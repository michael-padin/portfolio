"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageSlot } from "@/components/ui/ImageSlot";

export type BlogItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readTime?: number;
  coverUrl: string | null;
  coverAlt?: string;
};

function meta(p: BlogItem) {
  return [p.category, p.readTime && `${p.readTime} min read`].filter(Boolean).join(" · ");
}

export function BlogIndex({ posts }: { posts: BlogItem[] }) {
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? posts.filter((p) => p.category === filter) : posts;
  const [featured, ...rest] = shown;
  const side = rest.slice(0, 3);
  const more = rest.slice(3);

  return (
    <>
      {categories.length > 1 && (
        <div className="container-page pb-6 md:pb-8">
          <div role="group" aria-label="Filter posts" className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
              className="chip px-4"
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className="chip px-4"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {featured && (
        <div className="container-page grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <Link href={`/blog/${featured.slug}`} className="group flex flex-col gap-3.5">
            <div className="bg-tint relative aspect-[4/3] overflow-hidden rounded-[20px]">
              {featured.coverUrl ? (
                <Image
                  src={featured.coverUrl}
                  alt={featured.coverAlt ?? ""}
                  fill
                  sizes="(min-width: 768px) 660px, 100vw"
                  className="object-cover"
                />
              ) : (
                <ImageSlot />
              )}
            </div>
            <span className="text-eyebrow text-[13px] font-semibold">{meta(featured)}</span>
            <h2 className="text-[30px] leading-[1.08] tracking-[-0.015em] transition-colors duration-200 group-hover:text-[oklch(55%_0.15_55)] md:text-[40px]">
              {featured.title}
            </h2>
            <p className="text-muted max-w-[50ch] text-[16px] leading-[1.55] md:text-[17px]">
              {featured.excerpt}
            </p>
          </Link>
          {side.length > 0 && (
            <ul>
              {side.map((p) => (
                <li key={p.id}>
                  <PostRow post={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {more.length > 0 && (
        <ul className="container-page mt-12 grid gap-x-8 md:grid-cols-2">
          {more.map((p) => (
            <li key={p.id}>
              <PostRow post={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PostRow({ post }: { post: BlogItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border-rule flex flex-col gap-2 border-t py-6 transition-[padding] duration-200 hover:pl-2"
    >
      <span className="text-eyebrow text-[13px] font-semibold">{meta(post)}</span>
      <h3 className="text-[22px] leading-[1.15] md:text-[26px]">{post.title}</h3>
      <p className="text-muted text-[15px] leading-normal">{post.excerpt}</p>
    </Link>
  );
}
