import "dotenv/config";

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const bcrypt = await import("bcryptjs");
  
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  
  console.log("🌱 Seeding database...");

  // Seed admin user
  const hashedPassword = await bcrypt.hash("Himvigo@2026!Secured#", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@himvigo.in" },
    update: { password: hashedPassword },
    create: { email: "admin@himvigo.in", password: hashedPassword },
  });
  console.log("✅ Admin user created/updated (admin@himvigo.in / Himvigo@2026!Secured#)");

  // Seed packages
  const packages = [
    { slug: "spiti-valley-expedition", title: "Spiti Valley Road Trip", location: "Spiti Valley", pricePerPerson: 14999, durationDays: 7, durationNights: 6, imageUrls: ["/images/destinations/spiti.png"], vehicleType: "Tempo Traveller", maxOccupancy: 12, description: "Embark on an unforgettable journey through the rugged terrains of Spiti.", itinerary: [{ day: 1, title: "Arrival in Shimla", activities: "Pickup from Shimla." }], inclusions: ["Transport", "Accommodation"], exclusions: ["Lunch", "Entry fees"], categories: ["adventure"], isFeatured: true, isActive: true },
    { slug: "manali-snow-retreat", title: "Manali Premium Snow Retreat", location: "Manali", pricePerPerson: 8999, durationDays: 4, durationNights: 3, imageUrls: ["/images/destinations/manali.png"], vehicleType: "Innova Crysta", maxOccupancy: 6, description: "A perfect short getaway to the Valley of the Gods.", itinerary: [{ day: 1, title: "Arrival in Manali", activities: "Check-in." }], inclusions: ["Private Innova", "Resort"], exclusions: ["Activity charges"], categories: ["family", "honeymoon"], isFeatured: true, isActive: true },
    { slug: "kasol-kheerganga-trek", title: "Kasol & Kheerganga Backpacking", location: "Kasol", pricePerPerson: 6499, durationDays: 4, durationNights: 3, imageUrls: ["/images/destinations/kasol.png"], vehicleType: "Tempo Traveller", maxOccupancy: 12, description: "Experience the hippie culture of Kasol.", itinerary: [{ day: 1, title: "Arrival in Kasol", activities: "Explore cafes." }], inclusions: ["Camps", "Meals"], exclusions: ["Lunch"], categories: ["adventure"], isFeatured: true, isActive: true },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({ where: { slug: pkg.slug }, update: pkg, create: pkg });
  }
  console.log("✅ Packages seeded");

  // Seed destinations
  const destinations = [
    { slug: "spiti-valley", name: "Spiti Valley", tagline: "The Middle Land", description: "Cold desert mountain valley.", bestTime: "June to October", altitude: "12,500 ft", vibe: "Adventure & Spiritual", image: "/images/destinations/spiti.png", highlights: ["Key Monastery", "Chandratal Lake"], sortOrder: 1 },
    { slug: "manali", name: "Manali", tagline: "Valley of the Gods", description: "A high-altitude Himalayan resort town.", bestTime: "Oct to June", altitude: "6,726 ft", vibe: "Romantic & Leisure", image: "/images/destinations/manali.png", highlights: ["Rohtang Pass", "Solang Valley"], sortOrder: 2 },
    { slug: "kasol", name: "Kasol", tagline: "Mini Israel of India", description: "A hamlet in Parvati Valley.", bestTime: "March to May", altitude: "5,180 ft", vibe: "Backpacking & Nature", image: "/images/destinations/kasol.png", highlights: ["Kheerganga Trek"], sortOrder: 3 },
    { slug: "shimla", name: "Shimla", tagline: "Queen of Hills", description: "Capital of Himachal Pradesh.", bestTime: "March to June", altitude: "7,467 ft", vibe: "Heritage & Family", image: "/images/destinations/shimla.png", highlights: ["The Ridge", "Mall Road"], sortOrder: 4 },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({ where: { slug: dest.slug }, update: dest, create: dest });
  }
  console.log("✅ Destinations seeded");

  // Seed testimonials
  const testimonials = [
    { name: "Rahul Sharma", text: "The Spiti expedition was mind-blowing.", packageName: "Spiti Valley Road Trip", rating: 5 },
    { name: "Priya Desai", text: "Booked a tempo traveller for my family. Seamless!", packageName: "Manali Premium Snow Retreat", rating: 5 },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }
  console.log("✅ Testimonials seeded");

  // Seed blogs
  const blogs = [
    { slug: "hidden-gems-spiti", title: "10 Hidden Gems in Spiti Valley", excerpt: "Secret villages most tourists miss.", content: "# Hidden Gems of Spiti\n\nDiscover.", author: "Aditi Negi", coverImage: "https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80", category: "Travel Guide", isPublished: true, publishedAt: new Date("2026-04-10") },
  ];
  for (const b of blogs) {
    await prisma.blog.upsert({ where: { slug: b.slug }, update: b, create: b });
  }
  console.log("✅ Blogs seeded");

  console.log("🎉 Seeding complete!");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
