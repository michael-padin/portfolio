/** Striped placeholder for an image that hasn't been supplied yet. */
export function ImageSlot({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`image-slot flex h-full w-full items-center justify-center ${className}`}
      role="img"
      aria-label={label ?? "Image coming soon"}
    >
      {label && (
        <span className="text-subtle bg-paper rounded-md px-2 py-1 font-mono text-[11px]">
          {label}
        </span>
      )}
    </div>
  );
}
