import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function bustNavGroupCaches(slug: string, type: string) {
  revalidatePath("/", "layout");
  revalidatePath("/packages");
  revalidatePath("/destinations");
  if (type === "package") revalidatePath(`/packages/${slug}`);
  if (type === "destination") revalidatePath(`/destinations/${slug}`);
}

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

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const page = await prisma.internalPage.findUnique({
    where: { id: params.id },
    include: {
      packages: { select: { id: true } },
      destinations: { select: { id: true } },
    },
  });
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(page);
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const packageIds: string[] = Array.isArray(data.packageIds) ? data.packageIds : [];
    const destinationIds: string[] = Array.isArray(data.destinationIds) ? data.destinationIds : [];

    const page = await prisma.internalPage.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        tagline: data.tagline || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        type: data.type,
        isActive: data.isActive,
        isFeatured: data.isFeatured ?? false,
        sortOrder: Number(data.sortOrder) || 0,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogImage: data.ogImage || null,
        packages:
          data.type === "package"
            ? { set: packageIds.map((id) => ({ id })) }
            : { set: [] },
        destinations:
          data.type === "destination"
            ? { set: destinationIds.map((id) => ({ id })) }
            : { set: [] },
      },
      include: {
        packages: { select: { id: true } },
        destinations: { select: { id: true } },
      },
    });
    bustNavGroupCaches(page.slug, page.type);
    return NextResponse.json(page);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const existing = await prisma.internalPage.findUnique({
      where: { id: params.id },
      select: { slug: true, type: true },
    });
    await prisma.internalPage.delete({ where: { id: params.id } });
    if (existing) bustNavGroupCaches(existing.slug, existing.type);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
