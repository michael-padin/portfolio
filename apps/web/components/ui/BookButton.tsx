import Link from "next/link";
import { features } from "@/lib/features";

/**
 * "Book a free call" button. Opens the booking page when there is one,
 * otherwise falls back to the contact page (or email when that's off).
 */
export function BookButton({
  bookingUrl,
  email,
  variant = "primary",
  className = "",
  track = "book-call",
  children = "Book a free 30-min call",
}: {
  bookingUrl?: string;
  email: string;
  variant?: "primary" | "dark";
  className?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const cls = `btn btn-${variant} ${className}`;
  if (bookingUrl)
    return (
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-track={track}
        className={cls}
      >
        {children}
      </a>
    );
  if (features.contact)
    return (
      <Link href="/contact" data-track={track} className={cls}>
        {children}
      </Link>
    );
  return (
    <a href={`mailto:${email}`} data-track={track} className={cls}>
      {children}
    </a>
  );
}
