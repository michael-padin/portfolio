import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, urlFor } from "@/lib/sanity";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
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
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const imageUrl = post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : null;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-main">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-10 transition-colors group"
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
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.tags?.map((tag) => (
              <span key={tag} className="label-tag">
                {tag}
              </span>
            ))}
            {post.readTime && (
              <span className="text-sm text-text-muted font-mono">{post.readTime} min read</span>
            )}
          </div>
          <h1 className="text-display-xl text-text-primary mb-4 leading-tight">{post.title}</h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
              M
            </div>
            <div>
              <div className="text-text-primary text-sm font-medium">Michael Padin</div>
              <div className="text-text-muted text-xs">{formatDate(post.publishedAt)}</div>
            </div>
          </div>
        </div>

        {/* Cover */}
        {imageUrl && (
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-12 border border-surface-border">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Content — rendered from Sanity portable text */}
        <div className="prose-portfolio">
          {/* When post.content (Portable Text) is available, render it here with @portabletext/react */}
          {/* For now show excerpt as placeholder */}
          <p className="text-text-muted italic border border-surface-border rounded-lg p-6 text-sm">
            📝 Full post content renders here from Sanity Portable Text via{" "}
            <code>@portabletext/react</code>. Add content in Sanity Studio at{" "}
            <strong>studio.yourdomain.com</strong>.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-10 border-t border-surface-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-text-primary font-medium mb-1">Found this useful?</p>
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
