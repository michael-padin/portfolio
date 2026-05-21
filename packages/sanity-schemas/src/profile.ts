import { defineField, defineType } from "sanity";

export const profileSchema = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    // ── Identity ─────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      initialValue: "Michael Padin",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      initialValue: "Full Stack Developer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "e.g. Cebu, Philippines",
      type: "string",
      initialValue: "Cebu, Philippines",
    }),
    defineField({
      name: "timezone",
      title: "Timezone",
      type: "string",
      initialValue: "UTC+8",
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          description: "Describe the photo for accessibility and SEO",
          type: "string",
          validation: (rule) => rule.max(200),
        },
      ],
    }),

    // ── Availability ─────────────────────────────────────────
    defineField({
      name: "availableForFreelance",
      title: "Available for Freelance?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "availableForFullTime",
      title: "Available for Full-Time Remote?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability Note",
      description: "Short note shown in footer and hero. e.g. 'Available for new projects'",
      type: "string",
      initialValue: "Available for new projects",
      validation: (rule) => rule.max(80),
    }),

    // ── Contact & Social ─────────────────────────────────────
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      initialValue: "hello@michaelpadin.com",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      initialValue: "https://github.com/michael-padin",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      initialValue: "https://linkedin.com/in/michael-padin",
    }),
    defineField({
      name: "twitterUrl",
      title: "Twitter / X URL",
      type: "url",
    }),
    defineField({
      name: "websiteUrl",
      title: "Portfolio URL",
      type: "url",
      initialValue: "https://michaelpadin.com",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL (Cal.com, Calendly, etc.)",
      description:
        "Optional. When set, a 'Book' link appears on the hero, contact page, signature block, and footer. Leave empty to hide.",
      type: "url",
    }),

    // ── Hero section ─────────────────────────────────────────
    defineField({
      name: "heroTaglineClient",
      title: "Hero — Client Tagline",
      description: "Main headline shown to potential clients (short, punchy)",
      type: "string",
      initialValue: "I build products that ship and actually work.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "heroSubClient",
      title: "Hero — Client Sub-copy",
      type: "text",
      rows: 2,
      initialValue:
        "Need a scalable web app, a fast marketing site, or a Node.js backend? I've shipped production systems for companies in Australia, California, and beyond — all from Cebu, Philippines.",
    }),
    defineField({
      name: "heroTaglineEmployer",
      title: "Hero — Employer Tagline",
      description: "Main headline shown to recruiters/hiring managers",
      type: "string",
      initialValue: "Senior full stack developer ready to join your team.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "heroSubEmployer",
      title: "Hero — Employer Sub-copy",
      type: "text",
      rows: 2,
      initialValue:
        "Experienced in Turborepo monorepos, Next.js App Router, Express microservices, and AWS/Cloudflare infrastructure. I collaborate async-first and thrive in distributed teams.",
    }),
    defineField({
      name: "heroStats",
      title: "Hero Stats (3 recommended)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value", description: "e.g. '3+'" },
            {
              name: "label",
              type: "string",
              title: "Label",
              description: "e.g. 'Years experience'",
            },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      initialValue: [
        { value: "3+", label: "Years experience" },
        { value: "10+", label: "Projects shipped" },
        { value: "UTC+8", label: "Flexible overlap" },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "terminalSkills",
      title: "Terminal Card — Skills List",
      description: "Skills shown in the terminal widget on the hero section",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
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
      ],
    }),

    // ── Bio ───────────────────────────────────────────────────
    defineField({
      name: "bioShort",
      title: "Short Bio",
      description: "1–2 sentences used in SEO description and previews",
      type: "text",
      rows: 2,
      initialValue:
        "Full stack developer from Cebu, Philippines. I build scalable React and Node.js apps for clients worldwide.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "bio",
      title: "Full Bio (Rich Text)",
      description: "Shown in the About section — supports paragraphs and links",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Meta Description",
      description: "Used in <meta name='description'> — keep under 160 chars",
      type: "string",
      validation: (rule) => rule.max(160),
      initialValue:
        "Full stack developer (React, Next.js, Node.js) based in Cebu, Philippines. Available for freelance projects and full-time remote roles.",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      description: "Social share image (1200x630 recommended)",
      type: "image",
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.max(200),
        },
      ],
    }),

    // ── Resume ───────────────────────────────────────────────
    defineField({
      name: "resume",
      title: "Resume / CV",
      description: "Upload your latest resume (PDF). Visitors can download it from the site.",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "resumeLastUpdated",
      title: "Resume Last Updated",
      description: "When was the resume last updated?",
      type: "date",
    }),

    // ── Values / How I Work ───────────────────────────────────
    defineField({
      name: "values",
      title: '"How I Work" cards',
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "emoji", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Description", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
      initialValue: [
        {
          emoji: "🚢",
          title: "Ship it",
          body: "Perfect is the enemy of done. I prefer iterating on live products over endless planning cycles.",
        },
        {
          emoji: "📖",
          title: "Write to think",
          body: "I document decisions, write clear PR descriptions, and believe good writing is a core development skill.",
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
    }),

    // ── Skills ───────────────────────────────────────────────
    defineField({
      name: "skillGroups",
      title: "Skill Groups",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "category",
              type: "string",
              title: "Category",
              description: "e.g. Frontend, Backend, Cloud",
            },
            { name: "skills", type: "array", title: "Skills", of: [{ type: "string" }] },
          ],
          preview: { select: { title: "category" } },
        },
      ],
      initialValue: [
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
          skills: ["AWS S3", "Cloudflare Workers", "Cloudflare Pages", "Docker", "GitHub Actions"],
        },
        {
          category: "Tooling",
          skills: ["Turborepo", "pnpm workspaces", "Git", "Sanity CMS", "Keystatic"],
        },
      ],
    }),

    // ── Experience ───────────────────────────────────────────
    defineField({
      name: "experience",
      title: "Work Experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "company", type: "string", title: "Company" },
            { name: "role", type: "string", title: "Role" },
            {
              name: "period",
              type: "string",
              title: "Period",
              description: "e.g. Aug 2023 – Present",
            },
            {
              name: "location",
              type: "string",
              title: "Location",
              description: "e.g. Brisbane, Australia (Remote)",
            },
            { name: "current", type: "boolean", title: "Current role?", initialValue: false },
            { name: "companyUrl", type: "url", title: "Company URL (optional)" },
            {
              name: "highlights",
              type: "array",
              title: "Key Highlights",
              of: [{ type: "string" }],
              description: "Bullet points — start with a strong action verb",
            },
          ],
          preview: {
            select: { title: "company", subtitle: "role" },
          },
        },
      ],
      initialValue: [
        {
          company: "Image Edits",
          role: "Full Stack Developer",
          period: "Aug 2023 – Present",
          location: "Brisbane, Australia (Remote)",
          current: true,
          companyUrl: "https://imageedits.com",
          highlights: [
            "Architected scalable Express.js + TypeScript backend for bulk image processing (AWS S3, BullMQ, dynamic watermarking)",
            "Led frontend migration from Next.js to TanStack in a Turborepo monorepo with 5 apps",
            "Building a photographer booking platform (Aryeo/Tonomo-style) — plan, architect, and implement",
            "Improved TypeScript performance and reduced bundle size across internal packages",
          ],
        },
        {
          company: "ReallyBrief",
          role: "Full Stack Developer",
          period: "Mar 2023 – Aug 2023",
          location: "Remote",
          current: false,
          highlights: [
            "Collaborated with UI/UX designer to transform mockups into fully functional features",
            "Shipped diverse features within a Next.js + MongoDB application",
            "Resolved bugs promptly by analysing and troubleshooting code",
          ],
        },
        {
          company: "CloudNext",
          role: "Node.js Developer",
          period: "Sep 2022 – Mar 2023",
          location: "Remote",
          current: false,
          highlights: [
            "Resolved and enhanced API endpoints via Jira-tracked tickets",
            "Optimised Express.js routes, improving response times",
            "Integrated Firestore for real-time data storage",
          ],
        },
        {
          company: "Techroad",
          role: "DevOps Developer",
          period: "May 2022 – Jun 2022",
          location: "Remote",
          current: false,
          highlights: [
            "Researched AWS Amplify Studio to generate web components for existing sites",
            "Integrated Slack API to forward form submissions directly to Slack",
          ],
        },
      ],
    }),

    // ── Education ────────────────────────────────────────────
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "institution", type: "string", title: "Institution" },
            { name: "degree", type: "string", title: "Degree" },
            { name: "period", type: "string", title: "Period" },
            { name: "location", type: "string", title: "Location" },
          ],
          preview: { select: { title: "institution", subtitle: "degree" } },
        },
      ],
      initialValue: [
        {
          institution: "Cebu Technological University – Argao Campus",
          degree: "BS Information Technology",
          period: "2021 – 2025",
          location: "Argao, Cebu",
        },
      ],
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "title" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Profile", subtitle };
    },
  },
});
