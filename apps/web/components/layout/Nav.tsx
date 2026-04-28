"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"client" | "employer">("client");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Broadcast mode via custom event so other components can react
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("visitor-mode", { detail: mode }));
    localStorage.setItem("visitor-mode", mode);
  }, [mode]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[rgba(9,12,16,0.92)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-main flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
        >
          mp<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`underline-accent rounded-md px-4 py-2 text-sm transition-colors ${
                pathname === link.href
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: mode toggle + CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Visitor mode toggle */}
          <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-xs">
            <button
              onClick={() => setMode("client")}
              className={`rounded-full px-3 py-1 transition-all ${
                mode === "client"
                  ? "bg-[var(--accent)] font-semibold text-[var(--background)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Hiring?
            </button>
            <button
              onClick={() => setMode("employer")}
              className={`rounded-full px-3 py-1 transition-all ${
                mode === "employer"
                  ? "bg-[var(--accent)] font-semibold text-[var(--background)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Recruiting?
            </button>
          </div>
          <Link href="/contact" className="btn-primary px-4 py-2 text-sm">
            Let&apos;s talk
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-[var(--text-secondary)] md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line
                  x1="4"
                  y1="4"
                  x2="18"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="18"
                  y1="4"
                  x2="4"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <line
                  x1="3"
                  y1="7"
                  x2="19"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="17"
                  x2="19"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm transition-colors ${
                pathname === link.href ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 border-t border-[var(--border)] pt-2">
            <button
              onClick={() => setMode("client")}
              className={`flex-1 rounded-full py-2 text-xs ${mode === "client" ? "bg-[var(--accent)] font-semibold text-[var(--background)]" : "border border-[var(--border)] text-[var(--text-muted)]"}`}
            >
              Hiring a dev?
            </button>
            <button
              onClick={() => setMode("employer")}
              className={`flex-1 rounded-full py-2 text-xs ${mode === "employer" ? "bg-[var(--accent)] font-semibold text-[var(--background)]" : "border border-[var(--border)] text-[var(--text-muted)]"}`}
            >
              Recruiting?
            </button>
          </div>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-center text-sm"
          >
            Let&apos;s talk
          </Link>
        </div>
      )}
    </header>
  );
}
