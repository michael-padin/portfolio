import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { urlFor, type SanityImage } from "@/lib/sanity";

type Comparison = {
  leftTitle?: string;
  rightTitle?: string;
  rows?: { _key: string; left?: string; right?: string }[];
};

function ComparisonTable({ value }: { value: Comparison }) {
  return (
    <div className="border-rule overflow-hidden rounded-[18px] border text-[15px] leading-normal md:text-[16px]">
      <div className="bg-ink text-paper grid grid-cols-2 font-semibold">
        <span className="px-3.5 py-3 md:px-[18px] md:py-3.5">{value.leftTitle}</span>
        <span className="bg-mango text-ink px-3.5 py-3 md:px-[18px] md:py-3.5">
          {value.rightTitle}
        </span>
      </div>
      {value.rows?.map((r) => (
        <div key={r._key} className="border-rule grid grid-cols-2 border-t">
          <span className="px-3.5 py-3 md:px-[18px] md:py-3.5">{r.left}</span>
          <span className="bg-[oklch(97%_0.02_70)] px-3.5 py-3 md:px-[18px] md:py-3.5">
            {r.right}
          </span>
        </div>
      ))}
    </div>
  );
}

const components: PortableTextComponents = {
  types: {
    comparisonTable: ComparisonTable,
    image: ({ value }: { value: SanityImage }) => {
      const src = urlFor(value)?.width(1520).url();
      if (!src) return null;
      return (
        <figure>
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={1520}
            height={855}
            sizes="(min-width: 800px) 760px, 100vw"
            className="h-auto w-full"
          />
          {value.caption && (
            <figcaption className="text-subtle mt-2 text-[14px]">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }: { value: { code?: string; filename?: string } }) => (
      <div>
        {value.filename && (
          <div className="text-subtle mb-1.5 font-mono text-[12px]">{value.filename}</div>
        )}
        <pre>
          <code>{value.code}</code>
        </pre>
      </div>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
          {children}
        </a>
      );
    },
  },
};

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose-post">
      <PortableText value={value} components={components} />
    </div>
  );
}
