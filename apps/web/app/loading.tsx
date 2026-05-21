export default function Loading() {
  return (
    <main className="flex min-h-screen items-center pt-[clamp(6rem,10vw,9rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto w-full max-w-7xl px-[clamp(1.5rem,4vw,3rem)]">
        <div className="border-paper-rule border-b pb-3">
          <dl className="font-spec-mono text-ink-3 flex items-baseline gap-x-8 text-[11px] tracking-[0.04em] uppercase">
            <div className="flex items-baseline gap-2">
              <dt className="select-none">Status</dt>
              <dd className="text-signal inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="bg-signal inline-block size-1.5 animate-pulse rounded-full"
                />
                Loading
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
