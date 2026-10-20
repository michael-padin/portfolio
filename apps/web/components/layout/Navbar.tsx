"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { features } from "@/lib/features";
import { Lockup } from "@/components/brand/Logo";

const allNavLinks = [
  { href: "/#services", label: "What I build" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog", feature: "blog" as const },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];

export const navLinks = allNavLinks.filter((link) => !link.feature || features[link.feature]);

export function Navbar({ bookingUrl }: { bookingUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="bg-paper relative z-40">
      <nav className="container-page flex items-center justify-between py-[18px] md:py-[22px]">
        <Link href="/" aria-label="Michael Padin, home" className="shrink-0">
          <span className="hidden md:block">
            <Lockup />
          </span>
          <span className="md:hidden">
            <Lockup compact tagline={false} />
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`border-b-2 py-1 transition-colors duration-200 ${
                isActive(href) ? "border-mango" : "hover:border-mango border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="book-call-nav"
              className="btn btn-dark px-5 py-[11px] text-[15px]"
            >
              Book a free call
            </a>
          )}
        </div>

        <button
          type="button"
          className="-mr-2.5 flex size-11 items-center justify-center lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="flex w-[22px] flex-col gap-[5px]">
            <span
              className={`h-0.5 bg-current transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 bg-current transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="bg-paper border-rule border-t lg:hidden">
          <div className="container-page flex flex-col py-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={isActive(href) ? "page" : undefined}
                className="font-heading border-rule border-b py-3.5 text-[20px]"
              >
                {label}
              </Link>
            ))}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="book-call-nav"
                className="btn btn-primary mt-5 mb-3 w-full"
              >
                Book a free 30-min call
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
