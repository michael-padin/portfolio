import { defineField, defineType } from "sanity";

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
      name: "tagline",
      title: "Tagline",
      description: "One-line outcome: e.g. 'Increased first-time retention by 8%'",
      type: "string",
      validation: (rule) => rule.required().max(120),
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
        list: ["Full-Stack App", "Frontend", "Backend", "DevOps", "Freelance"],
      },
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
    select: { title: "title", subtitle: "tagline", media: "coverImage" },
  },
});
