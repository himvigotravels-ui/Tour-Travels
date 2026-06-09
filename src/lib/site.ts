/**
 * Single source of truth for site-wide identity used by metadata, schema,
 * sitemap, robots and the llms.txt route.
 *
 * SITE_URL is the canonical production origin. We deliberately ignore a
 * localhost NEXT_PUBLIC_SITE_URL here so canonical/OG/schema URLs stay
 * correct in every environment; only an explicit https override wins.
 */
export const SITE_URL = (() => {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env && env.startsWith("https://")) return env.replace(/\/$/, "");
  return "https://www.himvigo.com";
})();

export const SITE_NAME = "Himvigo Tours";
export const SITE_SHORT_NAME = "Himvigo";
export const SITE_LOCALE = "en_IN";
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";

/** Brand/contact defaults — mirror the fallbacks used in Footer/Contact. */
export const CONTACT_DEFAULTS = {
  email: "himvigotours@gmail.com",
  phone: "+91 98055 14018",
  whatsapp: "919805514018",
  address: "VPO - Prini, Tehsil - Manali, District - Kullu, HP 175131",
  addressLocality: "Manali",
  addressRegion: "Himachal Pradesh",
  postalCode: "175131",
  addressCountry: "IN",
  openingHours: "Mo-Su 09:00-20:00",
  instagram: "https://instagram.com/himvigo",
  facebook: "https://facebook.com/himvigo",
  youtube: "https://youtube.com/@himvigo",
} as const;

/** Resolve a possibly-relative path/URL to an absolute production URL. */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
