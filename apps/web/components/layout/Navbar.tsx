"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { features } from "@/lib/features";

const allNavLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog", feature: "blog" as const },
  { href: "/contact", label: "Contact", feature: "contact" as const },
];

const navLinks = allNavLinks.filter((link) => !link.feature || features[link.feature]);

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-paper-rule bg-paper/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-[clamp(1.5rem,4vw,3rem)]">
        <Link
          href="/"
          className="font-spec text-ink hover:text-signal inline-flex items-baseline text-[15px] font-medium transition-colors"
        >
          <span className="text-signal">M</span>
          <span>ichael Padin</span>
          <span className="text-ink-3 font-spec-mono ml-2 text-[11px] tracking-[0.04em] uppercase">
            / portfolio
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`font-spec group relative text-[13px] transition-colors ${
                  active ? "text-ink" : "text-ink-2 hover:text-signal"
                }`}
              >
                {label}
                <span
                  className={`bg-signal absolute -bottom-1 left-0 h-px transition-all duration-200 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <button
          className="text-ink-2 hover:text-signal p-2 transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex w-5 flex-col gap-1">
            <span
              className={`h-px bg-current transition-all duration-200 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px bg-current transition-all duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px bg-current transition-all duration-200 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {mobileOpen && (
        <div className="bg-paper-tint border-paper-rule border-b md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-[clamp(1.5rem,4vw,3rem)] py-4">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-spec py-1 text-sm transition-colors ${
                    active ? "text-ink" : "text-ink-2 hover:text-signal"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
