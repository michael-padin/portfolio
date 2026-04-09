import "server-only";
import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_READ_TOKEN,
});

const builder = createImageUrlBuilder(client);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  tagline: string;
  coverImage?: SanityImageSource;
  techStack: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
  overview?: string;
  problem?: string;
  results?: { metric: string; value: string }[];
  publishedAt?: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage?: SanityImageSource;
  tags?: string[];
  readTime?: number;
  publishedAt?: string;
  featured: boolean;
};

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(order asc) [0...6] {
      _id, title, slug, tagline, coverImage, techStack, category,
      liveUrl, githubUrl, featured, order, overview
    }`,
  );
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc) {
      _id, title, slug, tagline, coverImage, techStack, category,
      liveUrl, githubUrl, featured, order
    }`,
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id, title, slug, tagline, coverImage, techStack, category,
      liveUrl, githubUrl, overview, problem, solution, results, publishedAt
    }`,
    { slug },
  );
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      _id, title, slug, excerpt, coverImage, tags, readTime, publishedAt, featured
    }`,
  );
}

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage, tags, readTime, publishedAt, featured
    }`,
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, coverImage, content, tags, readTime, publishedAt
    }`,
    { slug },
  );
}

// Type aliases for backwards-compat with existing components
export type SanityProject = Project;
export type SanityPost = Post;

// ─── Profile ─────────────────────────────────────────────────────
// export type Profile = {
//   name: string;
//   title: string;
//   location: string;
//   timezone: string;
//   photo?: SanityImageSource;
//   availableForFreelance: boolean;
//   availableForFullTime: boolean;
//   availabilityNote: string;
//   email: string;
//   githubUrl?: string;
//   linkedinUrl?: string;
//   twitterUrl?: string;
//   websiteUrl?: string;
//   heroTaglineClient: string;
//   heroSubClient: string;
//   heroTaglineEmployer: string;
//   heroSubEmployer: string;
//   heroStats: { value: string; label: string }[];
//   terminalSkills: string[];
//   bio?: unknown[];
//   bioShort: string;
//   values?: { emoji: string; title: string; body: string }[];
//   skillGroups?: { category: string; skills: string[] }[];
//   experience?: {
//     company: string;
//     role: string;
//     period: string;
//     location: string;
//     current: boolean;
//     companyUrl?: string;
//     highlights: string[];
//   }[];
//   education?: {
//     institution: string;
//     degree: string;
//     period: string;
//     location: string;
//   }[];
//   seoDescription?: string;
// };

// export async function getProfile(): Promise<Profile | null> {
//   return client.fetch(
//     `*[_id == "singleton-profile"][0]`,
//     {},
//     { next: { revalidate: 3600 } },
//   );
// }

// Serialise profile to plain text for the AI chatbot system prompt
export function profileToPromptContext(p: Profile): string {
  const availability = [
    p.availableForFreelance
      ? "Available for freelance projects"
      : "Not taking freelance right now",
    p.availableForFullTime
      ? "Open to full-time remote roles"
      : "Not looking for full-time right now",
  ].join(". ");

  const experience = (p.experience ?? [])
    .map(
      (e) =>
        `- ${e.company} (${e.role}, ${e.period}, ${e.location}):\n  ${e.highlights.join("\n  ")}`,
    )
    .join("\n");

  const skills = (p.skillGroups ?? [])
    .map((g) => `${g.category}: ${g.skills.join(", ")}`)
    .join("\n");

  return `
NAME: ${p.name}
TITLE: ${p.title}
LOCATION: ${p.location} (${p.timezone})
EMAIL: ${p.email}
GITHUB: ${p.githubUrl ?? "N/A"}
LINKEDIN: ${p.linkedinUrl ?? "N/A"}
WEBSITE: ${p.websiteUrl ?? "N/A"}

AVAILABILITY:
${availability}
Note: ${p.availabilityNote}

SKILLS:
${skills}

EXPERIENCE:
${experience}

EDUCATION:
${(p.education ?? []).map((e) => `- ${e.institution} · ${e.degree} · ${e.period}`).join("\n")}
`.trim();
}

// ─── Profile (singleton) ─────────────────────────────────────────
export interface SkillGroup {
  category: string;
  skills: string[];
}
export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  companyUrl?: string;
  highlights: string[];
}
export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
}
export interface HeroStat {
  value: string;
  label: string;
}
export interface ProfileValue {
  emoji: string;
  title: string;
  body: string;
}

export interface Profile {
  // Identity
  name: string;
  title: string;
  location: string;
  timezone: string;
  photo?: SanityImageSource;
  // Availability
  availableForFreelance: boolean;
  availableForFullTime: boolean;
  availabilityNote: string;
  // Contact
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  websiteUrl: string;
  // Hero
  heroTaglineClient: string;
  heroSubClient: string;
  heroTaglineEmployer: string;
  heroSubEmployer: string;
  heroStats: HeroStat[];
  terminalSkills: string[];
  // Bio
  bio?: unknown[];
  bioShort: string;
  // About
  values: ProfileValue[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  education: Education[];
  // SEO
  ogImage?: SanityImageSource;
  seoDescription: string;
}

export async function getProfile(): Promise<Profile | null> {
  return client.fetch<Profile | null>(
    `*[_id == "singleton-profile"][0]`,
    {},
    { next: { revalidate: 300 } }, // 5-min cache — fast to update
  );
}

// Fallback profile when Sanity isn't set up yet
export const FALLBACK_PROFILE: Profile = {
  name: "Michael Padin",
  title: "Full-Stack Developer",
  location: "Cebu, Philippines",
  timezone: "UTC+8",
  availableForFreelance: true,
  availableForFullTime: true,
  availabilityNote: "Available for new projects",
  email: "hello@michaelpadin.com",
  githubUrl: "https://github.com/michael-padin",
  linkedinUrl: "https://linkedin.com/in/michael-padin",
  websiteUrl: "https://michaelpadin.com",
  heroTaglineClient: "I build products that ship and actually work.",
  heroSubClient:
    "Need a scalable web app, a fast marketing site, or a Node.js backend? I've shipped production systems for companies in Australia, California, and beyond — all from Cebu, Philippines.",
  heroTaglineEmployer: "Senior full-stack developer ready to join your team.",
  heroSubEmployer:
    "Experienced in Turborepo monorepos, Next.js App Router, Express microservices, and AWS/Cloudflare infrastructure. I collaborate async-first and thrive in distributed teams.",
  heroStats: [
    { value: "3+", label: "Years experience" },
    { value: "10+", label: "Projects shipped" },
    { value: "UTC+8", label: "Flexible overlap" },
  ],
  terminalSkills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "PostgreSQL",
    "MongoDB",
    "AWS S3",
    "Cloudflare Workers",
    "Turborepo",
    "Prisma",
    "Sanity CMS",
    "Docker",
  ],
  bioShort:
    "Full-stack developer from Cebu, Philippines specialising in React, Next.js, and Node.js.",
  values: [
    {
      emoji: "🚢",
      title: "Ship it",
      body: "Perfect is the enemy of done. I prefer iterating on live products over endless planning cycles.",
    },
    {
      emoji: "📖",
      title: "Write to think",
      body: "I document decisions, write clear PR descriptions, and believe good writing is a core engineering skill.",
    },
    {
      emoji: "🌐",
      title: "Async by default",
      body: "Working across timezones (PH ↔ AU ↔ US) taught me to over-communicate and never block teammates.",
    },
    {
      emoji: "🔍",
      title: "Understand the why",
      body: "I ask questions before writing a line of code. Solving the right problem matters more than elegant solutions to the wrong one.",
    },
  ],
  skillGroups: [
    {
      category: "Frontend",
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "TanStack Query",
        "Tailwind CSS",
        "Shadcn/ui",
        "Framer Motion",
      ],
    },
    {
      category: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "Hono",
        "PostgreSQL",
        "MongoDB",
        "Prisma ORM",
        "BullMQ",
        "Socket.io",
      ],
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS S3",
        "Cloudflare Workers",
        "Cloudflare Pages",
        "Docker",
        "GitHub Actions",
      ],
    },
    {
      category: "Tooling",
      skills: [
        "Turborepo",
        "pnpm workspaces",
        "Git",
        "Sanity CMS",
        "Keystatic",
      ],
    },
    {
      category: "Soft Skills",
      skills: [
        "Async-first communication",
        "Technical writing",
        "Code review",
        "Mentoring",
      ],
    },
  ],
  experience: [
    {
      company: "Image Edits",
      role: "Full-Stack Developer",
      period: "Aug 2023 – Present",
      location: "Brisbane, Australia (Remote)",
      current: true,
      companyUrl: "https://imageedits.com",
      highlights: [
        "Architected scalable Express.js + TypeScript backend for bulk image processing (AWS S3, BullMQ, dynamic watermarking)",
        "Led frontend migration from Next.js to TanStack in a Turborepo monorepo with 5 apps",
        "Planning and building a photographer booking platform (Aryeo/Tonomo-style)",
        "Improved TypeScript performance and reduced bundle size across multiple internal packages",
      ],
    },
    {
      company: "ReallyBrief",
      role: "Full-Stack Developer",
      period: "Mar 2023 – Aug 2023",
      location: "Remote",
      current: false,
      highlights: [
        "Shipped numerous fullstack features using Next.js and MongoDB",
        "Collaborated with UI/UX designers to transform mockups into functional interfaces",
      ],
    },
    {
      company: "CloudNext",
      role: "Node.js Developer",
      period: "Sep 2022 – Mar 2023",
      location: "Remote",
      current: false,
      highlights: [
        "Optimized Express.js API routes improving response times",
        "Integrated Firestore real-time database capabilities",
      ],
    },
    {
      company: "Techroad",
      role: "DevOps Developer",
      period: "May 2022 – Jun 2022",
      location: "Remote",
      current: false,
      highlights: [
        "Researched AWS Amplify Studio for web component generation",
        "Integrated Slack API for form-to-Slack notifications",
      ],
    },
  ],
  education: [
    {
      institution: "Cebu Technological University – Argao Campus",
      degree: "BS Information Technology",
      period: "Jul 2021 – Jul 2025",
      location: "Argao, Cebu",
    },
  ],
  seoDescription:
    "Full-stack developer (React, Next.js, Node.js) based in Cebu, Philippines. Available for freelance projects and full-time remote roles.",
};
