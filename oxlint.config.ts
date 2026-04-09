import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
  },
  rules: {
    "no-unused-vars": "warn",
  },
  ignorePatterns: ["node_modules", ".next", "dist", ".turbo", "**/next-env.d.ts"],
  settings: {
    next: {
      rootDir: "apps/web/",
    },
    react: {
      linkComponents: [{ name: "Link", attributes: ["href"] }],
    },
  },
});
