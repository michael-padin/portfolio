import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Michael Padin — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #141420 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#00d4aa",
          marginBottom: 16,
        }}
      >
        Michael Padin
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#8888a8",
        }}
      >
        Full-Stack Developer — React, Next.js, Node.js
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#4a4a6a",
          marginTop: 24,
        }}
      >
        Cebu, Philippines
      </div>
    </div>,
    { ...size },
  );
}
