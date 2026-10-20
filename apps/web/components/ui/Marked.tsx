import { Fragment } from "react";

/**
 * Renders the copy markup used in Sanity text fields:
 *   ==text==  joke highlighter
 *   **text**  strong (styled by `strongClassName`)
 *   _text_    italic aside (styled by `emClassName`)
 */
const TOKEN = /(==.+?==|\*\*.+?\*\*|_.+?_)/g;

export function Marked({
  text,
  strongClassName = "font-semibold text-ink",
  emClassName = "italic",
}: {
  text: string;
  strongClassName?: string;
  emClassName?: string;
}) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith("==") && part.endsWith("==") && part.length > 4)
          return (
            <span key={i} className="highlight">
              {part.slice(2, -2)}
            </span>
          );
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
          return (
            <span key={i} className={strongClassName}>
              {part.slice(2, -2)}
            </span>
          );
        if (part.startsWith("_") && part.endsWith("_") && part.length > 2)
          return (
            <span key={i} className={emClassName}>
              {part.slice(1, -1)}
            </span>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** "**3 spots open** this quarter…" with the bold part mango-underlined. */
export function AvailabilityLine({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`text-body text-[14px] md:text-[15px] ${className}`}>
      <Marked text={text} strongClassName="text-ink border-mango border-b-2 font-semibold" />
    </p>
  );
}
