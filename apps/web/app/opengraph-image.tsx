import { ImageResponse } from "next/og";
import { INK, MANGO, MarkSvg, PAPER } from "@/components/brand/mark-svg";

export const runtime = "edge";
export const alt = "Michael Padin: custom systems built around how your business runs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Custom systems built around how your business runs.";
const SUB = "Booking, ordering, inventory and staff tools for local businesses in Cebu.";
const WORDMARK = "MICHAEL PADIN /";
const TAGLINE = "CUSTOM SOFTWARE · CEBU";

/** Fetches a TTF subset from Google Fonts (Satori can't read woff2). */
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src?.[1]) throw new Error(`No TTF for ${family}`);
  return (await fetch(src[1])).arrayBuffer();
}

export default async function OGImage() {
  const fonts = await Promise.all([
    loadGoogleFont("Schibsted+Grotesk", 700, HEADLINE),
    loadGoogleFont("Schibsted+Grotesk", 800, WORDMARK),
    loadGoogleFont("Schibsted+Grotesk", 400, SUB),
    loadGoogleFont("Fragment+Mono", 400, TAGLINE + "michaelpadin.com"),
  ])
    .then(([bold, extra, regular, mono]) => [
      { name: "Schibsted", data: bold, weight: 700 as const },
      { name: "Schibsted", data: extra, weight: 800 as const },
      { name: "Schibsted", data: regular, weight: 400 as const },
      { name: "Fragment Mono", data: mono, weight: 400 as const },
    ])
    .catch(() => undefined);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        color: INK,
        fontFamily: "Schibsted",
        padding: "64px 72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <MarkSvg size={72} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 800, letterSpacing: "0.12em" }}>
            MICHAEL PADIN <span style={{ color: MANGO, letterSpacing: 0, marginLeft: 10 }}>/</span>
          </div>
          <div
            style={{
              fontFamily: "Fragment Mono",
              fontSize: 15,
              letterSpacing: "0.2em",
              opacity: 0.7,
            }}
          >
            {TAGLINE}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {HEADLINE}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, fontWeight: 400, color: "#4c3f39" }}>{SUB}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: "Fragment Mono",
            fontSize: 20,
            borderBottom: `3px solid ${MANGO}`,
            paddingBottom: 4,
          }}
        >
          michaelpadin.com
        </div>
        <div
          style={{ display: "flex", width: 120, height: 14, borderRadius: 999, background: MANGO }}
        />
      </div>
    </div>,
    { ...size, ...(fonts && { fonts }) },
  );
}
