import Link from "next/link";
import type { Metadata } from "next";
import { Mark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:pt-[120px] md:pb-[140px]">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-[40px] leading-[1.02] tracking-[-0.02em] md:mt-4 md:text-[72px]">
          This page took the day off.
        </h1>
        <p className="text-muted mt-4 max-w-[38ch] text-[17px] leading-[1.55] md:mt-5 md:text-[19px]">
          The link may be old, or the page has moved. Here&apos;s where you can go instead.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
          <Link href="/" className="btn btn-dark">
            Back to home
          </Link>
          <Link href="/projects" className="btn btn-outline">
            See my work
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="bg-tint flex size-[240px] items-center justify-center rounded-full md:size-[360px]">
          <Mark size={150} bowl="oklch(85% 0.03 70)" className="md:size-[200px]" />
        </div>
      </div>
    </section>
  );
}
