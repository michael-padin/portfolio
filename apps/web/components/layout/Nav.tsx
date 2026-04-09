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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(9,12,16,0.92)] backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-main h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          mp<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm rounded-md transition-colors underline-accent ${
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
        <div className="hidden md:flex items-center gap-3">
          {/* Visitor mode toggle */}
          <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 text-xs">
            <button
              onClick={() => setMode("client")}
              className={`px-3 py-1 rounded-full transition-all ${
                mode === "client"
                  ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Hiring?
            </button>
            <button
              onClick={() => setMode("employer")}
              className={`px-3 py-1 rounded-full transition-all ${
                mode === "employer"
                  ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Recruiting?
            </button>
          </div>
          <Link href="/contact" className="btn-primary text-sm py-2 px-4">
            Let&apos;s talk
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[var(--text-secondary)] p-2"
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
        <div className="md:hidden bg-[var(--surface)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-2 transition-colors ${
                pathname === link.href ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => setMode("client")}
              className={`flex-1 py-2 text-xs rounded-full ${mode === "client" ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "border border-[var(--border)] text-[var(--text-muted)]"}`}
            >
              Hiring a dev?
            </button>
            <button
              onClick={() => setMode("employer")}
              className={`flex-1 py-2 text-xs rounded-full ${mode === "employer" ? "bg-[var(--accent)] text-[var(--background)] font-semibold" : "border border-[var(--border)] text-[var(--text-muted)]"}`}
            >
              Recruiting?
            </button>
          </div>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-sm text-center"
          >
            Let&apos;s talk
          </Link>
        </div>
      )}
    </header>
  );
}
