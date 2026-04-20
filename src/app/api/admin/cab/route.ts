import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [vehicles, routes] = await Promise.all([
      prisma.cabVehicle.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.cabRoute.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return NextResponse.json({ vehicles, routes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
