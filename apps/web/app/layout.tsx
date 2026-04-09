import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/features/ChatBot";
import { getProfile, FALLBACK_PROFILE } from "@/lib/sanity";
import { features } from "@/lib/features";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const siteUrl = profile.websiteUrl ?? "https://michaelpadin.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile.name} — ${profile.title}`,
      template: `%s | ${profile.name}`,
    },
    description: profile.seoDescription,
    keywords: [
      "full-stack developer Philippines",
      "React developer Cebu",
      "Next.js developer remote",
      "hire freelance developer",
      "Node.js TypeScript developer",
    ],
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: profile.name,
      title: `${profile.name} — ${profile.title}`,
      description: profile.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.title}`,
      description: profile.seoDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: siteUrl },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = (await getProfile().catch(() => null)) ?? FALLBACK_PROFILE;
  const siteUrl = profile.websiteUrl ?? "https://michaelpadin.com";

  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.title,
    knowsAbout: profile.terminalSkills,
    sameAs: [profile.githubUrl, profile.linkedinUrl].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.split(",")[0],
      addressCountry: "PH",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
        {/* GA4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${gaId}',{anonymize_ip:true});
            `}</Script>
          </>
        )}
        <Navbar />
        <main>{children}</main>
        <Footer />
        {features.chatbot && <ChatBot />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
