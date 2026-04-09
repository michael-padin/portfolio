import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID. Set it in apps/studio/.env or your hosting provider.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset:
      process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
