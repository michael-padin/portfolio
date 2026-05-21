import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michael Padin, Full Stack Developer",
    short_name: "Michael Padin",
    description: "Full stack developer from Cebu, Philippines. React, Next.js, Node.js.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#f5f1e8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
