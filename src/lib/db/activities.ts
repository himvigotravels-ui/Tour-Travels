import { apiFetch } from "../api";

export interface ActivityData {
  id?: string;
  title: string;
  description: string;
  image: string;
  location: string;
  icon: string;
  sortOrder: number;
}

export async function getAllActivities(): Promise<ActivityData[]> {
  try {
    return await apiFetch<ActivityData[]>("/api/activities");
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}
