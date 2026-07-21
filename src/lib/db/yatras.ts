import { TourPackage } from "@/components/ui/PackageCard";
import { prisma } from "@/lib/prisma";

export async function getAllYatras(): Promise<TourPackage[]> {
  try {
    const yatras = await prisma.package.findMany({
      where: { isActive: true, isYatra: true },
      orderBy: { createdAt: "desc" },
    });
    return yatras as unknown as TourPackage[];
  } catch (error) {
    console.error("Error fetching yatras:", error);
    return [];
  }
}

export async function getYatraBySlug(slug: string): Promise<TourPackage | null> {
  try {
    const yatra = await prisma.package.findFirst({
      where: { slug, isYatra: true },
    });
    return yatra as unknown as TourPackage | null;
  } catch (error) {
    console.error(`Error fetching yatra ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedYatras(): Promise<TourPackage[]> {
  try {
    const yatras = await prisma.package.findMany({
      where: { isActive: true, isYatra: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return yatras as unknown as TourPackage[];
  } catch (error) {
    console.error("Error fetching featured yatras:", error);
    return [];
  }
}
