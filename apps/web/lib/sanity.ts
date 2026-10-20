import "server-only";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { SEED_PROJECTS, type ProjectKind, type ProjectTone } from "@portfolio/sanity-schemas/seed";
import { client, isSanityConfigured } from "./sanity.client";
import { sanityFetch } from "./sanity.live";

// ── Image URL builder ───────────────────────────────────────────
const builder = client ? createImageUrlBuilder(client) : null;
export function urlFor(source: SanityImageSource) {
  if (!builder) return null;
  return builder.image(source);
}

/** Pass a height to crop to that size; leave it out to keep the image's own ratio. */
export function imageUrl(
  source: SanityImageSource | undefined,
  width: number,
  height?: number,
): string | null {
  if (!source) return null;
  const img = urlFor(source);
  if (!img) return null;
  return (height ? img.width(width).height(height) : img.width(width)).url();
}

// ── Fetch helper ────────────────────────────────────────────────
// Uses sanityFetch (live) when available, falls back to client.fetch
async function fetchSanity<T>(query: string, params = {}, tags: string[] = []): Promise<T> {
  if (sanityFetch) {
    const { data } = await sanityFetch({ query, params, tags });
    return data as T;
  }
  if (client) {
    return client.fetch<T>(query, params, { next: { tags } });
  }
  throw new Error("Sanity is not configured");
}

// ── Types ───────────────────────────────────────────────────────
export type SanityImage = SanityImageSource & { alt?: string; caption?: string };

export type { ProjectKind, ProjectTone };

export type Project = {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  headline?: string;
  tagline: string;
  kind?: ProjectKind;
  client?: string;
  builtAt?: "client" | "employer";
  role?: string;
  typeLabel?: string;
  coverImage?: SanityImage;
  coverMock?: "team-calendar" | "salon-dashboard";
  gallery?: SanityImage[];
  coverPhone?: SanityImage;
  tone?: ProjectTone;
  /** Static images from the seed data, used when Sanity has none. */
  coverStatic?: StaticImage;
  coverPhoneStatic?: StaticImage;
  galleryStatic?: StaticImage[];
  techStack: string[];
  category?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
  overview?: string;
  problem?: string;
  highlights?: { title: string; body: string }[];
  solution?: PortableTextBlock[];
  localAngle?: { text?: string; chips?: string[] };
  results?: { metric: string; value: string }[];
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
};

export type Post = {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage?: SanityImage;
  content?: PortableTextBlock[];
  tags?: string[];
  readTime?: number;
  publishedAt?: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
};

export type StaticImage = { src: string; alt: string; caption?: string };

export type SanityProject = Project;
export type SanityPost = Post;

const KIND_LABEL: Record<ProjectKind, string> = {
  booking: "Booking system",
  "web-app": "Web app",
  website: "Website",
};

/** Card eyebrow, e.g. "Booking system · Built at Image Edits, Brisbane". */
export function projectTag(p: Project): string {
  const kind = p.kind ? KIND_LABEL[p.kind] : p.category;
  const where = p.client?.replace(" · ", ", ");
  const who = where && (p.builtAt === "employer" ? `Built at ${where}` : where);
  return [kind, who].filter(Boolean).join(" · ");
}

/** The project's cover: its Sanity image, or the static fallback. */
export function projectCover(p: Project, width: number, height?: number): StaticImage | null {
  const src = imageUrl(p.coverImage, width, height);
  if (src) return { src, alt: p.coverImage?.alt ?? `${p.title}: ${p.headline ?? p.tagline}` };
  return p.coverStatic ?? null;
}

/** The optional phone screenshot shown beside the case-study cover. */
export function projectPhone(p: Project): StaticImage | null {
  const src = imageUrl(p.coverPhone, 600);
  if (src) return { src, alt: p.coverPhone?.alt ?? `${p.title} on a phone` };
  return p.coverPhoneStatic ?? null;
}

/** Screenshots for the case study: Sanity's gallery, or the static fallback. */
export function projectGallery(p: Project): StaticImage[] {
  const fromSanity = (p.gallery ?? [])
    .map((img) => {
      const src = imageUrl(img, 1600);
      return src ? { src, alt: img.alt ?? "", caption: img.caption } : null;
    })
    .filter((img): img is NonNullable<typeof img> => img !== null);
  return fromSanity.length > 0 ? fromSanity : (p.galleryStatic ?? []);
}

// ── Queries ─────────────────────────────────────────────────────
const PROJECT_CARD = `_id, _updatedAt, title, slug, headline, tagline, kind, client, builtAt, tone,
  coverImage{..., alt, caption}, coverMock, techStack, category, liveUrl, githubUrl, featured, order`;

const featuredProjectsQuery = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc) [0...4] { ${PROJECT_CARD} }`,
);

const allProjectsQuery = defineQuery(
  `*[_type == "project"] | order(order asc) { ${PROJECT_CARD} }`,
);

const projectBySlugQuery = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_CARD}, role, typeLabel, overview, problem, highlights, solution, localAngle,
    gallery[]{..., alt, caption}, coverPhone{..., alt},
    results, publishedAt, seoTitle, seoDescription, ogImage{..., alt}
  }`,
);

const featuredPostsQuery = defineQuery(
  `*[_type == "post" && featured == true && defined(publishedAt)] | order(publishedAt desc) [0...3] {
    _id, title, slug, excerpt, coverImage{..., alt, caption}, tags, readTime, publishedAt, featured
  }`,
);

const allPostsQuery = defineQuery(
  `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id, _updatedAt, title, slug, excerpt, coverImage{..., alt, caption}, tags, readTime, publishedAt, featured
  }`,
);

const postBySlugQuery = defineQuery(
  `*[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
    _id, _updatedAt, title, slug, excerpt, coverImage{..., alt, caption}, content, tags, readTime, publishedAt,
    seoTitle, seoDescription, ogImage{..., alt}
  }`,
);

const profileQuery = defineQuery(
  `*[_id == "singleton-profile"][0] {
    ...,
    "resume": resume { "asset": asset-> { _ref, url } }
  }`,
);

// ── Fallback projects (no Sanity, or Sanity has none yet) ───────
export const FALLBACK_PROJECTS: Project[] = SEED_PROJECTS.map(
  ({ slug, cover, coverPhone, gallery, ...p }) => ({
    ...p,
    _id: `fallback-${slug}`,
    slug: { current: slug },
    coverStatic: cover,
    coverPhoneStatic: coverPhone,
    galleryStatic: gallery,
  }),
);

/** Lets a Sanity project without images fall back to the seed's static ones. */
function withStaticImages(p: Project): Project {
  const seed = FALLBACK_PROJECTS.find((f) => f.slug.current === p.slug.current);
  if (!seed) return p;
  return {
    ...p,
    tone: p.tone ?? seed.tone,
    coverStatic: seed.coverStatic,
    coverPhoneStatic: seed.coverPhoneStatic,
    galleryStatic: seed.galleryStatic,
  };
}

// ── Data fetchers ───────────────────────────────────────────────
export async function getFeaturedProjects(): Promise<Project[]> {
  const fallback = FALLBACK_PROJECTS.filter((p) => p.featured);
  if (!isSanityConfigured) return fallback;
  const projects = await fetchSanity<Project[]>(featuredProjectsQuery, {}, ["project"]);
  return projects.length > 0 ? projects.map(withStaticImages) : fallback;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!isSanityConfigured) return FALLBACK_PROJECTS;
  const projects = await fetchSanity<Project[]>(allProjectsQuery, {}, ["project"]);
  return projects.length > 0 ? projects.map(withStaticImages) : FALLBACK_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = FALLBACK_PROJECTS.find((p) => p.slug.current === slug) ?? null;
  if (!isSanityConfigured) return fallback;
  const project = await fetchSanity<Project | null>(projectBySlugQuery, { slug }, [
    "project",
    `project:${slug}`,
  ]);
  return project ? withStaticImages(project) : fallback;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return [];
  return fetchSanity<Post[]>(featuredPostsQuery, {}, ["post"]);
}

export async function getAllPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return [];
  return fetchSanity<Post[]>(allPostsQuery, {}, ["post"]);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null;
  return fetchSanity<Post | null>(postBySlugQuery, { slug }, ["post", `post:${slug}`]);
}

/**
 * The profile as Sanity has it, with every field Sanity leaves empty filled
 * from FALLBACK_PROFILE. New fields therefore render the built-in copy until
 * they're written in the studio.
 */
export async function getProfile(): Promise<Profile> {
  if (!isSanityConfigured) return FALLBACK_PROFILE;
  const data = await fetchSanity<Partial<Profile> | null>(profileQuery, {}, ["profile"]);
  if (!data) return FALLBACK_PROFILE;
  const filled = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && !(Array.isArray(v) && v.length === 0)),
  );
  return { ...FALLBACK_PROFILE, ...filled };
}

export function getResumeUrl(profile: Profile): string | null {
  return profile.resume?.asset?.url ?? null;
}

/** Strip the inline copy markup (==hl==, **bold**, _em_) for plain-text contexts. */
export function plainText(s: string): string {
  return s
    .replace(/==(.+?)==/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

// ── Profile prompt context (for AI chatbot) ─────────────────────
export function profileToPromptContext(p: Profile, projects: Project[]): string {
  const services = p.services.map((s) => `- ${s.name} (${s.kind}): ${s.description}`).join("\n");
  const steps = p.steps
    .map((s, i) => `${i + 1}. ${s.title}: ${s.body} ${s.joke ?? ""}`.trim())
    .join("\n");
  const work = projects
    .map(
      (pr) =>
        `- ${pr.title}${pr.client ? ` (${pr.client}${pr.builtAt === "employer" ? ", built while employed there" : ""})` : ""}: ${pr.headline ?? ""}. ${pr.tagline}`,
    )
    .join("\n");
  const offer = p.foundingOffer?.enabled
    ? `FOUNDING CLIENT OFFER: ${plainText(p.foundingOffer.body ?? "")}`
    : "";

  return `
NAME: ${p.name}
WHAT HE DOES: Builds custom software for local businesses in Cebu, Philippines: booking, ordering & inventory, internal tools and Messenger automation. Websites are an add-on.
LOCATION: ${p.location} (${p.timezone})
AVAILABILITY: ${plainText(p.availabilityLine)}
EMAIL: ${p.email}
${p.bookingUrl ? `FREE 30-MIN CALL: ${p.bookingUrl}` : ""}
${p.facebookUrl ? `FACEBOOK: ${p.facebookUrl}` : ""}

SERVICES:
${services}

HOW IT WORKS:
${steps}
${offer}

SYSTEMS HE HAS BUILT:
${work}

BACKGROUND: ${p.bioShort}
${(p.experience ?? []).map((e) => `- ${e.company}, ${e.role}, ${e.period}: ${e.outcome ?? e.highlights?.[0] ?? ""}`).join("\n")}
`.trim();
}

// ── Profile types ───────────────────────────────────────────────
export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  companyUrl?: string;
  outcome?: string;
  highlights?: string[];
}
export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
}
export interface Service {
  kind: string;
  name: string;
  description: string;
  priceRange?: string;
}
export interface Step {
  title: string;
  body: string;
  joke?: string;
  highlight?: boolean;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  timezone: string;
  photo?: SanityImage;
  availabilityLine: string;
  email: string;
  bookingUrl?: string;
  facebookUrl?: string;
  messengerUrl?: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  websiteUrl: string;
  heroTagline: string;
  heroSub: string;
  heroAside: string;
  pains: { text: string; joke?: string }[];
  services: Service[];
  steps: Step[];
  foundingOffer: { enabled?: boolean; spots?: number; discount?: string; body?: string };
  aboutIntro: string[];
  workPrinciples: { title: string; body: string }[];
  terminalSkills: string[];
  bioShort: string;
  experience: Experience[];
  education: Education[];
  resume?: { asset: { _ref: string; url?: string } };
  resumeLastUpdated?: string;
  ogImage?: SanityImage;
  seoDescription: string;
}

// ── Fallback profile (when Sanity isn't configured or a field is empty) ──
export const FALLBACK_PROFILE: Profile = {
  name: "Michael Padin",
  title: "Custom software for Cebu businesses",
  location: "Cebu, Philippines",
  timezone: "UTC+8",
  availabilityLine: "**3 spots open** this quarter for Cebu businesses",
  email: "hello@michaelpadin.com",
  bookingUrl: "https://cal.com/michael-padin/intro",
  githubUrl: "https://github.com/michael-padin",
  linkedinUrl: "https://linkedin.com/in/michael-padin",
  websiteUrl: "https://michaelpadin.com",
  heroTagline: "Custom systems built around how your business runs.",
  heroSub:
    "Booking, ordering, inventory and staff tools for local businesses. Retire the logbook, the 14-tab spreadsheet and ==the group chat called “ORDERS FINAL v2”==. One system that fits how you work.",
  heroAside:
    "You work with the developer directly. No agency, no account manager, no “let me check with the team.”",
  pains: [
    { text: "A paper logbook", joke: "(with a coffee stain on March)" },
    { text: "Orders scattered across Messenger, calls and walk-ins" },
    { text: "Inventory in Excel, always one day behind" },
    { text: "Reports you rebuild by hand", joke: "every Sunday night" },
  ],
  services: [
    {
      kind: "System",
      name: "Booking & reservation systems",
      description:
        "Online booking with calendars, slots, deposits and reminders. Includes dashboards for owners and staff.",
      priceRange: "₱80k–150k",
    },
    {
      kind: "System",
      name: "Ordering & inventory",
      description: "Take orders online or in-store, track stock, and accept GCash, Maya or card.",
      priceRange: "₱100k–200k",
    },
    {
      kind: "System",
      name: "Internal tools & dashboards",
      description:
        "Replace spreadsheets with one system your team uses for records, approvals and reports.",
      priceRange: "₱120k–250k",
    },
    {
      kind: "Integration",
      name: "Messenger & Facebook automation",
      description: "Inquiries and orders from your Page go straight into your system.",
      priceRange: "₱20k–40k",
    },
    {
      kind: "Add-on",
      name: "Business website + Google Maps",
      description: "A fast site and a Maps listing that send customers into your system.",
      priceRange: "₱25k–45k",
    },
    {
      kind: "Ongoing",
      name: "Support & maintenance",
      description: "Hosting, backups, fixes and new features as you grow.",
      priceRange: "₱5k–10k/mo",
    },
  ],
  steps: [
    {
      title: "Free call",
      body: "We go through how your business runs today and where it loses time or money.",
      joke: "Coffee optional, but encouraged.",
    },
    {
      title: "Fixed quote in 48 hours",
      body: "One clear price, paid in milestones. You test a working preview every week.",
      joke: "No surprise “additional fees” later.",
    },
    {
      title: "Launch & training",
      body: "I set it up, train your staff and stay on for support.",
      joke: "Yes, even the tita who loves the notebook.",
      highlight: true,
    },
    {
      title: "Support & growth",
      body: "Fixes, updates and new features as your business grows.",
      joke: "Same developer, same phone number.",
    },
  ],
  foundingOffer: {
    enabled: true,
    spots: 3,
    discount: "20%",
    body: "The first three local businesses get 20% off their system. In return, I write it up as a case study and you say nice things about me. ==Honest ones.==",
  },
  aboutIntro: [
    "I'm a software developer from Cebu. Since 2022 I've built production systems for companies in Australia and the US: booking engines, image-processing pipelines and dashboards that teams use every day.",
    "Now I'm bringing that work home. I help local businesses replace logbooks, spreadsheets and group chats with systems built around how they actually work.",
  ],
  workPrinciples: [
    {
      title: "I ask before I build",
      body: "I learn how your business really runs before writing any code. Solving the right problem matters more than clever features.",
    },
    {
      title: "You always know where things stand",
      body: "I give clear weekly updates and a preview link you can click. No disappearing for a month.",
    },
    {
      title: "Working beats perfect",
      body: "I launch something useful early, then improve it based on how your staff actually use it.",
    },
    {
      title: "I stay after launch",
      body: "Fixes, updates and new features as you grow. You get the same person who built it.",
    },
  ],
  terminalSkills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Hono",
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "BullMQ",
    "Socket.io",
    "AWS S3",
    "Cloudflare Workers",
    "Docker",
    "Sanity CMS",
  ],
  bioShort:
    "Software developer from Cebu, Philippines. I build booking, ordering, inventory and staff systems for local businesses, after three years building production systems for companies in Australia and the US.",
  experience: [
    {
      company: "Image Edits",
      role: "Full Stack Developer",
      period: "Aug 2023 – Present",
      location: "Brisbane (remote)",
      current: true,
      companyUrl: "https://imageedits.com",
      outcome:
        "Built a full scheduling and booking system from scratch, plus image-processing tools for real estate photographers.",
    },
    {
      company: "ReallyBrief",
      role: "Full Stack Developer",
      period: "Mar 2023 – Aug 2023",
      location: "Remote",
      current: false,
      outcome: "Turned designers' mockups into working features.",
    },
    {
      company: "CloudNext",
      role: "Node.js Developer",
      period: "Sep 2022 – Mar 2023",
      location: "Remote",
      current: false,
      outcome: "Fixed and improved API endpoints.",
    },
    {
      company: "Techroad",
      role: "DevOps Developer",
      period: "May 2022 – Jun 2022",
      location: "Remote",
      current: false,
      outcome: "Researched AWS Amplify Studio for generating site components.",
    },
  ],
  education: [
    {
      institution: "Cebu Technological University · Argao",
      degree: "BS Information Technology",
      period: "2021 – 2025",
      location: "Argao, Cebu",
    },
  ],
  seoDescription:
    "Custom booking, ordering, inventory and staff systems for local businesses in Cebu. Free call, fixed quote in 48 hours, and you work with the developer directly.",
};
