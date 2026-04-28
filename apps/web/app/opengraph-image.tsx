import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Michael Padin — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const accent = "#00d4aa";
  const accentDim = "rgba(0, 212, 170, 0.18)";
  const bg = "#0a0a0f";
  const surface = "#13131c";
  const border = "rgba(255, 255, 255, 0.06)";
  const text = "#e8e8f0";
  const textMuted = "#8888a8";
  const textDim = "#4a4a6a";

  const skills = ["TypeScript", "React", "Next.js", "Node.js", "AWS", "Cloudflare"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: bg,
        backgroundImage: `radial-gradient(circle at 85% 15%, ${accentDim} 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(0, 184, 217, 0.10) 0%, transparent 50%)`,
        fontFamily: "system-ui",
        padding: 64,
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "auto",
        }}
      >
        {/* Logo / brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: bg,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, color: text, fontWeight: 600, letterSpacing: -0.2 }}>
              michaelpadin.com
            </div>
            <div style={{ fontSize: 13, color: textDim, fontFamily: "monospace" }}>portfolio</div>
          </div>
        </div>

        {/* Availability badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 999,
            background: surface,
            border: `1px solid ${border}`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
          <span style={{ fontSize: 14, color: text, fontFamily: "monospace" }}>
            Available for new projects
          </span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: text,
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 14,
          }}
        >
          Michael Padin
        </div>

        {/* Title with accent */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 42, color: accent, fontWeight: 600, letterSpacing: -1 }}>
            Full-Stack Developer
          </div>
          <div style={{ fontSize: 22, color: textMuted, fontWeight: 400 }}>
            Typescript · Next.js · Node.js · PostgreSQL
          </div>
        </div>

        {/* Skill chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {skills.map((s) => (
            <div
              key={s}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: surface,
                border: `1px solid ${border}`,
                fontSize: 18,
                color: textMuted,
                fontFamily: "monospace",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: 28,
          borderTop: `1px solid ${border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            color: textMuted,
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: accent }}>▸</span>
          Cebu, Philippines
          <span style={{ color: textDim }}>·</span>
          UTC+8 — flexible overlap with US / EU / APAC
        </div>
        <div style={{ fontSize: 16, color: textDim, fontFamily: "monospace" }}>
          michaelpadin.com
        </div>
      </div>
    </div>,
    { ...size },
  );
}
