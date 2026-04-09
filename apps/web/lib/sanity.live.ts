import { defineLive } from "next-sanity/live";
import { client, isSanityConfigured } from "./sanity.client";

// Only set up live features when Sanity is configured
const live = isSanityConfigured
  ? defineLive({
      client: client!,
      serverToken: process.env.SANITY_API_READ_TOKEN,
      browserToken: process.env.SANITY_API_BROWSER_TOKEN,
    })
  : null;

export const sanityFetch = live?.sanityFetch ?? null;
export const SanityLive = live?.SanityLive ?? null;
