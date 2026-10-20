import { defineArrayMember, defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      description:
        "Card title and case-study H1, e.g. 'Scheduling engine with travel time and zone matching'. Falls back to the title.",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "tagline",
      title: "Card description",
      description: "One or two plain-language sentences shown under the card title.",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      description: "Drives the filter chips on the Work page.",
      type: "string",
      options: {
        list: [
          { title: "Booking", value: "booking" },
          { title: "Web app", value: "web-app" },
          { title: "Website", value: "website" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      description: "e.g. 'Hermosa Glow · Carcar City, Cebu'",
      type: "string",
    }),
    defineField({
      name: "builtAt",
      title: "Built as",
      description: "Employer work is labelled “Built at …”, not as a client project.",
      type: "string",
      options: {
        list: [
          { title: "Client project", value: "client" },
          { title: "Employer work", value: "employer" },
        ],
        layout: "radio",
      },
      initialValue: "client",
    }),
    defineField({
      name: "role",
      title: "My role",
      type: "string",
    }),
    defineField({
      name: "typeLabel",
      title: "Type",
      description: "Case-study facts list, e.g. 'Booking & scheduling system'",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          description: "Describe the image for accessibility and SEO",
          type: "string",
          validation: (rule) => rule.max(200),
        },
        { name: "caption", title: "Caption", type: "string" },
      ],
    }),
    defineField({
      name: "coverMock",
      title: "Use a built-in mock instead of an image",
      description: "Shown when there's no cover image.",
      type: "string",
      options: {
        list: [
          { title: "Team calendar", value: "team-calendar" },
          { title: "Salon dashboard", value: "salon-dashboard" },
        ],
      },
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Full Stack App", "Frontend", "Backend", "DevOps", "Freelance"],
      },
      deprecated: { reason: "Replaced by “Kind”." },
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    // Case study fields
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "problem",
      title: "The Problem",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "solution",
      title: "The Solution",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "highlights",
      title: "What I built",
      description: "Numbered list on the case study. Takes priority over “The Solution”.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Body", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),
    defineField({
      name: "localAngle",
      title: "What this means for a Cebu business",
      type: "object",
      fields: [
        { name: "text", type: "text", title: "Text", rows: 3 },
        {
          name: "chips",
          type: "array",
          title: "Business types",
          of: [{ type: "string" }],
          description: "e.g. Aircon cleaning, Island tours, Salons & spas",
        },
      ],
    }),
    defineField({
      name: "results",
      title: "Results & Impact",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "metric", type: "string", title: "Metric" },
            { name: "value", type: "string", title: "Value" },
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    // ── SEO ──────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title (optional)",
      description: "Overrides the meta title. Falls back to the project title.",
      type: "string",
      validation: (rule) => rule.max(70),
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description (optional)",
      description: "Overrides meta description. Falls back to tagline. Keep under 160 chars.",
      type: "string",
      validation: (rule) => rule.max(160),
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "OG / Social Share Image (optional)",
      description: "1200x630 — overrides the cover image when shared on social.",
      type: "image",
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.max(200),
        },
      ],
      group: "seo",
    }),
  ],
  groups: [{ name: "seo", title: "SEO" }],
  preview: {
    select: { title: "title", subtitle: "headline", media: "coverImage" },
  },
});
