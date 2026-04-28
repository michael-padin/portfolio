import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";
import { draftMode } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VisualEditing } from "next-sanity/visual-editing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/features/ChatBot";
import { getProfile, FALLBACK_PROFILE, imageUrl } from "@/lib/sanity";
import { SanityLive } from "@/lib/sanity.live";
import { features } from "@/lib/features";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const siteUrl = profile.websiteUrl ?? "https://michaelpadin.com";
  const ogImageUrl = profile.ogImage ? imageUrl(profile.ogImage, 1200, 630) : null;
  const ogImage = ogImageUrl ?? "/opengraph-image";
  const ogTitle = `${profile.name} — ${profile.title}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: ogTitle,
      template: `%s | ${profile.name}`,
    },
    description: profile.seoDescription,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    publisher: profile.name,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: profile.name,
      title: ogTitle,
      description: profile.seoDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: profile.seoDescription,
      images: [{ url: ogImage, alt: ogTitle }],
      ...(profile.twitterUrl && { creator: handleFromUrl(profile.twitterUrl) }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: siteUrl },
    category: "technology",
  };
}

function handleFromUrl(url: string): string | undefined {
  const match = url.match(/(?:twitter\.com|x\.com)\/(@?[\w_]+)/i);
  const captured = match?.[1];
  if (!captured) return undefined;
  return `@${captured.replace(/^@/, "")}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const siteUrl = profile.websiteUrl ?? "https://michaelpadin.com";
  const isDraftMode = (await draftMode()).isEnabled;

  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const photoUrl = profile.photo ? imageUrl(profile.photo, 400, 400) : null;
  const [city, country] = profile.location.split(",").map((s) => s.trim());

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.title,
    description: profile.seoDescription,
    email: `mailto:${profile.email}`,
    ...(photoUrl && { image: photoUrl }),
    knowsAbout: profile.terminalSkills,
    sameAs: [profile.githubUrl, profile.linkedinUrl, profile.twitterUrl, profile.websiteUrl].filter(
      Boolean,
    ),
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      ...(country && { addressRegion: country }),
      addressCountry: "PH",
    },
    worksFor: profile.experience?.find((e) => e.current)
      ? {
          "@type": "Organization",
          name: profile.experience.find((e) => e.current)!.company,
          ...(profile.experience.find((e) => e.current)!.companyUrl && {
            url: profile.experience.find((e) => e.current)!.companyUrl,
          }),
        }
      : undefined,
    alumniOf: profile.education?.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.institution,
    })),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: siteUrl,
    description: profile.seoDescription,
    inLanguage: "en-US",
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };

  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-bg text-fg antialiased">
        {/* Umami — privacy-first, no cookie banner */}
        {umamiId && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiId}
            strategy="afterInteractive"
          />
        )}
        <Navbar />
        <main>{children}</main>
        <Footer />
        {features.chatbot && <ChatBot />}
        {isDraftMode && <VisualEditing />}
        {SanityLive && <SanityLive />}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
