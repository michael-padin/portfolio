"use client";

export function ProjectLink({ liveUrl, name }: { liveUrl: string; name: string }) {
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        window.open(liveUrl, "_blank");
      }}
      className="text-text-muted hover:text-text-primary transition-colors"
    >
      {name}
    </span>
  );
}
