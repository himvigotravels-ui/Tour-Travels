import { TourPackage } from "@/components/ui/PackageCard";
import { prisma } from "@/lib/prisma";

export async function getAllTreks(): Promise<TourPackage[]> {
  try {
    const treks = await prisma.package.findMany({
      where: { isActive: true, isTrek: true },
      orderBy: { createdAt: "desc" },
    });
    return treks as unknown as TourPackage[];
  } catch (error) {
    console.error("Error fetching treks:", error);
    return [];
  }
}

export async function getTrekBySlug(slug: string): Promise<TourPackage | null> {
  try {
    const trek = await prisma.package.findFirst({
      where: { slug, isTrek: true },
    });
    return trek as unknown as TourPackage | null;
  } catch (error) {
    console.error(`Error fetching trek ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedTreks(): Promise<TourPackage[]> {
  try {
    const treks = await prisma.package.findMany({
      where: { isActive: true, isTrek: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return treks as unknown as TourPackage[];
  } catch (error) {
    console.error("Error fetching featured treks:", error);
    return [];
  }
}
