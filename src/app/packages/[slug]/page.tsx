import { getPackageBySlug, getAllPackages } from "@/lib/db/packages";
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

  if (CATEGORIES.includes(lowerSlug)) {
    const title = `${lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1)} Tour Packages`;
    const description = `Explore our best ${lowerSlug} tour packages and plan your dream trip with Himvigo.`;
    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description }
    };
  }

  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  const title = pkg.metaTitle || `${pkg.title} | Tour Package`;
  const description = pkg.metaDescription || `Book ${pkg.title} and explore ${pkg.location} for ${pkg.durationDays} Days / ${pkg.durationNights} Nights.`;
  
  return {
    title,
    description,
    keywords: pkg.metaKeywords || pkg.categories?.join(', '),
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

  // Detect if this is a category page request
  if (CATEGORIES.includes(lowerSlug)) {
    const allPackages = await getAllPackages();
    const categoryPackages = allPackages.filter(p => 
      (p.categories || []).map(c => c.toLowerCase()).includes(lowerSlug)
    );
    
    content = <CategoryLandingPage category={slug} packages={categoryPackages} />;
  } else {
    // Otherwise, it's a specific package request
    const pkg = await getPackageBySlug(slug);

    if (!pkg) {
      notFound();
    }

    content = <PackageDetailClient pkg={pkg} />;
  }

  return (
    <>
      {content}
      <BottomCTA />
    </>
  );
}
