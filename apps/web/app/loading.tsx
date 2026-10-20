export default function Loading() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center" role="status">
      <span className="flex items-center gap-2.5 text-[15px] font-medium">
        <span aria-hidden className="bg-mango size-2.5 animate-pulse rounded-full" />
        Loading…
      </span>
    </div>
  );
}
