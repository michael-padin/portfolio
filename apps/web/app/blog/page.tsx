import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, type Post } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description:
    "Technical writing on React, Next.js, Node.js, monorepo architecture, and full-stack engineering — by Michael Padin.",
  path: "/blog",
});

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  if (!features.blog) notFound();
  const posts = await getAllPosts().catch(() => [] as Post[]);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Michael Padin — Writing",
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
    <main className="pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
        />
      )}
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        {/* Document metadata strip */}
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] tracking-[0.04em] uppercase sm:flex sm:flex-wrap sm:items-center sm:gap-x-8">
            <Field label="Document">Writing</Field>
            <Field label="Author">Michael Padin</Field>
            <Field label="Entries">
              <span className="tabular-nums">{posts.length || "—"}</span>
            </Field>
            <Field label="Subject">Engineering notes</Field>
          </dl>
        </div>

        {/* Title */}
        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <h1 className="font-spec text-ink max-w-[20ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            Notes from production.
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
            Architecture decisions, problem walkthroughs, and tool comparisons. The kind of posts I
            wish existed when I was debugging at 2am.
          </p>
        </div>

        {/* Index */}
        <section className="mt-[clamp(4rem,6vw,5rem)]">
          <header className="border-paper-rule mb-3 flex items-end justify-between border-b pb-3">
            <h2 className="font-spec text-ink text-[clamp(1.5rem,2vw,2rem)] font-medium tracking-[-0.02em]">
              Index
            </h2>
            <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
              §01 · Reverse chronological
            </span>
          </header>

          {posts.length === 0 ? (
            <PostsPlaceholder formatDate={formatDate} />
          ) : (
            <ol>
              {posts.map((post, i) => (
                <PostRow key={post._id} post={post} index={i} formatDate={formatDate} />
              ))}
            </ol>
          )}
        </section>

        {/* Document footer */}
        <div className="border-paper-rule mt-[clamp(4rem,6vw,6rem)] flex items-baseline justify-between border-t pt-4">
          <span className="font-spec-mono text-ink-3 text-[11px] tracking-[0.04em] uppercase">
            {posts.length > 0
              ? `End of catalog · ${posts.length} ${posts.length === 1 ? "entry" : "entries"}`
              : "Catalog forthcoming"}
          </span>
          <Link
            href="/"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← Back to /
          </Link>
        </div>
      </div>
    </main>
  );
}

function PostRow({
  post,
  index,
  formatDate,
}: {
  post: Post;
  index: number;
  formatDate: (iso?: string) => string;
}) {
  return (
    <li className="border-paper-rule border-b">
      <Link
        href={`/blog/${post.slug.current}`}
        className="group hover:bg-paper-tint grid grid-cols-12 gap-x-4 gap-y-2 py-6 transition-colors"
      >
        <span className="text-ink-3 group-hover:text-signal font-spec-mono col-span-2 pl-2 text-[13px] tabular-nums transition-colors sm:col-span-1">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="col-span-10 sm:col-span-11">
          <div className="font-spec-mono text-ink-3 mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[11px] tracking-[0.04em] uppercase">
            <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
            {post.readTime && (
              <span>
                · <span className="tabular-nums">{post.readTime}</span> min
              </span>
            )}
            {post.tags && post.tags.length > 0 && (
              <span className="text-ink-2 tracking-normal normal-case">
                {post.tags.slice(0, 3).join(" · ")}
              </span>
            )}
          </div>
          <h3 className="font-spec text-ink group-hover:text-signal mt-1 text-[clamp(1.125rem,1.6vw,1.5rem)] leading-snug font-medium tracking-[-0.015em] transition-colors">
            {post.title}
          </h3>
          <p className="font-spec text-ink-2 mt-2 max-w-[65ch] text-[14px] leading-[1.55]">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </li>
  );
}

function PostsPlaceholder({ formatDate }: { formatDate: (iso?: string) => string }) {
  void formatDate;
  return (
    <div className="border-paper-rule border-b py-12">
      <p className="font-spec text-ink-2 max-w-[55ch] text-[14px] leading-[1.55]">
        No posts published yet. Drafts in progress; first entry forthcoming.
      </p>
      <p className="font-spec-mono text-ink-3 mt-3 text-[11px] tracking-[0.04em] uppercase">
        Curious about the planned topics? Write to me at{" "}
        <a
          href="mailto:hello@michaelpadin.com"
          className="text-ink hover:text-signal border-ink hover:border-signal border-b pb-px transition-colors"
        >
          hello@michaelpadin.com
        </a>
        .
      </p>
    </div>
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
