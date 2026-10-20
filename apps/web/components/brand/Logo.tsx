/**
 * The mp ligature: the m's last stroke drops down to become the p,
 * and the bowl is mango. Geometry matches assets/mp-mark.svg.
 */
export function Mark({
  size = 34,
  stroke = "var(--color-ink)",
  bowl = "var(--color-mango)",
  className,
  title,
}: {
  size?: number;
  stroke?: string;
  bowl?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d="M4.5 58V34a11.5 11.5 0 0 1 23 0v24M27.5 58V34a11.5 11.5 0 0 1 23 0"
        stroke={stroke}
        strokeWidth="9"
      />
      <rect x="46" y="40" width="9" height="38" fill={stroke} />
      <circle cx="63" cy="35" r="12.5" stroke={bowl} strokeWidth="9" />
    </svg>
  );
}

/** Mark + "MICHAEL PADIN /" wordmark, with the optional mono tagline. */
export function Lockup({
  tone = "light",
  tagline = true,
  compact = false,
}: {
  tone?: "light" | "dark";
  tagline?: boolean;
  compact?: boolean;
}) {
  const ink = tone === "dark" ? "var(--color-paper)" : "var(--color-ink)";
  return (
    <span className="flex items-center gap-2.5 md:gap-3" style={{ color: ink }}>
      <Mark size={compact ? 27 : 34} stroke={ink} />
      <span className="flex flex-col gap-[5px]">
        <span
          className={`leading-none font-extrabold tracking-[0.12em] whitespace-nowrap ${compact ? "text-[12px]" : "text-[15px]"}`}
        >
          MICHAEL PADIN <span className="text-mango tracking-normal">/</span>
        </span>
        {tagline && (
          <span
            className={`font-mono tracking-[0.2em] whitespace-nowrap opacity-70 ${compact ? "text-[7px]" : "text-[8px]"}`}
          >
            CUSTOM SOFTWARE · CEBU
          </span>
        )}
      </span>
    </span>
  );
}
