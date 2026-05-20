import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/db/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();

  const name = settings.site_name || "Himvigo Tours";
  const shortName = settings.seo_manifest_short_name || "Himvigo";
  const description =
    settings.seo_default_description ||
    "Premium Himachal Pradesh tours, Spiti Valley packages, and Himalayan cab services.";
  const themeColor = settings.seo_theme_color || "#f39e1e";
  const backgroundColor = settings.seo_background_color || "#ffffff";

  const icons: MetadataRoute.Manifest["icons"] = [];

  // SVG: only emit if admin has uploaded one — the bundled icon is now
  // a raster PNG, so there's no /icon.svg to fall back to.
  if (settings.seo_favicon_svg) {
    icons.push({
      src: settings.seo_favicon_svg,
      sizes: "any",
      type: "image/svg+xml",
    });
  }

  if (settings.seo_favicon_png) {
    icons.push({
      src: settings.seo_favicon_png,
      sizes: "512x512",
      type: "image/png",
    });
  } else {
    icons.push({ src: "/icon.png", sizes: "any", type: "image/png" });
  }

  if (settings.seo_apple_icon) {
    icons.push({
      src: settings.seo_apple_icon,
      sizes: "180x180",
      type: "image/png",
    });
  } else {
    icons.push({ src: "/apple-icon.png", sizes: "180x180", type: "image/png" });
  }

  return {
    name,
    short_name: shortName,
    description,
    start_url: "/",
    display: "standalone",
    background_color: backgroundColor,
    theme_color: themeColor,
    icons,
  };
}
