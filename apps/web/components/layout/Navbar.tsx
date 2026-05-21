"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { features } from "@/lib/features";

const allNavLinks = [
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog", feature: "blog" as const },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];

const navLinks = allNavLinks.filter((link) => !link.feature || features[link.feature]);

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "border-paper-rule bg-paper/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm"
          : "border-surface-border bg-bg/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md"
      }
    >
      <nav className="container-custom flex h-16 items-center justify-between">
        <Link
          href="/"
          className={
            isHome
              ? "font-spec text-ink hover:text-signal text-xl font-medium transition-colors"
              : "font-display text-text-primary hover:text-accent text-xl transition-colors duration-200"
          }
        >
          {isHome ? (
            <>
              <span className="text-signal">M</span>ichael
              <span className="text-ink-3">.</span>
            </>
          ) : (
            <>
              <span className="text-accent">M</span>ichael<span className="text-text-muted">.</span>
            </>
          )}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isHome
                  ? "font-spec text-ink-2 hover:text-signal group relative text-sm transition-colors"
                  : "text-text-secondary hover:text-text-primary group relative text-sm transition-colors duration-200"
              }
            >
              {label}
              <span
                className={
                  isHome
                    ? "bg-signal absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full"
                    : "bg-accent absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full"
                }
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {features.contact && !isHome && (
            <Link href="/contact" className="btn-primary hidden px-4 py-2 text-sm md:inline-flex">
              Hire Me
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}

          <button
            className={
              isHome
                ? "text-ink-2 hover:text-signal p-2 transition-colors md:hidden"
                : "text-text-secondary hover:text-text-primary p-2 transition-colors md:hidden"
            }
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex w-5 flex-col gap-1">
              <span
                className={`h-px bg-current transition-all duration-200 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all duration-200 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className={
            isHome
              ? "border-paper-rule bg-paper-tint border-b md:hidden"
              : "bg-bg-secondary border-surface-border border-b md:hidden"
          }
        >
          <div className="container-custom flex flex-col gap-4 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  isHome
                    ? "font-spec text-ink-2 hover:text-signal py-1 text-sm transition-colors"
                    : "text-text-secondary hover:text-accent py-1 text-sm transition-colors"
                }
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            {features.contact && !isHome && (
              <Link
                href="/contact"
                className="btn-primary justify-center text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Hire Me
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
