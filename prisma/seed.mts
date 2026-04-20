import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
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
  console.log("✅ Admin user created/updated");

  // Seed destinations
  const destinations = [
    { slug: "spiti-valley", name: "Spiti Valley", tagline: "The Middle Land", description: "Cold desert mountain valley.", bestTime: "June to October", altitude: "12,500 ft", vibe: "Adventure & Spiritual", image: "/images/destinations/spiti.png", highlights: ["Key Monastery", "Chandratal Lake"], sortOrder: 1 },
    { slug: "manali", name: "Manali", tagline: "Valley of the Gods", description: "A high-altitude Himalayan resort town.", bestTime: "Oct to June", altitude: "6,726 ft", vibe: "Romantic & Leisure", image: "/images/destinations/manali.png", highlights: ["Rohtang Pass", "Solang Valley"], sortOrder: 2 },
    { slug: "kasol", name: "Kasol", tagline: "Mini Israel of India", description: "A hamlet in Parvati Valley.", bestTime: "March to May", altitude: "5,180 ft", vibe: "Backpacking & Nature", image: "/images/destinations/kasol.png", highlights: ["Kheerganga Trek"], sortOrder: 3 },
    { slug: "shimla", name: "Shimla", tagline: "Queen of Hills", description: "Capital of Himachal Pradesh.", bestTime: "March to June", altitude: "7,467 ft", vibe: "Heritage & Family", image: "/images/destinations/shimla.png", highlights: ["The Ridge", "Mall Road"], sortOrder: 4 },
    { slug: "dharamshala", name: "Dharamshala", tagline: "Little Lhasa", description: "The winter capital of Himachal Pradesh.", bestTime: "Feb to June", altitude: "4,780 ft", vibe: "Spiritual & Nature", image: "/images/destinations/dharamshala.png", highlights: ["McLeod Ganj", "Triund Trek"], sortOrder: 5 }
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({ where: { slug: dest.slug }, update: dest, create: dest });
  }
  console.log("✅ Destinations seeded");

  // Seed packages
  const packages = [
    { slug: "spiti-valley-expedition", title: "Spiti Valley Road Trip", location: "Spiti Valley", pricePerPerson: 14999, durationDays: 7, durationNights: 6, imageUrls: ["/images/destinations/spiti.png"], vehicleType: "Tempo Traveller", maxOccupancy: 12, description: "Embark on an unforgettable journey through the rugged terrains of Spiti.", itinerary: [{ day: 1, title: "Arrival in Shimla", activities: "Pickup from Shimla." }], inclusions: ["Transport", "Accommodation"], exclusions: ["Lunch", "Entry fees"], categories: ["adventure"], isFeatured: true, isActive: true },
    { slug: "manali-snow-retreat", title: "Manali Premium Snow Retreat", location: "Manali", pricePerPerson: 8999, durationDays: 4, durationNights: 3, imageUrls: ["/images/destinations/manali.png"], vehicleType: "Innova Crysta", maxOccupancy: 6, description: "A perfect short getaway to the Valley of the Gods.", itinerary: [{ day: 1, title: "Arrival in Manali", activities: "Check-in." }], inclusions: ["Private Innova", "Resort"], exclusions: ["Activity charges"], categories: ["family", "honeymoon"], isFeatured: true, isActive: true },
    { slug: "kasol-kheerganga-trek", title: "Kasol & Kheerganga Backpacking", location: "Kasol", pricePerPerson: 6499, durationDays: 4, durationNights: 3, imageUrls: ["/images/destinations/kasol.png"], vehicleType: "Tempo Traveller", maxOccupancy: 12, description: "Experience the hippie culture of Kasol.", itinerary: [{ day: 1, title: "Arrival in Kasol", activities: "Explore cafes." }], inclusions: ["Camps", "Meals"], exclusions: ["Lunch"], categories: ["adventure"], isFeatured: true, isActive: true },
    { slug: "custom-kinnaur-tour", title: "Custom Kinnaur Tour", location: "Kinnaur", pricePerPerson: 12500, durationDays: 5, durationNights: 4, imageUrls: ["/images/destinations/kinnaur.png"], vehicleType: "SUV", maxOccupancy: 6, description: "Explore the offbeat tracks of Kinnaur.", itinerary: [{ day: 1, title: "Shimla to Kalpa", activities: "Drive to Kalpa." }], inclusions: ["Transport", "Meals"], exclusions: ["Personal expenses"], categories: ["offbeat"], isFeatured: true, isActive: true }
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({ where: { slug: pkg.slug }, update: pkg, create: pkg });
  }
  console.log("✅ Packages seeded");

  // Seed Activities
  const activities = [
    { title: "Mountain Trekking", location: "Spiti & Manali", description: "Explore the untouched trails of the Great Himalayan National Park and Spiti Valley.", image: "/images/activities/trekking.png", icon: "Compass", sortOrder: 1, isActive: true },
    { title: "River Rafting", location: "Kullu Valley", description: "Battle the white water rapids of Beas River for an adrenaline-pumping experience.", image: "/images/activities/rafting.png", icon: "Zap", sortOrder: 2, isActive: true },
    { title: "Paragliding", location: "Bir Billing", description: "Soar like a bird over the lush green valleys of Bir Billing, the paragliding capital.", image: "/images/activities/paragliding.png", icon: "MapPin", sortOrder: 3, isActive: true },
    { title: "Alpine Camping", location: "Spiti & Chandratal", description: "Sleep under a million stars in the high-altitude cold deserts and lush meadows.", image: "/images/activities/camping.png", icon: "Compass", sortOrder: 4, isActive: true },
    { title: "Snow Skiing", location: "Solang Valley", description: "Slide down the powdery slopes of Solang Valley and Kufri.", image: "/images/activities/skiing.png", icon: "Snowflake", sortOrder: 5, isActive: true }
  ];
  for (const act of activities) {
    const exists = await prisma.activity.findFirst({ where: { title: act.title } });
    if (!exists) await prisma.activity.create({ data: act });
  }
  console.log("✅ Activities seeded");

  // Seed Cab Vehicles
  const cabVehicles = [
    { name: "Premium SUV", model: "Toyota Innova Crysta", capacity: "6-7 Pasengers", ideal: "Family trips, Long expeditions", features: ["Dual AC", "Premium Seating", "Ample Luggage space", "Expert Mountain Driver"], image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", isActive: true },
    { name: "Luxury Sedan", model: "Maruti Suzuki Dzire / Toyota Etios", capacity: "4 Passengers", ideal: "Couples, Small groups", features: ["AC", "Bluetooth Music", "Clean Interiors", "On-time Pickup"], image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", isActive: true },
    { name: "Force Traveler", model: "12 / 17 Seater", capacity: "Up to 17 Passengers", ideal: "Corporate groups, Large families", features: ["High Roof", "Reclining Seats", "Music System", "Dedicated Support"], image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", isActive: true }
  ];
  for (const v of cabVehicles) {
    const exists = await prisma.cabVehicle.findFirst({ where: { name: v.name } });
    if (!exists) await prisma.cabVehicle.create({ data: v });
  }
  
  // Seed Cab Routes
  const cabRoutes = [
    { fromCity: "Chandigarh", toCity: "Manali", price: "Starts from ₹4,500", duration: "8-9 Hours", isActive: true },
    { fromCity: "Chandigarh", toCity: "Shimla", price: "Starts from ₹3,000", duration: "3-4 Hours", isActive: true },
    { fromCity: "Manali", toCity: "Spiti Valley", price: "Inquire for Quote", duration: "Expedition", isActive: true },
  ];
  for (const r of cabRoutes) {
    const exists = await prisma.cabRoute.findFirst({ where: { fromCity: r.fromCity, toCity: r.toCity } });
    if (!exists) await prisma.cabRoute.create({ data: r });
  }
  console.log("✅ Cab Vehicles & Routes seeded");

  // Seed testimonials
  const testimonials = [
    { name: "Rahul Sharma", text: "The Spiti expedition was completely mind-blowing. The driver was highly experienced on dangerous roads and the homestays were incredibly warm.", packageName: "Spiti Valley Road Trip", rating: 5, isActive: true },
    { name: "Priya Desai", text: "Booked a tempo traveller for my family of 10. Seamless experience from Chandigarh pickup to Manali drop. Highly recommended!", packageName: "Manali Premium Snow Retreat", rating: 5, isActive: true },
    { name: "Arjun Mehta", text: "I wanted an offbeat track in Kinnaur, and Himvigo delivered. Local knowledge makes a huge difference.", packageName: "Custom Kinnaur Tour", rating: 5, isActive: true }
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
