import { apiFetch } from "../api";

export interface TestimonialData {
  id?: string;
  name: string;
  text: string;
  packageName: string;
  rating: number;
}

export async function getAllTestimonials(): Promise<TestimonialData[]> {
  try {
    return await apiFetch<TestimonialData[]>("/api/testimonials");
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}
