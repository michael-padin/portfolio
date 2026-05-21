"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 flex flex-wrap items-center gap-x-8 gap-y-1 text-[11px] tracking-[0.04em] uppercase">
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Document</dt>
              <dd className="text-ink normal-case">Error</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Code</dt>
              <dd className="text-signal tabular-nums">HTTP 500</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Status</dt>
              <dd className="text-ink">Unexpected fault</dd>
            </div>
          </dl>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <h1 className="font-spec text-ink max-w-[18ch] text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-medium tracking-[-0.035em]">
            Something faulted on the way in.
          </h1>
          <p className="font-spec text-ink-2 mt-6 max-w-[58ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.55]">
            An unexpected error occurred while rendering this page. The fault has been logged; try
            again, or write to me if it persists.
          </p>
        </div>

        <div className="border-paper-rule mt-[clamp(3rem,5vw,4rem)] flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t pt-6 text-[14px]">
          <button
            onClick={reset}
            className="font-spec text-ink hover:text-signal border-ink hover:border-signal border-b pb-px font-medium transition-colors"
          >
            ↻ Try again
          </button>
          <a
            href="/"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            ← Back to /
          </a>
          <a
            href="mailto:hello@michaelpadin.com"
            className="font-spec-mono text-ink-3 hover:text-signal text-[11px] tracking-[0.04em] uppercase transition-colors"
          >
            Report fault
          </a>
        </div>
      </div>
    </main>
  );
}
