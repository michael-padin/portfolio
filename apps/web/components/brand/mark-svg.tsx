/**
 * The mark as a plain <svg> element for next/og ImageResponse (Satori),
 * which can't read CSS variables. Colours are the token hex values.
 */
export const INK = "#251a15";
export const PAPER = "#fbf6ee";
export const MANGO = "#eb883b";

export function MarkSvg({
  size,
  stroke = INK,
  bowl = MANGO,
}: {
  size: number;
  stroke?: string;
  bowl?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
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
