import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michael Padin — Full-Stack Developer",
    short_name: "Michael Padin",
    description: "Full-stack developer from Cebu, Philippines. React, Next.js, Node.js.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#00d4aa",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
