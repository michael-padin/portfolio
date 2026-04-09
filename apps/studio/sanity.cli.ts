import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in apps/studio/.env or your hosting provider.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
