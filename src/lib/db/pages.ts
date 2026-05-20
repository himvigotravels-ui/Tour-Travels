import { apiFetch } from "../api";

export async function getInternalPages() {
  try {
    return await apiFetch<any[]>("/api/internal-pages");
  } catch (error) {
    console.error("Error fetching internal pages:", error);
    return [];
  }
}

export async function getInternalPageBySlug(slug: string) {
  try {
    return await apiFetch<any>(`/api/internal-pages/${slug}`);
  } catch (error) {
    console.error(`Error fetching internal page ${slug}:`, error);
    return null;
  }
}
