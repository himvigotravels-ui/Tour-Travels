import { getAllTreks, getTrekBySlug } from "@/lib/db/treks";
import { getInternalPageBySlug } from "@/lib/db/pages";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/packages/PackageDetailClient";
import TrekGroupLandingPage from "@/components/treks/TrekGroupLandingPage";
import { Metadata } from "next";
import { BottomCTA } from "@/components/ui/BottomCTA";
import type { TourPackage } from "@/components/ui/PackageCard";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const treks = await getAllTreks();
  return treks.map((t) => ({ slug: t.slug }));
}

function locationMatchesAny(
  packageLocation: string,
  destinations: { name: string; slug: string }[]
): boolean {
  const loc = packageLocation.toLowerCase();
  const locSlug = loc.replace(/\s+/g, "-");
  return destinations.some((d) => {
    const name = d.name.toLowerCase();
    const slug = d.slug.toLowerCase();
    return (
      loc.includes(name) ||
      name.includes(loc) ||
      locSlug.includes(slug) ||
      slug.includes(locSlug)
    );
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Real trek package wins over a same-slug nav-group.
  const trek = await getTrekBySlug(slug);
  if (trek) {
    const title = trek.metaTitle || `${trek.title} | Trek Package`;
    const description =
      trek.metaDescription ||
      `Book ${trek.title} and trek across ${trek.location} for ${trek.durationDays} Days / ${trek.durationNights} Nights.`;
    return {
      title,
      description,
      keywords: trek.metaKeywords || trek.categories?.join(", "),
      alternates: { canonical: `/treks/${slug}` },
      openGraph: {
        title,
        description,
        images:
          trek.imageUrls && trek.imageUrls.length > 0
            ? [{ url: trek.imageUrls[0] }]
            : [],
      },
      twitter: {
        title,
        description,
        images:
          trek.imageUrls && trek.imageUrls.length > 0 ? [trek.imageUrls[0]] : [],
      },
    };
  }

  const internalPage = await getInternalPageBySlug(slug);
  if (internalPage && internalPage.type === "trek") {
    const title = internalPage.metaTitle || internalPage.title;
    const description =
      internalPage.metaDescription ||
      internalPage.description ||
      `Explore curated treks in ${internalPage.title} with Himvigo.`;
    const ogImage = internalPage.ogImage || internalPage.coverImage || undefined;
    return {
      title,
      description,
      keywords: internalPage.metaKeywords || undefined,
      alternates: { canonical: `/treks/${slug}` },
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

  return {};
}

export default async function TrekDetails({ params }: Props) {
  const { slug } = await params;

  // 1) Real trek package row wins over same-slug nav-group.
  const trek = await getTrekBySlug(slug);

  let content;
  let jsonLd: Record<string, unknown> | null = null;

  if (trek) {
    content = <PackageDetailClient pkg={trek} />;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: trek.title,
      image: trek.imageUrls,
      description: trek.description,
      offers: {
        "@type": "Offer",
        price: trek.pricePerPerson,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    };
  } else {
    const internalPage = await getInternalPageBySlug(slug);
    if (!internalPage || internalPage.type !== "trek") {
      notFound();
    }

    // Manual override list takes precedence; otherwise filter by destination match.
    const manualPackages = (internalPage.packages ?? []) as unknown as TourPackage[];
    const destinations = (internalPage.destinations ?? []).map((d) => ({
      name: d.name,
      slug: d.slug,
    }));

    let groupTreks: TourPackage[];
    if (manualPackages.length > 0) {
      // Keep the admin's order, only show isTrek + active.
      groupTreks = manualPackages.filter((p) => p.isTrek && p.isActive !== false);
    } else if (destinations.length > 0) {
      const allTreks = await getAllTreks();
      groupTreks = allTreks.filter((t) =>
        locationMatchesAny(t.location, destinations)
      );
    } else {
      // No filter set → fall back to ALL treks (so the page still has content).
      groupTreks = await getAllTreks();
    }

    content = (
      <TrekGroupLandingPage
        title={internalPage.title}
        packages={groupTreks}
        description={internalPage.description || undefined}
        tagline={internalPage.tagline || undefined}
        coverImage={internalPage.coverImage || undefined}
        destinationNames={destinations.map((d) => d.name)}
      />
    );
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {content}
      <BottomCTA />
    </>
  );
}
