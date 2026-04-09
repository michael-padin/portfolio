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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
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
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "coverImage" },
  },
});
