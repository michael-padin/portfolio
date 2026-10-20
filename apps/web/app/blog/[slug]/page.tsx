import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getProfile, imageUrl, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { Mark } from "@/components/brand/Logo";
import { BookButton } from "@/components/ui/BookButton";
import { PostBody } from "@/components/blog/PostBody";

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

export default async function BlogPostPage({ params }: Props) {
  if (!features.blog) notFound();
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getProfile().catch(() => FALLBACK_PROFILE),
  ]);
  if (!post) notFound();

  const category = post.tags?.[0];
  const coverUrl = imageUrl(post.coverImage, 1600, 900);
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <article className="mx-auto max-w-[800px] px-5 pt-6 pb-12 md:pt-14 md:pb-20">
        <nav aria-label="Breadcrumb" className="text-muted text-[14px]">
          <Link href="/blog" className="hover:text-ink transition-colors">
            Blog
          </Link>
          {category && <> / {category}</>}
        </nav>
        <h1 className="mt-4 text-[36px] leading-[1.05] tracking-[-0.02em] md:mt-5 md:text-[56px]">
          {post.title}
        </h1>
        <div className="text-muted mt-5 flex items-center gap-3 text-[14px] md:mt-6">
          <Mark size={28} />
          <span>
            <strong className="text-ink font-semibold">Michael Padin</strong>
            {post.readTime && <> · {post.readTime} min read</>}
            {post.publishedAt && (
              <>
                {" · "}
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </span>
        </div>

        {coverUrl && (
          <div className="bg-tint relative mt-8 aspect-video overflow-hidden rounded-[20px] md:mt-9">
            <Image
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              sizes="(min-width: 800px) 760px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 md:mt-10">
          {post.content && post.content.length > 0 ? (
            <PostBody value={post.content} />
          ) : (
            <p className="prose-post">{post.excerpt}</p>
          )}
        </div>
      </article>

      <aside className="mx-auto mb-12 max-w-[800px] px-5 md:mb-24">
        <div className="bg-tint flex flex-col gap-5 rounded-[24px] px-6 py-7 md:flex-row md:items-center md:justify-between md:px-9 md:py-8">
          <div>
            <h2 className="text-[22px] md:text-[24px]">Not sure what your business needs?</h2>
            <p className="text-muted mt-1.5 text-[15px]">
              Tell me how your business runs. I&apos;ll give you an honest answer, free.
            </p>
          </div>
          <BookButton
            bookingUrl={profile.bookingUrl}
            email={profile.email}
            track="book-call-post"
            className="px-[22px] py-[15px]"
          >
            Book a free call
          </BookButton>
        </div>
      </aside>
    </>
  );
}
