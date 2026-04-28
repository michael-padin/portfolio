import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://michaelpadin.com";

export const siteUrl = SITE_URL;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noindex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? "/opengraph-image";
  const ogImageAlt = imageAlt ?? title;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "Michael Padin",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        tags,
        authors: ["Michael Padin"],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: ogImageAlt }],
    },
  };
}

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
