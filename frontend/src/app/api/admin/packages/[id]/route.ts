import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function bustPackageCaches(slug?: string | null) {
  revalidatePath("/", "layout");
  revalidatePath("/packages");
  if (slug) revalidatePath(`/packages/${slug}`);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const before = await prisma.package.findUnique({ where: { id }, select: { slug: true } });
    const pkg = await prisma.package.update({ where: { id }, data });
    // Bust both old and new slug — admin may have renamed it
    if (before?.slug && before.slug !== pkg.slug) bustPackageCaches(before.slug);
    bustPackageCaches(pkg.slug);
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.package.findUnique({ where: { id }, select: { slug: true } });
    await prisma.package.delete({ where: { id } });
    bustPackageCaches(existing?.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
