import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { profileSchema, projectSchema, postSchema } from "@portfolio/sanity-schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "michael-padin-portfolio",
  title: "Michael Padin — Portfolio CMS",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Profile is a singleton — only one document
            S.listItem()
              .title("Profile")
              .id("profile")
              .child(
                S.document()
                  .schemaType("profile")
                  .documentId("singleton-profile")
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("post").title("Blog Posts"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: [profileSchema, projectSchema, postSchema],
  },
});
