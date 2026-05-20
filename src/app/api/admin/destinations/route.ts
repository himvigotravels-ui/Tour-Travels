import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dest = await prisma.destination.create({ data });
    revalidatePath("/", "layout");
    revalidatePath("/destinations");
    if (dest.slug) revalidatePath(`/destinations/${dest.slug}`);
    return NextResponse.json(dest);
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
