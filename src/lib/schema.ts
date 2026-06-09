/**
 * Centralised Schema.org (JSON-LD) builders.
 *
 * Every builder returns a plain object ready to be serialised by the
 * <JsonLd> component. We use stable @id anchors (#organization, #website)
 * so nested references (publisher/provider/seller) resolve to a single
 * entity graph across the whole site.
 *
 * Notes on Google rich-result eligibility (2024+):
 *  - Product + Offer  → eligible for merchant/price rich results.
 *  - BreadcrumbList    → eligible for breadcrumb trail.
 *  - Article/BlogPosting → eligible for article enhancements.
 *  - FAQPage           → rich results now limited to gov/health sites, but
 *    still valuable for AI Overviews / LLM citation, so we keep it.
 *  - TouristDestination → not a Google rich-result type; included for
 *    entity understanding and AI search.
 */
import { SITE_URL, SITE_NAME, CONTACT_DEFAULTS, absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/site";
import type { TourPackage } from "@/components/ui/PackageCard";
import type { DestinationData } from "@/lib/db/destinations";
import type { BlogData } from "@/lib/db/blogs";

type Settings = Record<string, string>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function val(settings: Settings, key: string, fallback: string) {
  return (settings?.[key] || "").trim() || fallback;
}

function socialLinks(settings: Settings): string[] {
  return [
    val(settings, "site_instagram", CONTACT_DEFAULTS.instagram),
    val(settings, "site_facebook", CONTACT_DEFAULTS.facebook),
    val(settings, "site_youtube", CONTACT_DEFAULTS.youtube),
  ].filter(Boolean);
}

/** TravelAgency (a LocalBusiness subtype) — the brand entity, referenced everywhere. */
export function organizationSchema(settings: Settings = {}) {
  const name = val(settings, "site_name", SITE_NAME);
  const phone = val(settings, "site_phone", CONTACT_DEFAULTS.phone);
  const email = val(settings, "site_email", CONTACT_DEFAULTS.email);
  const logo = absoluteUrl(settings.seo_favicon_png || "/logo.svg");

  const lat = settings.site_geo_lat?.trim();
  const lng = settings.site_geo_lng?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name,
    legalName: name,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: logo },
    image: absoluteUrl(settings.seo_default_og_image || DEFAULT_OG_IMAGE),
    description:
      val(
        settings,
        "seo_default_description",
        "Premium Himachal Pradesh tours, Spiti Valley packages, Himalayan treks and reliable mountain cab services."
      ),
    telephone: phone,
    email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: val(settings, "site_address", CONTACT_DEFAULTS.address),
      addressLocality: CONTACT_DEFAULTS.addressLocality,
      addressRegion: CONTACT_DEFAULTS.addressRegion,
      postalCode: CONTACT_DEFAULTS.postalCode,
      addressCountry: CONTACT_DEFAULTS.addressCountry,
    },
    ...(lat && lng
      ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } }
      : {}),
    areaServed: {
      "@type": "State",
      name: "Himachal Pradesh",
    },
    openingHours: CONTACT_DEFAULTS.openingHours,
    sameAs: socialLinks(settings),
  };
}

/** WebSite entity (no SearchAction — there is no site-search results URL). */
export function websiteSchema(settings: Settings = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: val(settings, "site_name", SITE_NAME),
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Product + Offer for a tour package or trek. */
export function packageSchema(
  pkg: TourPackage,
  opts: { isTrek?: boolean } = {}
) {
  const base = opts.isTrek ? "treks" : "packages";
  const url = `${SITE_URL}/${base}/${pkg.slug}`;
  const images = (pkg.imageUrls || [])
    .map((u) => absoluteUrl(u))
    .filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: pkg.title,
    url,
    ...(images.length ? { image: images } : {}),
    description:
      pkg.metaDescription ||
      pkg.description ||
      `${pkg.title} — ${pkg.durationDays} Days / ${pkg.durationNights} Nights in ${pkg.location}.`,
    category: opts.isTrek ? "Trekking Expedition" : "Tour Package",
    ...(pkg.categories?.length ? { keywords: pkg.categories.join(", ") } : {}),
    brand: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      url,
      price: Number(pkg.pricePerPerson) || 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

/** TouristDestination for a destination guide page. */
export function destinationSchema(dest: DestinationData) {
  const url = `${SITE_URL}/destinations/${dest.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${url}#destination`,
    name: dest.name,
    url,
    description: (dest.description || "").replace(/<[^>]*>/g, "").slice(0, 300),
    ...(dest.image ? { image: absoluteUrl(dest.image) } : {}),
    ...(dest.highlights?.length
      ? { touristType: dest.highlights.slice(0, 6) }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Himachal Pradesh",
      addressCountry: "IN",
    },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** BlogPosting / Article for a blog detail page. */
export function articleSchema(blog: BlogData) {
  const url = `${SITE_URL}/blog/${blog.slug}`;
  const published = blog.publishedAt
    ? new Date(blog.publishedAt).toISOString()
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: blog.title?.slice(0, 110),
    description:
      blog.metaDescription ||
      blog.excerpt ||
      (blog.content || "").replace(/<[^>]*>/g, "").slice(0, 160),
    ...(blog.coverImage ? { image: [absoluteUrl(blog.coverImage)] } : {}),
    ...(published ? { datePublished: published, dateModified: published } : {}),
    author: { "@type": "Person", name: blog.author || "Himvigo Travel Desk" },
    publisher: { "@id": ORG_ID },
    ...(blog.tags?.length ? { keywords: blog.tags.join(", ") } : {}),
    ...(blog.category ? { articleSection: blog.category } : {}),
    url,
  };
}

export type FaqItem = { question: string; answer: string };

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export type ListEntry = { name: string; path: string };

/** ItemList for a collection/listing page. */
export function itemListSchema(name: string, entries: ListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      url: absoluteUrl(e.path),
    })),
  };
}

/** Generic WebPage wrappers for thin/static informational pages. */
export function webPageSchema(
  type: "AboutPage" | "ContactPage" | "WebPage",
  opts: { name: string; description?: string; path: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

/** Service schema (used for the cab/transfer service page). */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType || opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "State", name: "Himachal Pradesh" },
  };
}
