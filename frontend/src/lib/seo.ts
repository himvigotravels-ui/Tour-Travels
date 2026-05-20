import type { Metadata } from "next";
import { getSettings } from "@/lib/db/settings";

/**
 * Build a per-page Metadata object that:
 *  - reads admin overrides from SiteSetting (seo_<slug>_*)
 *  - falls back to provided defaults
 *  - resolves OG image with the per-page → site default → bundled chain
 *  - sets canonical, openGraph and twitter blocks consistently
 *
 * Pass the page slug exactly as it appears in the SEO admin (home, packages,
 * treks, destinations, blog, cab, about, contact, …).
 */
export async function buildPageMetadata(
  slug: string,
  defaults: { title: string; description: string; keywords?: string; path: string }
): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings[`seo_${slug}_title`] || defaults.title;
  const description =
    settings[`seo_${slug}_description`] || defaults.description;
  const keywords = settings[`seo_${slug}_keywords`] || defaults.keywords || "";

  const ogImage =
    settings[`seo_${slug}_og_image`] ||
    settings.seo_default_og_image ||
    "/opengraph-image.png";

  const ogImageAbs = ogImage.startsWith("http")
    ? ogImage
    : `https://www.himvigo.com${ogImage}`;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: { canonical: defaults.path },
    openGraph: {
      title,
      description,
      url: defaults.path,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageAbs],
    },
  };
}
