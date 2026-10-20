/**
 * Writes the projects from @portfolio/sanity-schemas/seed into Sanity.
 *
 *   pnpm --filter @portfolio/studio seed:projects            # dry run: prints the plan
 *   pnpm --filter @portfolio/studio seed:projects -- --apply # writes
 *
 * Projects are matched by slug. Existing ones get their copy fields replaced;
 * OG images, rich-text solutions and results are left alone. Cover and gallery
 * screenshots (from apps/web/public) are uploaded only when the project has
 * none in Sanity yet, so images picked in the studio are never replaced.
 * New projects are created as published documents.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { SEED_PROJECTS, type SeedImage } from "@portfolio/sanity-schemas/seed";

const apply = process.argv.includes("--apply");
const client = getCliClient({ apiVersion: "2025-01-01" });
// `pnpm --filter @portfolio/studio` runs from apps/studio
const PUBLIC_DIR = path.resolve(process.cwd(), "../web/public");

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

async function uploadImage(img: SeedImage) {
  const file = path.join(PUBLIC_DIR, img.src);
  if (!existsSync(file)) throw new Error(`Missing image: ${file}`);
  // Sanity de-duplicates assets by content hash, so re-runs don't pile up copies
  const asset = await client.assets.upload("image", createReadStream(file), {
    filename: path.basename(file),
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
    alt: img.alt,
    ...(img.caption && { caption: img.caption }),
  };
}

type Existing = {
  _id: string;
  slug: string;
  hasCover: boolean;
  hasPhone: boolean;
  galleryCount: number;
};

async function main() {
  const existing = await client.fetch<Existing[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))]{
      _id, "slug": slug.current, "hasCover": defined(coverImage), "hasPhone": defined(coverPhone),
      "galleryCount": count(gallery)
    }`,
  );
  const bySlug = new Map(existing.map((d) => [d.slug, d]));

  const tx = client.transaction();
  for (const {
    slug,
    highlights,
    localAngle,
    cover,
    coverPhone,
    gallery,
    ...fields
  } of SEED_PROJECTS) {
    const doc = bySlug.get(slug);
    const needsCover = Boolean(cover) && !doc?.hasCover;
    const needsPhone = Boolean(coverPhone) && !doc?.hasPhone;
    const needsGallery = (gallery?.length ?? 0) > 0 && !doc?.galleryCount;

    const images: Record<string, unknown> = {};
    if (apply && needsCover && cover) images.coverImage = await uploadImage(cover);
    if (apply && needsPhone && coverPhone) images.coverPhone = await uploadImage(coverPhone);
    if (apply && needsGallery && gallery) {
      images.gallery = withKeys(await Promise.all(gallery.map(uploadImage)), "g");
    }

    const copy = {
      ...fields,
      highlights: withKeys(highlights, "h"),
      ...(localAngle && { localAngle }),
      ...images,
    };
    const note = [
      needsCover && "cover",
      needsPhone && "phone shot",
      needsGallery && `${gallery?.length} screenshots`,
    ]
      .filter(Boolean)
      .join(" + ");

    if (doc) {
      console.log(`update  ${slug}  (${doc._id})${note ? `  + ${note}` : ""}`);
      // A live link the seed leaves out is cleared, not kept from an older run
      tx.patch(doc._id, (p) => p.set(copy).unset(fields.liveUrl ? [] : ["liveUrl"]));
    } else {
      const newId = `project-${slug}`;
      console.log(`create  ${slug}  (${newId})${note ? `  + ${note}` : ""}`);
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
    console.log("\nDry run. Re-run with --apply to write (images upload on --apply only).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
