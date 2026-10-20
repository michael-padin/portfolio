"use client";
import { Mark } from "@/components/brand/Logo";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:pt-[120px] md:pb-[140px]">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-[40px] leading-[1.02] tracking-[-0.02em] md:mt-4 md:text-[72px]">
          This page tripped over its own cable.
        </h1>
        <p className="text-muted mt-4 max-w-[38ch] text-[17px] leading-[1.55] md:mt-5 md:text-[19px]">
          It&apos;s been logged and I&apos;ll look into it. Try again, or head back home.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
          <button type="button" onClick={reset} className="btn btn-dark">
            Try again
          </button>
          <a href="/" className="btn btn-outline">
            Back to home
          </a>
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
