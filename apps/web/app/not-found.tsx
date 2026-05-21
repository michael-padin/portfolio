import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 flex flex-wrap items-center gap-x-8 gap-y-1 text-[11px] tracking-[0.04em] uppercase">
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Document</dt>
              <dd className="text-ink normal-case">Not found</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Code</dt>
              <dd className="text-signal tabular-nums">HTTP 404</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Status</dt>
              <dd className="text-ink">No such resource</dd>
            </div>
          </dl>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <h1 className="font-spec text-ink max-w-[18ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            That page is not in the catalog.
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
            The page you&apos;re looking for doesn&apos;t exist, has been moved, or was never
            indexed.
          </p>
        </div>

        <div className="border-paper-rule mt-[clamp(3rem,5vw,4rem)] flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t pt-6 text-[14px]">
          <Link
            href="/"
            className="font-spec text-ink hover:text-signal border-ink hover:border-signal border-b pb-px font-medium transition-colors"
          >
            ← Back to /
          </Link>
          <Link
            href="/projects"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </main>
  );
}
