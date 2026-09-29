import "server-only";

/**
 * Visitor context for Telegram alerts — location, local time, device, bot check.
 *
 * The site is served straight from Vercel (Cloudflare is DNS-only), so the
 * x-vercel-ip-* headers describe the real visitor and are set by Vercel's edge,
 * not the client.
 */

const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|monitor|curl|wget|python|axios|node-fetch/i;

type Rules = [RegExp, string][];

const OS: Rules = [
  [/iPhone/, "iPhone"],
  [/iPad/, "iPad"],
  [/Android/, "Android"],
  [/Mac OS X/, "Mac"],
  [/Windows/, "Windows"],
  [/CrOS/, "ChromeOS"],
  [/Linux/, "Linux"],
];

// In-app browsers usually strip the referrer, so the app name is the best source hint we get.
const IN_APP: Rules = [
  [/LinkedInApp/, "LinkedIn app"],
  [/FBAN|FBAV/, "Facebook app"],
  [/Instagram/, "Instagram app"],
];

// Order matters: Edge, Opera and Samsung UAs also contain "Chrome" and "Safari".
const BROWSER: Rules = [
  [/Edg\//, "Edge"],
  [/OPR\//, "Opera"],
  [/SamsungBrowser/, "Samsung Internet"],
  [/Firefox|FxiOS/, "Firefox"],
  [/Chrome|CriOS/, "Chrome"],
  [/Safari/, "Safari"],
];

function firstMatch(rules: Rules, ua: string): string | undefined {
  return rules.find(([pattern]) => pattern.test(ua))?.[1];
}

export function isBot(ua: string): boolean {
  return BOT_UA.test(ua);
}

/** "iPhone Safari", "Windows Edge", "Android · LinkedIn app". */
export function describeDevice(ua: string): string {
  const os = firstMatch(OS, ua) ?? "Unknown device";
  const app = firstMatch(IN_APP, ua);
  return app ? `${os} · ${app}` : `${os} ${firstMatch(BROWSER, ua) ?? "browser"}`;
}

function flag(country: string): string {
  if (!/^[A-Z]{2}$/.test(country)) return "🌐";
  return String.fromCodePoint(...[...country].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

/** "🇦🇺 Brisbane, QLD, AU" — region is skipped when it's a numeric code (e.g. PH "07"). */
export function describePlace(headers: Headers): string {
  const country = headers.get("x-vercel-ip-country") ?? "";
  const region = headers.get("x-vercel-ip-country-region");
  const rawCity = headers.get("x-vercel-ip-city");

  let city = rawCity;
  try {
    city = rawCity && decodeURIComponent(rawCity); // RFC 3986 encoded
  } catch {
    // keep the raw value
  }

  const parts = [city, region && !/^\d+$/.test(region) ? region : null, country].filter(Boolean);
  return `${flag(country)} ${parts.length ? parts.join(", ") : "Unknown location"}`;
}

/** Visitor's wall-clock time, e.g. "9:14 PM" — handy for knowing when to reply. */
export function localTime(headers: Headers): string | null {
  const timeZone = headers.get("x-vercel-ip-timezone");
  if (!timeZone) return null;
  try {
    return new Date().toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
  } catch {
    return null;
  }
}
