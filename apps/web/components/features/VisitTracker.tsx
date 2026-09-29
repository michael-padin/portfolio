"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackLeave } from "@/lib/track";

/**
 * Feeds page views and meaningful clicks to /api/notice → Telegram. Renders nothing.
 *
 * Links that leave the site (Cal.com, mailto:, GitHub, résumé…) are picked up
 * automatically. Anything else opts in with data-track="name".
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "pageview", path: pathname });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target instanceof Element ? e.target.closest("a[href], [data-track]") : null;
      if (!el) return;

      const label = el.getAttribute("data-track");
      const href = el instanceof HTMLAnchorElement ? el.href : undefined;
      // Same-site links are already reported by the page view they trigger.
      if (!label && (!href || new URL(href).origin === location.origin)) return;

      track({
        type: "click",
        path: location.pathname,
        label: (label ?? el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
        href: href?.slice(0, 500),
        area: el.closest("footer") ? "footer" : undefined,
      });
    }

    // Capture phase reads the element before React re-renders it (e.g. the chat toggle).
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    function onHidden() {
      if (document.visibilityState === "hidden") trackLeave();
    }
    // visibilitychange covers tab switches and mobile backgrounding; pagehide
    // catches desktop unloads where it can be skipped.
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", trackLeave);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", trackLeave);
    };
  }, []);

  return null;
}
