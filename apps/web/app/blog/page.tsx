import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, imageUrl, type Post } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { BlogIndex } from "@/components/blog/BlogIndex";

const DESCRIPTION =
  "Plain-language guides on systems, software and running a smoother business, for business owners in Cebu.";

export const metadata: Metadata = pageMetadata({
  title: "Notes for business owners",
  description: DESCRIPTION,
  path: "/blog",
});

export default async function BlogPage() {
  if (!features.blog) notFound();
  const posts = await getAllPosts().catch(() => [] as Post[]);
  // Featured posts lead; everything else stays newest first.
  const ordered = [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)];
  const newsletterAction = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION;

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Notes for business owners",
    url: `${siteUrl}/blog`,
    description: DESCRIPTION,
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
    <>
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
        />
      )}
      <header className="container-page pt-6 pb-6 md:pt-14 md:pb-12">
        <p className="eyebrow">Blog</p>
        <h1 className="text-h1 mt-3 md:mt-4">Notes for business owners</h1>
        <p className="text-muted mt-4 max-w-[52ch] text-[17px] leading-[1.55] md:text-[18px]">
          Plain-language guides on systems, software and running a smoother business. No tech
          jargon, I promise. Okay, maybe a little, but I&apos;ll explain it.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="container-page">
          <p className="border-rule text-muted border-t py-10 text-[16px]">
            The first guides are on their way.
          </p>
        </div>
      ) : (
        <BlogIndex
          posts={ordered.map((p) => ({
            id: p._id,
            slug: p.slug.current,
            title: p.title,
            excerpt: p.excerpt,
            category: p.tags?.[0],
            readTime: p.readTime,
            coverUrl: imageUrl(p.coverImage, 1320, 990),
            coverAlt: p.coverImage?.alt,
          }))}
        />
      )}

      {newsletterAction ? (
        <section className="container-page py-12 md:py-24">
          <form
            action={newsletterAction}
            method="post"
            target="_blank"
            className="bg-tint flex flex-col gap-5 rounded-[24px] px-5 py-7 md:flex-row md:items-center md:justify-between md:gap-8 md:px-11 md:py-10"
          >
            <div>
              <h2 className="text-[24px] md:text-[28px]">Get new guides by email</h2>
              <p className="text-muted mt-1.5 text-[15px]">
                One short email a month. Unsubscribe anytime.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@business.com"
                className="field rounded-full px-5 sm:w-[300px]"
              />
              <button type="submit" className="btn btn-dark px-6">
                Subscribe
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="h-12 md:h-24" />
      )}
    </>
  );
}
