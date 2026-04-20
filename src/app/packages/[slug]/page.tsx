import { getPackageBySlug, getAllPackages } from "@/lib/db/packages";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/packages/PackageDetailClient";
import CategoryLandingPage from "@/components/packages/CategoryLandingPage";

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

export default async function PackageDetails({ params }: Props) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  
  // Detect if this is a category page request
  if (CATEGORIES.includes(lowerSlug)) {
    const allPackages = await getAllPackages();
    const categoryPackages = allPackages.filter(p => 
      (p.categories || []).map(c => c.toLowerCase()).includes(lowerSlug)
    );
    
    return <CategoryLandingPage category={slug} packages={categoryPackages} />;
  }

  // Otherwise, it's a specific package request
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetailClient pkg={pkg} />;
}
