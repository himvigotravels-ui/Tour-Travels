import { getPackageBySlug, getAllPackages } from "@/lib/db/packages";
import { getInternalPageBySlug } from "@/lib/db/pages";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/packages/PackageDetailClient";
import CategoryLandingPage from "@/components/packages/CategoryLandingPage";
import { Metadata } from "next";

import { BottomCTA } from "@/components/ui/BottomCTA";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

const CATEGORIES = ["honeymoon", "family", "adventure", "offbeat", "spiritual", "cultural"];

export async function generateStaticParams() {
  const packages = await getAllPackages();
  const packageParams = packages.map((pkg) => ({
    slug: pkg.slug,
  }));

  const categoryParams = CATEGORIES.map((cat) => ({
    slug: cat,
  }));

  return [...packageParams, ...categoryParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  // A real Package row wins over a same-slug nav-group; the nav-group
  // landing only renders when no actual package owns this slug.
  const pkgFirst = await getPackageBySlug(slug);
  const internalPage = !pkgFirst
    ? await getInternalPageBySlug(slug)
    : null;
  if (internalPage && internalPage.type === "package") {
    const title = internalPage.metaTitle || internalPage.title;
    const description =
      internalPage.metaDescription ||
      internalPage.description ||
      `Explore our best ${internalPage.title} and plan your dream trip with Himvigo.`;
    const ogImage = internalPage.ogImage || internalPage.coverImage || undefined;
    return {
      title,
      description,
      keywords: internalPage.metaKeywords || undefined,
      alternates: { canonical: `/packages/${slug}` },
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  }

  if (CATEGORIES.includes(lowerSlug)) {
    const title = `${lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1)} Tour Packages`;
    const description = `Explore our best ${lowerSlug} tour packages and plan your dream trip with Himvigo.`;
    return {
      title,
      description,
      alternates: {
        canonical: `/packages/${slug}`,
      },
      openGraph: { title, description },
      twitter: { title, description }
    };
  }

  const pkg = pkgFirst;
  if (!pkg) return {};

  const title = pkg.metaTitle || `${pkg.title} | Tour Package`;
  const description = pkg.metaDescription || `Book ${pkg.title} and explore ${pkg.location} for ${pkg.durationDays} Days / ${pkg.durationNights} Nights.`;
  
  return {
    title,
    description,
    keywords: pkg.metaKeywords || pkg.categories?.join(', '),
    alternates: {
      canonical: `/packages/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: pkg.imageUrls && pkg.imageUrls.length > 0 ? [{ url: pkg.imageUrls[0] }] : []
    },
    twitter: {
      title,
      description,
      images: pkg.imageUrls && pkg.imageUrls.length > 0 ? [pkg.imageUrls[0]] : []
    }
  };
}

export default async function PackageDetails({ params }: Props) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  let content;
  // Try a real package first — it wins over a same-slug nav-group.
  const pkg = await getPackageBySlug(slug);

  const internalPage = !pkg ? await getInternalPageBySlug(slug) : null;
  if (internalPage && internalPage.type === "package") {
    // Prefer manually-selected packages; fall back to category-array matching
    const manualIds = (internalPage.packages ?? []).map((p) => p.id);
    let groupPackages;
    if (manualIds.length > 0) {
      const idOrder = new Map<string, number>(
        manualIds.map((id, idx) => [id, idx])
      );
      const allPackages = await getAllPackages();
      groupPackages = allPackages
        .filter((p) => p.id && manualIds.includes(p.id))
        .sort(
          (a, b) =>
            (idOrder.get(a.id ?? "") ?? 0) -
            (idOrder.get(b.id ?? "") ?? 0)
        );
    } else {
      const allPackages = await getAllPackages();
      groupPackages = allPackages.filter(
        (p) =>
          (p.categories || []).map((c) => c.toLowerCase()).includes(lowerSlug) ||
          (p.categories || []).some(
            (c) => c.toLowerCase() === internalPage.title.toLowerCase()
          )
      );
    }

    content = (
      <CategoryLandingPage
        category={internalPage.title}
        packages={groupPackages}
      />
    );
  } else if (pkg) {
    // Real package row — render the detail UI.
    content = <PackageDetailClient pkg={pkg} />;
  } else if (CATEGORIES.includes(lowerSlug)) {
    // Hardcoded category fallback (e.g. /packages/honeymoon).
    const allPackages = await getAllPackages();
    const categoryPackages = allPackages.filter((p) =>
      (p.categories || []).map((c) => c.toLowerCase()).includes(lowerSlug)
    );
    content = <CategoryLandingPage category={slug} packages={categoryPackages} />;
  } else {
    notFound();
  }

  const jsonLd = !CATEGORIES.includes(lowerSlug) && pkg ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.title,
    "image": pkg.imageUrls,
    "description": pkg.description,
    "offers": {
      "@type": "Offer",
      "price": pkg.pricePerPerson,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  } : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {content}
      <BottomCTA />
    </>
  );
}
