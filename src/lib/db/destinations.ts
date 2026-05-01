import { prisma } from "@/lib/prisma";

export interface DestinationData {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestTime: string;
  altitude: string;
  vibe: string;
  image: string;
  highlights: string[];
  categories: string[];
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export async function getAllDestinations(): Promise<DestinationData[]> {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return destinations as unknown as DestinationData[];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getDestinationBySlug(slug: string): Promise<DestinationData | null> {
  try {
    const destination = await prisma.destination.findFirst({
      where: { slug, isActive: true },
    });
    return destination as unknown as DestinationData | null;
  } catch (error) {
    console.error(`Error fetching destination ${slug}:`, error);
    return null;
  }
}
