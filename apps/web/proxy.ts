import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy — runs before every matched request (Node.js runtime).
 *
 * 1. Extracts the real client IP from Cloudflare headers
 * 2. Applies a sliding-window rate limit on API routes
 * 3. Blocks requests with suspicious patterns
 */

// ── Rate limit config ───────────────────────────────────────────
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMITS: Record<string, number> = {
  "/api/chat": 10, // 10 req/min
  "/api/contact": 5, // 5 req/min
};

// In-memory store (per edge instance — Cloudflare handles the real protection)
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// ── Helpers ─────────────────────────────────────────────────────
function getClientIp(req: NextRequest): string {
  // Cloudflare sets this header with the real client IP
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Only process API routes ───────────────────────────────────
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = getClientIp(req);

  // ── Block obviously bad requests ──────────────────────────────
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ua.length < 5) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Rate limit per route ──────────────────────────────────────
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) {
      const key = `${ip}:${route}`;
      if (isRateLimited(key, limit)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": "60" },
          },
        );
      }
      break;
    }
  }

  // ── Pass real IP downstream so API routes can use it ──────────
  const headers = new Headers(req.headers);
  headers.set("x-real-ip", ip);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: "/api/:path*",
};
