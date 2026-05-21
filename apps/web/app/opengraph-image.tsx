import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Michael Padin, Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const paper = "#f5f1e8";
  const paperRule = "#dccaa8";
  const ink = "#1d2025";
  const ink2 = "#4a4a5a";
  const ink3 = "#7d7a78";
  const signal = "#c43a1e";

  const sans = "ui-sans-serif, system-ui, sans-serif";
  const mono = "ui-monospace, SFMono-Regular, monospace";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: paper,
        fontFamily: sans,
        padding: 64,
        color: ink,
      }}
    >
      {/* Document metadata strip */}
      <div
        style={{
          display: "flex",
          gap: 32,
          paddingBottom: 12,
          borderBottom: `1px solid ${paperRule}`,
          fontFamily: mono,
          fontSize: 14,
          color: ink3,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span>Document</span>
          <span style={{ color: ink, textTransform: "none" }}>Portfolio</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span>Subject</span>
          <span style={{ color: ink, textTransform: "none" }}>Michael Padin</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span>Origin</span>
          <span style={{ color: ink, textTransform: "none" }}>Cebu, PH · UTC+8</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Status</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: signal }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: signal,
              }}
            />
            Available
          </span>
        </div>
      </div>

      {/* Declaration */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 80,
          marginBottom: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 500,
            color: ink,
            letterSpacing: "-0.035em",
            lineHeight: 1,
            maxWidth: 920,
          }}
        >
          I build products that ship and actually work.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: ink2,
            maxWidth: 880,
            lineHeight: 1.5,
          }}
        >
          Full-stack engineer specialising in React, Next.js, and Node.js.
        </div>
      </div>

      {/* Spec strip footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingTop: 24,
          borderTop: `1px solid ${paperRule}`,
          fontFamily: mono,
          fontSize: 16,
          color: ink3,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", gap: 32 }}>
          <span style={{ color: ink, textTransform: "none" }}>michaelpadin.com</span>
          <span>Full-stack engineer</span>
        </div>
        <span>REV 2026</span>
      </div>
    </div>,
    { ...size },
  );
}
