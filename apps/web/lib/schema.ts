export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael Padin",
    jobTitle: "Full-Stack Developer",
    url: "https://michaelpadin.com",
    email: "hello@michaelpadin.com",
    image: "https://michaelpadin.com/og-image.jpg",
    sameAs: [
      "https://linkedin.com/in/michael-padin",
      "https://github.com/michael-padin",
    ],
    knowsAbout: [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
      "Express", "AWS", "Cloudflare", "Turborepo", "PostgreSQL",
      "MongoDB", "Sanity CMS", "Full-Stack Development",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cebu",
      addressCountry: "PH",
    },
    description:
      "Full-stack web developer specializing in JavaScript/TypeScript, React, Next.js and Node.js. Based in the Philippines, available for international remote work.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Michael Padin — Full-Stack Developer",
    url: "https://michaelpadin.com",
    description:
      "Portfolio of Michael Padin, a full-stack developer from the Philippines specializing in React, Next.js, and Node.js.",
    author: { "@type": "Person", name: "Michael Padin" },
  };
}

export function projectSchema(project: {
  title: string;
  tagline: string;
  url?: string;
  techStack: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    url: project.url,
    keywords: project.techStack.join(", "),
    author: { "@type": "Person", name: "Michael Padin" },
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `https://michaelpadin.com/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Michael Padin",
      url: "https://michaelpadin.com",
    },
    publisher: {
      "@type": "Person",
      name: "Michael Padin",
    },
  };
}
