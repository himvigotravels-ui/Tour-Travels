import { prisma } from "@/lib/prisma";

export interface TestimonialData {
  id?: string;
  name: string;
  text: string;
  packageName: string;
  rating: number;
}

export async function getAllTestimonials(): Promise<TestimonialData[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return testimonials as unknown as TestimonialData[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}
