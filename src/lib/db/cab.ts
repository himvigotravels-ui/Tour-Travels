import { prisma } from "@/lib/prisma";

export async function getCabVehicles() {
  try {
    return await prisma.cabVehicle.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching cab vehicles:", error);
    return [];
  }
}

export async function getCabRoutes() {
  try {
    return await prisma.cabRoute.findMany({
      where: { isActive: true },
      orderBy: { fromCity: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching cab routes:", error);
    return [];
  }
}
