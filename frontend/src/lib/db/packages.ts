import { TourPackage } from "@/components/ui/PackageCard";
import { apiFetch } from "../api";

export async function getFeaturedPackages(): Promise<TourPackage[]> {
  try {
    return await apiFetch<TourPackage[]>("/api/packages?featured=true&active=true&limit=3");
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return [];
  }
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | null> {
  try {
    return await apiFetch<TourPackage>(`/api/packages/${slug}`);
  } catch (error) {
    console.error(`Error fetching package ${slug}:`, error);
    return null;
  }
}

export async function getAllPackages(): Promise<TourPackage[]> {
  try {
    return await apiFetch<TourPackage[]>("/api/packages?active=true");
  } catch (error) {
    console.error('Error fetching all packages:', error);
    return [];
  }
}

export async function getPackagesByCategory(category: string): Promise<TourPackage[]> {
  try {
    return await apiFetch<TourPackage[]>(`/api/packages?category=${encodeURIComponent(category)}&active=true`);
  } catch (error) {
    console.error(`Error fetching packages for category ${category}:`, error);
    return [];
  }
}
