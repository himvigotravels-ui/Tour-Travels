import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Himvigo Tours",
    short_name: "Himvigo",
    description:
      "Premium Himachal Pradesh tours, Spiti Valley packages, and Himalayan cab services.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f39e1e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
