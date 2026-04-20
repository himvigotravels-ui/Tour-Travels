import { prisma } from "@/lib/prisma";

export interface BlogData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  category: string;
  isPublished: boolean;
  publishedAt: Date;
}

export async function getAllBlogs(): Promise<BlogData[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' }
    });
    return blogs as unknown as BlogData[];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getLatestBlogs(limit = 3): Promise<BlogData[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit
    });
    return blogs as unknown as BlogData[];
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug }
    });
    return blog as unknown as BlogData | null;
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}
