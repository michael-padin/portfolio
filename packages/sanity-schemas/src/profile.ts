import { defineArrayMember, defineField, defineType } from "sanity";

// Copy fields support a tiny inline markup, rendered by the site:
//   ==text==  joke highlighter (use sparingly; the design allows 4 on the whole site)
//   **text**  emphasis (mango underline in the availability line)
//   _text_    italic aside
const MARKUP_HINT =
  "Markup: ==highlight==, **bold**, _italic_. Leave empty to use the built-in copy.";

const DEPRECATED = { reason: "From the employer-facing site. No longer shown." };

export const profileSchema = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "home", title: "Home page" },
    { name: "about", title: "About page" },
    { name: "seo", title: "SEO" },
    { name: "legacy", title: "Legacy" },
  ],
  fields: [
    // ── Identity ─────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      initialValue: "Michael Padin",
      validation: (rule) => rule.required(),
      group: "identity",
    }),
    defineField({
      name: "title",
      title: "Professional Title",
      type: "string",
      initialValue: "Custom software developer",
      validation: (rule) => rule.required(),
      group: "identity",
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "e.g. Cebu, Philippines",
      type: "string",
      initialValue: "Cebu, Philippines",
      group: "identity",
    }),
    defineField({
      name: "timezone",
      title: "Timezone",
      type: "string",
      initialValue: "UTC+8",
      group: "identity",
    }),
    defineField({
      name: "photo",
      title: "Portrait",
      description: "Used on the home page (circle) and About page (arched frame).",
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
      group: "identity",
    }),
    defineField({
      name: "availabilityLine",
      title: "Availability line",
      description: `Shown above the hero and on Contact. e.g. "**3 spots open** this quarter for Cebu businesses". ${MARKUP_HINT}`,
      type: "string",
      group: "identity",
    }),

    // ── Contact & Social ─────────────────────────────────────
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      initialValue: "hello@michaelpadin.com",
      validation: (rule) => rule.required().email(),
      group: "identity",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL (Cal.com, Calendly, etc.)",
      description: "Every “Book a free call” button links here.",
      type: "url",
      group: "identity",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
      group: "identity",
    }),
    defineField({
      name: "messengerUrl",
      title: "Messenger URL",
      description: "e.g. https://m.me/yourpage",
      type: "url",
      group: "identity",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      initialValue: "https://github.com/michael-padin",
      group: "identity",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      initialValue: "https://linkedin.com/in/michael-padin",
      group: "identity",
    }),
    defineField({
      name: "twitterUrl",
      title: "Twitter / X URL",
      type: "url",
      group: "identity",
    }),
    defineField({
      name: "websiteUrl",
      title: "Site URL",
      type: "url",
      initialValue: "https://michaelpadin.com",
      group: "identity",
    }),

    // ── Home page ────────────────────────────────────────────
    defineField({
      name: "heroTagline",
      title: "Hero headline",
      type: "string",
      validation: (rule) => rule.max(90),
      group: "home",
    }),
    defineField({
      name: "heroSub",
      title: "Hero paragraph",
      description: MARKUP_HINT,
      type: "text",
      rows: 3,
      group: "home",
    }),
    defineField({
      name: "heroAside",
      title: "Hero small print",
      description: "Line under the hero buttons.",
      type: "string",
      group: "home",
    }),
    defineField({
      name: "pains",
      title: "“Still running on…” items",
      description: "Struck-through habits. The joke renders as an italic aside.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "text", type: "string", title: "Text" },
            { name: "joke", type: "string", title: "Joke (optional)" },
          ],
          preview: { select: { title: "text", subtitle: "joke" } },
        }),
      ],
      validation: (rule) => rule.max(6),
      group: "home",
    }),
    defineField({
      name: "services",
      title: "What I build",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "kind",
              type: "string",
              title: "Kind",
              options: { list: ["System", "Integration", "Add-on", "Ongoing"] },
            },
            { name: "name", type: "string", title: "Name" },
            { name: "description", type: "text", title: "Description", rows: 2 },
            {
              name: "priceRange",
              type: "string",
              title: "Usual price range",
              description: "Only shown when NEXT_PUBLIC_SHOW_PRICES=true. e.g. ₱80k–150k",
            },
          ],
          preview: { select: { title: "name", subtitle: "kind" } },
        }),
      ],
      group: "home",
    }),
    defineField({
      name: "steps",
      title: "How it works",
      description: "3 or 4 steps. Mark at most one punchline as highlighted.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Description", rows: 2 },
            { name: "joke", type: "string", title: "Punchline" },
            {
              name: "highlight",
              type: "boolean",
              title: "Highlight the punchline?",
              initialValue: false,
            },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.min(3).max(4),
      group: "home",
    }),
    defineField({
      name: "foundingOffer",
      title: "Founding client offer",
      description: "Also needs NEXT_PUBLIC_ENABLE_FOUNDING_OFFER=true on the site.",
      type: "object",
      fields: [
        { name: "enabled", type: "boolean", title: "Show the offer", initialValue: true },
        { name: "spots", type: "number", title: "Spots", initialValue: 3 },
        { name: "discount", type: "string", title: "Discount", description: "e.g. 20%" },
        { name: "body", type: "text", title: "Body", rows: 3, description: MARKUP_HINT },
      ],
      group: "home",
    }),

    // ── About page ───────────────────────────────────────────
    defineField({
      name: "aboutIntro",
      title: "About intro paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      validation: (rule) => rule.max(3),
      group: "about",
    }),
    defineField({
      name: "workPrinciples",
      title: "How I work",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Description", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.max(4),
      group: "about",
    }),
    defineField({
      name: "terminalSkills",
      title: "Tools I use",
      description: "Shown as one line on the About page.",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({
      name: "bioShort",
      title: "Short Bio",
      description: "1–2 sentences used in previews and the chatbot.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(300),
      group: "about",
    }),
    defineField({
      name: "experience",
      title: "Work Experience",
      type: "array",
      of: [
        defineArrayMember({
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
              description: "e.g. Brisbane (remote)",
            },
            { name: "current", type: "boolean", title: "Current role?", initialValue: false },
            { name: "companyUrl", type: "url", title: "Company URL (optional)" },
            {
              name: "outcome",
              type: "string",
              title: "Outcome",
              description: "One plain-language line shown on the About page.",
            },
            {
              name: "highlights",
              type: "array",
              title: "Key Highlights",
              of: [{ type: "string" }],
              description: "Detail for the chatbot. Not shown on the site.",
            },
          ],
          preview: { select: { title: "company", subtitle: "role" } },
        }),
      ],
      group: "about",
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "institution", type: "string", title: "Institution" },
            { name: "degree", type: "string", title: "Degree" },
            { name: "period", type: "string", title: "Period" },
            { name: "location", type: "string", title: "Location" },
          ],
          preview: { select: { title: "institution", subtitle: "degree" } },
        }),
      ],
      group: "about",
    }),
    defineField({
      name: "resume",
      title: "Resume / CV",
      description: "PDF. Linked from the About page and footer.",
      type: "file",
      options: { accept: ".pdf" },
      group: "about",
    }),
    defineField({
      name: "resumeLastUpdated",
      title: "Resume Last Updated",
      type: "date",
      group: "about",
    }),

    // ── SEO ──────────────────────────────────────────────────
    defineField({
      name: "seoDescription",
      title: "SEO Meta Description",
      description: "Keep under 160 chars",
      type: "string",
      validation: (rule) => rule.max(160),
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      description: "Optional 1200x630 override. Leave empty to use the generated one.",
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

    // ── Legacy (employer-facing site) ────────────────────────
    defineField({
      name: "availableForFreelance",
      title: "Available for Freelance?",
      type: "boolean",
      group: "legacy",
      deprecated: DEPRECATED,
    }),
    defineField({
      name: "availableForFullTime",
      title: "Available for Full-Time Remote?",
      type: "boolean",
      group: "legacy",
      deprecated: DEPRECATED,
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability Note",
      type: "string",
      group: "legacy",
      deprecated: { reason: "Replaced by “Availability line”." },
    }),
    defineField({
      name: "heroTaglineClient",
      title: "Hero — Client Tagline",
      type: "string",
      group: "legacy",
      deprecated: { reason: "Replaced by “Hero headline”." },
    }),
    defineField({
      name: "heroSubClient",
      title: "Hero — Client Sub-copy",
      type: "text",
      group: "legacy",
      deprecated: { reason: "Replaced by “Hero paragraph”." },
    }),
    defineField({
      name: "heroTaglineEmployer",
      title: "Hero — Employer Tagline",
      type: "string",
      group: "legacy",
      deprecated: DEPRECATED,
    }),
    defineField({
      name: "heroSubEmployer",
      title: "Hero — Employer Sub-copy",
      type: "text",
      group: "legacy",
      deprecated: DEPRECATED,
    }),
    defineField({
      name: "heroStats",
      title: "Hero Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value" },
            { name: "label", type: "string", title: "Label" },
          ],
        }),
      ],
      group: "legacy",
      deprecated: DEPRECATED,
    }),
    defineField({
      name: "values",
      title: '"How I Work" cards (emoji)',
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "emoji", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Description", rows: 2 },
          ],
        }),
      ],
      group: "legacy",
      deprecated: { reason: "Replaced by “How I work” on the About page group." },
    }),
    defineField({
      name: "skillGroups",
      title: "Skill Groups",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "category", type: "string", title: "Category" },
            { name: "skills", type: "array", title: "Skills", of: [{ type: "string" }] },
          ],
        }),
      ],
      group: "legacy",
      deprecated: { reason: "Replaced by “Tools I use”." },
    }),
    defineField({
      name: "bio",
      title: "Full Bio (Rich Text)",
      type: "array",
      of: [{ type: "block" }],
      group: "legacy",
      deprecated: { reason: "Replaced by “About intro paragraphs”." },
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "title" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Profile", subtitle };
    },
  },
});
