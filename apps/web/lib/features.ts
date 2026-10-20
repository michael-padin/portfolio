/**
 * Feature flags — toggle features via environment variables.
 * All default to `false` unless explicitly set to "true".
 *
 * Set in .env or your hosting provider's environment settings:
 *   NEXT_PUBLIC_ENABLE_CHATBOT=true
 *   NEXT_PUBLIC_ENABLE_BLOG=true
 *   NEXT_PUBLIC_ENABLE_CONTACT=true
 *   NEXT_PUBLIC_ENABLE_FOUNDING_OFFER=true   (also needs profile.foundingOffer.enabled in Sanity)
 *   NEXT_PUBLIC_SHOW_PRICES=true             (shows the "usually ₱…" ranges under What I build)
 */

export const features = {
  chatbot: process.env.NEXT_PUBLIC_ENABLE_CHATBOT === "true",
  blog: process.env.NEXT_PUBLIC_ENABLE_BLOG === "true",
  contact: process.env.NEXT_PUBLIC_ENABLE_CONTACT === "true",
  foundingOffer: process.env.NEXT_PUBLIC_ENABLE_FOUNDING_OFFER === "true",
  showPrices: process.env.NEXT_PUBLIC_SHOW_PRICES === "true",
} as const;
