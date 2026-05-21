import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const paper = "#f5f1e8";
  const signal = "#c43a1e";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: paper,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          background: signal,
        }}
      />
    </div>,
    { ...size },
  );
}
