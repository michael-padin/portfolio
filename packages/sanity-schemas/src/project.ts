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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "One-line outcome: e.g. 'Increased first-time retention by 8%'",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
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
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "coverImage" },
  },
});
