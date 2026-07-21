import { getAllYatras, getYatraBySlug } from "@/lib/db/yatras";
import { getInternalPageBySlug } from "@/lib/db/pages";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/packages/PackageDetailClient";
import YatraGroupLandingPage from "@/components/yatras/YatraGroupLandingPage";
import { Metadata } from "next";
import { BottomCTA } from "@/components/ui/BottomCTA";
import type { TourPackage } from "@/components/ui/PackageCard";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const yatras = await getAllYatras();
  return yatras.map((y) => ({ slug: y.slug }));
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

  // Real yatra package wins over a same-slug nav-group.
  const yatra = await getYatraBySlug(slug);
  if (yatra) {
    const title = yatra.metaTitle || `${yatra.title} | Yatra Package`;
    const description =
      yatra.metaDescription ||
      `Book ${yatra.title} — a guided pilgrimage across ${yatra.location} for ${yatra.durationDays} Days / ${yatra.durationNights} Nights.`;
    return {
      title,
      description,
      keywords: yatra.metaKeywords || yatra.categories?.join(", "),
      alternates: { canonical: `/yatras/${slug}` },
      openGraph: {
        title,
        description,
        images:
          yatra.imageUrls && yatra.imageUrls.length > 0
            ? [{ url: yatra.imageUrls[0] }]
            : [],
      },
      twitter: {
        title,
        description,
        images:
          yatra.imageUrls && yatra.imageUrls.length > 0
            ? [yatra.imageUrls[0]]
            : [],
      },
    };
  }

  const internalPage = await getInternalPageBySlug(slug);
  if (internalPage && internalPage.type === "yatra") {
    const title = internalPage.metaTitle || internalPage.title;
    const description =
      internalPage.metaDescription ||
      internalPage.description ||
      `Explore curated pilgrimage yatras in ${internalPage.title} with Himvigo.`;
    const ogImage = internalPage.ogImage || internalPage.coverImage || undefined;
    return {
      title,
      description,
      keywords: internalPage.metaKeywords || undefined,
      alternates: { canonical: `/yatras/${slug}` },
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

export default async function YatraDetails({ params }: Props) {
  const { slug } = await params;

  // 1) Real yatra package row wins over same-slug nav-group.
  const yatra = await getYatraBySlug(slug);

  let content;
  let jsonLd: Record<string, unknown> | null = null;

  if (yatra) {
    content = <PackageDetailClient pkg={yatra} />;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: yatra.title,
      image: yatra.imageUrls,
      description: yatra.description,
      offers: {
        "@type": "Offer",
        price: yatra.pricePerPerson,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    };
  } else {
    const internalPage = await getInternalPageBySlug(slug);
    if (!internalPage || internalPage.type !== "yatra") {
      notFound();
    }

    // Manual override list takes precedence; otherwise filter by destination match.
    const manualPackages = (internalPage.packages ?? []) as unknown as TourPackage[];
    const destinations = (
      (internalPage.destinations ?? []) as { name: string; slug: string }[]
    ).map((d) => ({ name: d.name, slug: d.slug }));

    let groupYatras: TourPackage[];
    if (manualPackages.length > 0) {
      // Keep the admin's order, only show isYatra + active.
      groupYatras = manualPackages.filter((p) => p.isYatra && p.isActive !== false);
    } else if (destinations.length > 0) {
      const allYatras = await getAllYatras();
      groupYatras = allYatras.filter((y) =>
        locationMatchesAny(y.location, destinations)
      );
    } else {
      // No filter set → fall back to ALL yatras (so the page still has content).
      groupYatras = await getAllYatras();
    }

    content = (
      <YatraGroupLandingPage
        title={internalPage.title}
        packages={groupYatras}
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
