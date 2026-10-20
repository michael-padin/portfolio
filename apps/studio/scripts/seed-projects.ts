/**
 * Writes the projects from @portfolio/sanity-schemas/seed into Sanity.
 *
 *   pnpm --filter @portfolio/studio seed:projects            # dry run: prints the plan
 *   pnpm --filter @portfolio/studio seed:projects -- --apply # writes
 *
 * Projects are matched by slug. Existing ones get their copy fields replaced;
 * cover images, OG images, rich-text solutions and results are left alone.
 * New projects are created as published documents.
 */
import { getCliClient } from "sanity/cli";
import { SEED_PROJECTS } from "@portfolio/sanity-schemas/seed";

const apply = process.argv.includes("--apply");
const client = getCliClient({ apiVersion: "2025-01-01" });

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

async function main() {
  const existing = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current }`,
  );
  const idBySlug = new Map(existing.map((d) => [d.slug, d._id]));

  const tx = client.transaction();
  for (const { slug, highlights, localAngle, ...fields } of SEED_PROJECTS) {
    const copy = {
      ...fields,
      highlights: withKeys(highlights, "h"),
      ...(localAngle && { localAngle }),
    };
    const id = idBySlug.get(slug);
    if (id) {
      console.log(`update  ${slug}  (${id})`);
      tx.patch(id, (p) => p.set(copy));
    } else {
      const newId = `project-${slug}`;
      console.log(`create  ${slug}  (${newId})`);
      tx.createIfNotExists({
        _id: newId,
        _type: "project",
        slug: { _type: "slug", current: slug },
        ...copy,
      });
    }
  }

  const untouched = existing.filter((d) => !SEED_PROJECTS.some((p) => p.slug === d.slug));
  for (const d of untouched) console.log(`keep    ${d.slug}  (${d._id}, not in seed)`);

  if (apply) {
    await tx.commit();
    console.log("Done.");
  } else {
    console.log("\nDry run. Re-run with --apply to write.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
