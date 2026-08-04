import { prisma } from "@/lib/prisma";

export interface UpcomingTrip {
  id?: string;
  slug: string;
  title: string;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  image?: string | null;
  totalSeats: number;
  seatsLeft: number;
  description?: string | null;
  highlights?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
}

export async function getUpcomingTrips(limit?: number): Promise<UpcomingTrip[]> {
  try {
    const trips = await prisma.upcomingTrip.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
      ...(limit ? { take: limit } : {}),
    });
    return trips as unknown as UpcomingTrip[];
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    return [];
  }
}

export async function getUpcomingTripBySlug(
  slug: string
): Promise<UpcomingTrip | null> {
  try {
    const trip = await prisma.upcomingTrip.findFirst({ where: { slug } });
    return trip as unknown as UpcomingTrip | null;
  } catch (error) {
    console.error(`Error fetching upcoming trip ${slug}:`, error);
    return null;
  }
}
