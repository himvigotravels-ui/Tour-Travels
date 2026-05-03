import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function bustNavGroupCaches(slug: string, type: string) {
  // Public listing surfaces that consume the group
  revalidatePath("/", "layout");
  revalidatePath("/packages");
  revalidatePath("/destinations");
  // The slug-driven inner page
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

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pages = await prisma.internalPage.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      packages: { select: { id: true } },
      destinations: { select: { id: true } },
    },
  });
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const packageIds: string[] = Array.isArray(data.packageIds) ? data.packageIds : [];
    const destinationIds: string[] = Array.isArray(data.destinationIds) ? data.destinationIds : [];

    const page = await prisma.internalPage.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        tagline: data.tagline || null,
        content: data.content || null,
        coverImage: data.coverImage || null,
        type: data.type,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        sortOrder: Number(data.sortOrder) || 0,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogImage: data.ogImage || null,
        packages:
          data.type === "package" && packageIds.length
            ? { connect: packageIds.map((id) => ({ id })) }
            : undefined,
        destinations:
          data.type === "destination" && destinationIds.length
            ? { connect: destinationIds.map((id) => ({ id })) }
            : undefined,
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
