import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function bustDestinationCaches(slug?: string | null) {
  revalidatePath("/", "layout");
  revalidatePath("/destinations");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const before = await prisma.destination.findUnique({
      where: { id },
      select: { slug: true },
    });
    const dest = await prisma.destination.update({ where: { id }, data });
    if (before?.slug && before.slug !== dest.slug) bustDestinationCaches(before.slug);
    bustDestinationCaches(dest.slug);
    return NextResponse.json(dest);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.destination.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.destination.delete({ where: { id } });
    bustDestinationCaches(existing?.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
