import type { Metadata } from "next";
import { getSettings } from "@/lib/db/settings";
import { SITE_URL, SITE_LOCALE, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/site";

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
  defaults: {
    title: string;
    description: string;
    keywords?: string;
    path: string;
    /** Override OG image (relative or absolute). */
    image?: string;
    /** openGraph type — defaults to "website". */
    type?: "website" | "article";
    /** Set true to keep the page out of the index (e.g. thin/utility pages). */
    noindex?: boolean;
  }
): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings[`seo_${slug}_title`] || defaults.title;
  const description =
    settings[`seo_${slug}_description`] || defaults.description;
  const keywords = settings[`seo_${slug}_keywords`] || defaults.keywords || "";

  const ogImage =
    settings[`seo_${slug}_og_image`] ||
    defaults.image ||
    settings.seo_default_og_image ||
    DEFAULT_OG_IMAGE;

  const ogImageAbs = absoluteUrl(ogImage)!;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: { canonical: defaults.path },
    ...(defaults.noindex
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${defaults.path === "/" ? "" : defaults.path}`,
      type: defaults.type || "website",
      locale: SITE_LOCALE,
      images: [{ url: ogImageAbs, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageAbs],
    },
  };
}
