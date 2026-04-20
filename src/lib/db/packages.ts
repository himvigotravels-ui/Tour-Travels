import { TourPackage } from "@/components/ui/PackageCard";
import { prisma } from "@/lib/prisma";

export async function getFeaturedPackages(): Promise<TourPackage[]> {
  try {
    const packages = await prisma.package.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    return packages as unknown as TourPackage[];
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return [];
  }
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | null> {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug }
    });
    return pkg as unknown as TourPackage | null;
  } catch (error) {
    console.error(`Error fetching package ${slug}:`, error);
    return null;
  }
}

export async function getAllPackages(): Promise<TourPackage[]> {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return packages as unknown as TourPackage[];
  } catch (error) {
    console.error('Error fetching all packages:', error);
    return [];
  }
}

export async function getPackagesByCategory(category: string): Promise<TourPackage[]> {
  try {
    const packages = await prisma.package.findMany({
      where: { 
        isActive: true,
        categories: { has: category }
      },
      orderBy: { createdAt: 'desc' }
    });
    return packages as unknown as TourPackage[];
  } catch (error) {
    console.error(`Error fetching packages for category ${category}:`, error);
    return [];
  }
}
