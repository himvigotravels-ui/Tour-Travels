import { apiFetch } from "../api";

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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  tags?: string[];
}

export async function getAllBlogs(): Promise<BlogData[]> {
  try {
    return await apiFetch<BlogData[]>("/api/blogs?published=true");
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getLatestBlogs(limit = 3): Promise<BlogData[]> {
  try {
    return await apiFetch<BlogData[]>(`/api/blogs?published=true&limit=${limit}`);
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  try {
    return await apiFetch<BlogData>(`/api/blogs/${slug}`);
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}
