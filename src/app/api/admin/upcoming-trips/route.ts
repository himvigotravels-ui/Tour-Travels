import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-123";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

function bustCaches() {
  revalidatePath("/", "layout");
  revalidatePath("/upcoming-trips");
}

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const trips = await prisma.upcomingTrip.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
  });
  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const trip = await prisma.upcomingTrip.create({
      data: {
        slug: data.slug,
        title: data.title,
        destination: data.destination,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        durationDays: Number(data.durationDays) || 1,
        durationNights: Number(data.durationNights) || 0,
        pricePerPerson: Number(data.pricePerPerson) || 0,
        image: data.image || null,
        totalSeats: Number(data.totalSeats) || 0,
        seatsLeft: Number(data.seatsLeft) || 0,
        description: data.description || null,
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        sortOrder: Number(data.sortOrder) || 0,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
      },
    });
    bustCaches();
    return NextResponse.json(trip);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
