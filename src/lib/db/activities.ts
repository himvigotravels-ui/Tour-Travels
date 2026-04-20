import { prisma } from "@/lib/prisma";

export interface ActivityData {
  id?: string;
  title: string;
  description: string;
  image: string;
  location: string;
  icon: string;
  sortOrder: number;
}

export async function getAllActivities(): Promise<ActivityData[]> {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return activities as unknown as ActivityData[];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}
