import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "object",
          name: "codeBlock",
          title: "Code Block",
          fields: [
            { name: "language", type: "string", title: "Language" },
            { name: "code", type: "text", title: "Code" },
            { name: "filename", type: "string", title: "Filename" },
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),

    // ── SEO ──────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title (optional)",
      description: "Overrides the meta title. Falls back to the post title.",
      type: "string",
      validation: (rule) => rule.max(70),
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description (optional)",
      description: "Overrides meta description. Falls back to excerpt. Keep under 160 chars.",
      type: "string",
      validation: (rule) => rule.max(160),
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "OG / Social Share Image (optional)",
      description: "1200x630 — overrides cover image for social shares.",
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
    select: { title: "title", subtitle: "excerpt", media: "coverImage" },
  },
});
