import type { NextConfig } from "next";

const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://studio.michaelpadin.com";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "connect-src 'self' https://*.api.sanity.io https://cloud.umami.is https://api-gateway.umami.dev https://challenges.cloudflare.com https://www.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  `frame-ancestors 'self' ${studioUrl}`,
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Transpile Sanity
  transpilePackages: ["@portfolio/sanity-schemas"],
};

export default nextConfig;
