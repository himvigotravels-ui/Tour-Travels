import { apiFetch } from "../api";

export interface DestinationData {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestTime: string;
  altitude: string;
  vibe: string;
  image: string;
  highlights: string[];
  categories: string[];
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export async function getAllDestinations(): Promise<DestinationData[]> {
  try {
    return await apiFetch<DestinationData[]>("/api/destinations?active=true");
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getDestinationBySlug(slug: string): Promise<DestinationData | null> {
  try {
    return await apiFetch<DestinationData>(`/api/destinations/${slug}`);
  } catch (error) {
    console.error(`Error fetching destination ${slug}:`, error);
    return null;
  }
}
