import Image from "next/image";
import { imageUrl, type Profile } from "@/lib/sanity";
import { ImageSlot } from "@/components/ui/ImageSlot";

const FACTS = [
  { title: "Image Edits", body: "Full stack dev, since 2023" },
  { title: "CTU Argao", body: "BS Information Technology" },
  { title: "Cebu, PH", body: "Replies within 24h" },
];

export function AboutTeaser({ profile }: { profile: Profile }) {
  const photo = imageUrl(profile.photo, 600, 600);
  return (
    <section className="container-page grid items-center justify-items-center gap-4 pb-11 text-center md:grid-cols-[300px_1fr] md:justify-items-start md:gap-14 md:pb-24 md:text-left">
      <div className="relative size-40 overflow-hidden rounded-full md:size-[300px]">
        {photo ? (
          <Image
            src={photo}
            alt={profile.photo?.alt ?? `${profile.name}, software developer in Cebu`}
            fill
            sizes="(min-width: 768px) 300px, 160px"
            className="object-cover"
          />
        ) : (
          <ImageSlot label="Portrait" />
        )}
      </div>
      <div>
        <h2 className="text-[26px] leading-[1.15] tracking-[-0.015em] md:text-[40px] md:leading-[1.1]">
          A local developer you can meet over coffee.
        </h2>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.55] text-[oklch(35%_0.02_50)] md:mt-[18px] md:text-[18px] md:leading-[1.6]">
          I&apos;m Michael. For the last three years I&apos;ve built production systems for
          companies in Australia and the US. Now I build the same kind of software for businesses
          here in Cebu. You deal with me directly, from the first call to launch day and after.
        </p>
        <dl className="text-muted mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[14px] md:mt-7 md:justify-start">
          {FACTS.map((f) => (
            <div key={f.title}>
              <dt className="text-ink text-[16px] font-semibold">{f.title}</dt>
              <dd>{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
