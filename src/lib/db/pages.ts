import { prisma } from "@/lib/prisma";

export async function getInternalPages() {
  try {
    const pages = await prisma.internalPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        packages: { select: { id: true } },
        destinations: { select: { id: true } },
      },
    });
    return pages;
  } catch (error) {
    console.error("Error fetching internal pages:", error);
    return [];
  }
}

export async function getInternalPageBySlug(slug: string) {
  try {
    const page = await prisma.internalPage.findUnique({
      where: { slug },
      include: {
        packages: true,
        destinations: true,
      },
    });
    return page;
  } catch (error) {
    console.error(`Error fetching internal page ${slug}:`, error);
    return null;
  }
}
