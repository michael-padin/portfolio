"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { features } from "@/lib/features";

const allNavLinks = [
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog", feature: "blog" as const },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];

const navLinks = allNavLinks.filter((link) => !link.feature || features[link.feature]);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 border-surface-border border-b shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-text-primary hover:text-accent text-xl transition-colors duration-200"
        >
          <span className="text-accent">M</span>ichael<span className="text-text-muted">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-text-secondary hover:text-text-primary group relative text-sm transition-colors duration-200"
            >
              {label}
              <span className="bg-accent absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          {features.contact && (
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
            className="text-text-secondary hover:text-text-primary p-2 transition-colors md:hidden"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-bg-secondary border-surface-border border-b md:hidden">
          <div className="container-custom flex flex-col gap-4 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-text-secondary hover:text-accent py-1 text-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            {features.contact && (
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
