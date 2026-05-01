import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Unsplash images (host whitelisted in next.config.ts)
const IMG = {
  spiti:
    "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=1200&q=80",
  manali:
    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80",
  kasol:
    "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=1200&q=80",
  shimla:
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
  dharamshala:
    "https://images.unsplash.com/photo-1561361398-a8d3aaae9e6e?auto=format&fit=crop&w=1200&q=80",
  kinnaur:
    "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=80",
  trek:
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
  rafting:
    "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80",
  paragliding:
    "https://images.unsplash.com/photo-1473444330585-93a48b18ba79?auto=format&fit=crop&w=1200&q=80",
  camping:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  skiing:
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=1200&q=80",
  innova:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  sedan:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
  tempo:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  blogSpiti:
    "https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=1200&q=80",
  blogTrek:
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
  blogManali:
    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80",
  blogPacking:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
  blogFood:
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80",
};

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding database...");

  // ── Admin ──────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Himvigo@2026!Secured#", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@himvigo.in" },
    update: { password: hashedPassword },
    create: { email: "admin@himvigo.in", password: hashedPassword },
  });
  console.log("✅ Admin user");

  // ── Destinations ───────────────────────────────────────────────────
  const destinations = [
    {
      slug: "spiti-valley",
      name: "Spiti Valley",
      tagline: "The Middle Land",
      description:
        "A cold-desert mountain valley framed by ancient monasteries, turquoise lakes and dramatic ochre cliffs. Spiti is the slowest, quietest, most other-worldly corner of Himachal.",
      bestTime: "June to October",
      altitude: "12,500 ft",
      vibe: "Adventure & Spiritual",
      image: IMG.spiti,
      highlights: [
        "Key Monastery sunrise",
        "Chandratal Lake camp",
        "Hikkim — world's highest post office",
        "Dhankar Gompa",
      ],
      sortOrder: 1,
      categories: ["adventure", "offbeat", "spiritual"],
    },
    {
      slug: "manali",
      name: "Manali",
      tagline: "Valley of the Gods",
      description:
        "The Beas River, apple orchards and snow-capped peaks frame this iconic Himachali resort town — perfect for couples, families and first-time mountain travellers alike.",
      bestTime: "October to June",
      altitude: "6,726 ft",
      vibe: "Romantic & Leisure",
      image: IMG.manali,
      highlights: [
        "Solang Valley snow",
        "Old Manali cafés",
        "Hadimba Devi Temple",
        "Atal Tunnel",
      ],
      sortOrder: 2,
      categories: ["family", "honeymoon"],
    },
    {
      slug: "kasol",
      name: "Kasol",
      tagline: "Mini Israel of India",
      description:
        "A Parvati-Valley hamlet of pinewood cafés, hippy guesthouses and the gateway to the Kheerganga trek.",
      bestTime: "March to June",
      altitude: "5,180 ft",
      vibe: "Backpacking & Nature",
      image: IMG.kasol,
      highlights: ["Kheerganga Trek", "Tosh village walks", "Manikaran hot springs"],
      sortOrder: 3,
      categories: ["adventure", "offbeat"],
    },
    {
      slug: "shimla",
      name: "Shimla",
      tagline: "Queen of Hills",
      description:
        "Colonial-era streets, deodar forests and a toy train ride — Himachal's capital is the easiest mountain weekend in India.",
      bestTime: "March to June",
      altitude: "7,467 ft",
      vibe: "Heritage & Family",
      image: IMG.shimla,
      highlights: ["The Ridge", "Mall Road", "Toy Train", "Jakhoo Temple"],
      sortOrder: 4,
      categories: ["family"],
    },
    {
      slug: "dharamshala",
      name: "Dharamshala",
      tagline: "Little Lhasa",
      description:
        "Home to the Dalai Lama, surrounded by the Dhauladhar range. A quiet base for Triund treks, Tibetan culture and rainy-season escapes.",
      bestTime: "February to June",
      altitude: "4,780 ft",
      vibe: "Spiritual & Nature",
      image: IMG.dharamshala,
      highlights: ["McLeod Ganj", "Triund Trek", "Bhagsu Falls", "Norbulingka Institute"],
      sortOrder: 5,
      categories: ["spiritual", "family"],
    },
    {
      slug: "kinnaur",
      name: "Kinnaur",
      tagline: "Land of Apples & Apricots",
      description:
        "Hidden Buddhist villages, hanging orchards and the dramatic Kinnaur-Kailash range — Himachal's most scenic offbeat circuit.",
      bestTime: "April to October",
      altitude: "9,200 ft",
      vibe: "Offbeat Adventure",
      image: IMG.kinnaur,
      highlights: ["Kalpa apple orchards", "Sangla Valley", "Chitkul village", "Reckong Peo"],
      sortOrder: 6,
      categories: ["offbeat", "adventure"],
    },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
  }
  console.log("✅ Destinations");

  // ── Packages ───────────────────────────────────────────────────────
  const packages = [
    {
      slug: "spiti-valley-expedition",
      title: "Spiti Valley 7-Day Expedition",
      location: "Spiti Valley",
      pricePerPerson: 18999,
      durationDays: 7,
      durationNights: 6,
      imageUrls: [IMG.spiti, IMG.kinnaur, IMG.trek],
      vehicleType: "Tempo Traveller",
      maxOccupancy: 12,
      description:
        "Loop the Spiti circuit through Kinnaur — Kalpa, Nako, Tabo, Kaza, Hikkim and the iconic Chandratal Lake camp.",
      itinerary: [
        { day: 1, title: "Shimla → Sarahan", activities: "Pickup, Hatu Peak detour, overnight at Sarahan." },
        { day: 2, title: "Sarahan → Kalpa", activities: "Drive along the Sutlej, sunset Kinnaur-Kailash view." },
        { day: 3, title: "Kalpa → Tabo", activities: "Cross into Spiti, visit 1000-year-old Tabo monastery." },
        { day: 4, title: "Tabo → Kaza", activities: "Dhankar Gompa & lake, Pin Valley views." },
        { day: 5, title: "Kaza local circuit", activities: "Key, Kibber, Hikkim, Komic — the high villages." },
        { day: 6, title: "Kaza → Chandratal", activities: "Cross Kunzum La, camp under Chandratal stars." },
        { day: 7, title: "Chandratal → Manali", activities: "Atal Tunnel drop, trip ends in Manali." },
      ],
      inclusions: [
        "All transfers in Tempo Traveller",
        "6 nights accommodation (twin sharing)",
        "Daily breakfast & dinner",
        "Experienced mountain driver",
        "All inner-line permits",
      ],
      exclusions: ["Lunches", "Personal expenses", "Monument entry fees", "Travel insurance"],
      categories: ["adventure", "offbeat"],
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "manali-snow-retreat",
      title: "Manali Premium Snow Retreat",
      location: "Manali",
      pricePerPerson: 12999,
      durationDays: 4,
      durationNights: 3,
      imageUrls: [IMG.manali, IMG.skiing, IMG.camping],
      vehicleType: "Toyota Innova",
      maxOccupancy: 6,
      description:
        "A short, comfortable Manali getaway with snow-point access, Solang Valley adventures and a luxury riverside stay.",
      itinerary: [
        { day: 1, title: "Arrival in Manali", activities: "Pickup from Bhuntar / Manali, riverside check-in." },
        { day: 2, title: "Solang Valley", activities: "Snow point, ropeway, paragliding (seasonal)." },
        { day: 3, title: "Old Manali walk", activities: "Hadimba Temple, Mall Road, café trail." },
        { day: 4, title: "Departure", activities: "Drop to Bhuntar / Manali bus stand." },
      ],
      inclusions: [
        "Private Innova for sightseeing",
        "3 nights premium resort",
        "Daily breakfast",
        "All toll & parking",
      ],
      exclusions: ["Activity charges", "Lunches & dinners", "Snow gear rental"],
      categories: ["family", "honeymoon"],
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "kasol-kheerganga-trek",
      title: "Kasol & Kheerganga Backpacking",
      location: "Kasol",
      pricePerPerson: 6499,
      durationDays: 4,
      durationNights: 3,
      imageUrls: [IMG.kasol, IMG.trek, IMG.camping],
      vehicleType: "Tempo Traveller",
      maxOccupancy: 12,
      description:
        "Cafés in Kasol, hot-spring camp at Kheerganga and a short detour to Tosh village. Fits the backpacker budget.",
      itinerary: [
        { day: 1, title: "Delhi → Kasol", activities: "Overnight Volvo to Bhuntar, transfer to Kasol." },
        { day: 2, title: "Kheerganga trek", activities: "11km uphill, hot springs camp, bonfire." },
        { day: 3, title: "Tosh village", activities: "Trek down, drive to Tosh, café crawl." },
        { day: 4, title: "Departure", activities: "Drive to Bhuntar, overnight Volvo to Delhi." },
      ],
      inclusions: ["Volvo from Delhi", "Camps at Kheerganga", "Hostel in Kasol", "Trek meals"],
      exclusions: ["Personal expenses", "Lunches in Kasol"],
      categories: ["adventure"],
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "shimla-manali-family",
      title: "Shimla Manali Family Delight",
      location: "Shimla & Manali",
      pricePerPerson: 16500,
      durationDays: 6,
      durationNights: 5,
      imageUrls: [IMG.shimla, IMG.manali, IMG.skiing],
      vehicleType: "Sedan",
      maxOccupancy: 4,
      description:
        "The classic Himachal tour covering the colonial charm of Shimla and the snowy beauty of Manali — built for families.",
      itinerary: [
        { day: 1, title: "Chandigarh → Shimla", activities: "Drive up, Mall Road evening." },
        { day: 2, title: "Shimla local", activities: "Kufri, Jakhoo Temple, toy train." },
        { day: 3, title: "Shimla → Manali", activities: "Scenic drive, evening at Mall Road Manali." },
        { day: 4, title: "Solang Valley", activities: "Cable car, snow activities." },
        { day: 5, title: "Manali leisure", activities: "Old Manali cafés, Hadimba Temple." },
        { day: 6, title: "Departure", activities: "Drop to Chandigarh / Bhuntar." },
      ],
      inclusions: ["Sedan transfers", "5 nights 3-star stay", "Breakfast daily", "Driver allowance"],
      exclusions: ["Activity tickets", "Lunches & dinners"],
      categories: ["family"],
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "dharamshala-triund-trek",
      title: "Dharamshala & Triund Weekend",
      location: "Dharamshala",
      pricePerPerson: 5999,
      durationDays: 3,
      durationNights: 2,
      imageUrls: [IMG.dharamshala, IMG.trek, IMG.camping],
      vehicleType: "SUV",
      maxOccupancy: 6,
      description:
        "A long weekend: McLeod Ganj cafés, Bhagsu Falls and an overnight camp atop Triund with sunrise over the Dhauladhars.",
      itinerary: [
        { day: 1, title: "Arrival in McLeod Ganj", activities: "Café trail, Tsuglagkhang complex." },
        { day: 2, title: "Triund trek", activities: "9km hike, summit camp, sunset views." },
        { day: 3, title: "Sunrise & descent", activities: "Sunrise, descend, departure." },
      ],
      inclusions: ["Camp at Triund", "1 night McLeod Ganj stay", "Trek guide", "Meals on trek"],
      exclusions: ["Travel to Dharamshala", "Personal expenses"],
      categories: ["spiritual", "adventure"],
      isFeatured: true,
      isActive: true,
    },
    {
      slug: "custom-kinnaur-tour",
      title: "Custom Kinnaur Tour",
      location: "Kinnaur",
      pricePerPerson: 12500,
      durationDays: 5,
      durationNights: 4,
      imageUrls: [IMG.kinnaur, IMG.spiti],
      vehicleType: "SUV",
      maxOccupancy: 6,
      description:
        "Explore the offbeat Kinnaur tracks — Kalpa, Sangla, Chitkul. Customisable for honeymooners or photographers.",
      itinerary: [
        { day: 1, title: "Shimla → Kalpa", activities: "Long drive along the Sutlej." },
        { day: 2, title: "Kalpa local", activities: "Apple orchards, Reckong Peo." },
        { day: 3, title: "Kalpa → Sangla", activities: "Move to Sangla Valley." },
        { day: 4, title: "Chitkul day-trip", activities: "Last village before the Tibet border." },
        { day: 5, title: "Return", activities: "Drive back to Shimla." },
      ],
      inclusions: ["SUV transfers", "Stays in heritage homestays", "Breakfast daily"],
      exclusions: ["Personal expenses", "Liquor"],
      categories: ["offbeat"],
      isFeatured: false,
      isActive: true,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log("✅ Packages");

  // ── Activities ─────────────────────────────────────────────────────
  const activities = [
    { title: "Mountain Trekking", location: "Spiti & Manali", description: "Explore untouched trails of GHNP and Spiti.", image: IMG.trek, icon: "Compass", sortOrder: 1, isActive: true },
    { title: "River Rafting", location: "Kullu Valley", description: "White-water rapids of the Beas — adrenaline guaranteed.", image: IMG.rafting, icon: "Waves", sortOrder: 2, isActive: true },
    { title: "Paragliding", location: "Bir Billing", description: "Soar above the Dhauladhars at the world's second-highest paragliding site.", image: IMG.paragliding, icon: "Wind", sortOrder: 3, isActive: true },
    { title: "Alpine Camping", location: "Spiti & Chandratal", description: "Sleep under a million stars in cold-desert and meadow camps.", image: IMG.camping, icon: "Tent", sortOrder: 4, isActive: true },
    { title: "Snow Skiing", location: "Solang Valley", description: "Powder slopes of Solang and Kufri — beginner-friendly.", image: IMG.skiing, icon: "Snowflake", sortOrder: 5, isActive: true },
  ];
  for (const act of activities) {
    const exists = await prisma.activity.findFirst({ where: { title: act.title } });
    if (exists) {
      await prisma.activity.update({ where: { id: exists.id }, data: act });
    } else {
      await prisma.activity.create({ data: act });
    }
  }
  console.log("✅ Activities");

  // ── Cab Vehicles & Routes ──────────────────────────────────────────
  const cabVehicles = [
    { name: "Premium SUV", model: "Toyota Innova Crysta", capacity: "6-7 Passengers", ideal: "Family trips, long expeditions", features: ["Dual AC", "Premium Seating", "Ample Luggage", "Mountain Driver"], image: IMG.innova, isActive: true },
    { name: "Luxury Sedan", model: "Maruti Dzire / Toyota Etios", capacity: "4 Passengers", ideal: "Couples, small groups", features: ["AC", "Bluetooth Music", "Clean Interiors", "On-time Pickup"], image: IMG.sedan, isActive: true },
    { name: "Force Traveller", model: "12 / 17 Seater", capacity: "Up to 17 Passengers", ideal: "Corporate groups, large families", features: ["High Roof", "Reclining Seats", "Music System", "Dedicated Support"], image: IMG.tempo, isActive: true },
  ];
  for (const v of cabVehicles) {
    const exists = await prisma.cabVehicle.findFirst({ where: { name: v.name } });
    if (exists) {
      await prisma.cabVehicle.update({ where: { id: exists.id }, data: v });
    } else {
      await prisma.cabVehicle.create({ data: v });
    }
  }
  const cabRoutes = [
    { fromCity: "Chandigarh", toCity: "Manali", price: "Starts from ₹4,500", duration: "8-9 Hours", isActive: true },
    { fromCity: "Chandigarh", toCity: "Shimla", price: "Starts from ₹3,000", duration: "3-4 Hours", isActive: true },
    { fromCity: "Delhi", toCity: "Manali", price: "Starts from ₹8,500", duration: "12-14 Hours", isActive: true },
    { fromCity: "Manali", toCity: "Spiti Valley", price: "Inquire for quote", duration: "Multi-day expedition", isActive: true },
    { fromCity: "Shimla", toCity: "Sangla / Chitkul", price: "Starts from ₹9,500", duration: "9-10 Hours", isActive: true },
  ];
  for (const r of cabRoutes) {
    const exists = await prisma.cabRoute.findFirst({ where: { fromCity: r.fromCity, toCity: r.toCity } });
    if (exists) {
      await prisma.cabRoute.update({ where: { id: exists.id }, data: r });
    } else {
      await prisma.cabRoute.create({ data: r });
    }
  }
  console.log("✅ Cab vehicles & routes");

  // ── Testimonials ───────────────────────────────────────────────────
  const testimonials = [
    { name: "Rahul Sharma", text: "The Spiti expedition was completely mind-blowing. The driver was experienced on dangerous roads and the homestays were warm and authentic. Easily the best mountain trip I've taken.", packageName: "Spiti Valley 7-Day Expedition", rating: 5, isActive: true },
    { name: "Priya Desai", text: "Booked a tempo traveller for my family of 10. Seamless from Chandigarh pickup to Manali drop. The kids loved Solang and the driver took us to local food spots we'd never have found.", packageName: "Manali Premium Snow Retreat", rating: 5, isActive: true },
    { name: "Arjun Mehta", text: "I wanted an offbeat track in Kinnaur, and Himvigo delivered. Local knowledge makes a huge difference — Chitkul at sunrise was unforgettable.", packageName: "Custom Kinnaur Tour", rating: 5, isActive: true },
    { name: "Neha Gupta", text: "Smooth booking process and a great itinerary. Shimla and Manali were both beautiful. The driver was punctual and polite throughout.", packageName: "Shimla Manali Family Delight", rating: 5, isActive: true },
    { name: "Amit Kumar", text: "Kheerganga trek was an amazing experience. Our guide was very friendly and made sure we were comfortable. Food at the camp was delicious.", packageName: "Kasol & Kheerganga Backpacking", rating: 5, isActive: true },
    { name: "Simran Kaur", text: "Triund camp at sunrise was magical. Our crew handled everything — gear, food, safety — so we just had to walk and enjoy. Highly recommended.", packageName: "Dharamshala & Triund Weekend", rating: 5, isActive: true },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (exists) {
      await prisma.testimonial.update({ where: { id: exists.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("✅ Testimonials");

  // ── Blogs ──────────────────────────────────────────────────────────
  const blogs = [
    {
      slug: "hidden-gems-spiti",
      title: "10 Hidden Gems in Spiti Valley",
      excerpt: "Secret villages, river bends and shrines most travellers never reach. A local-guided shortlist.",
      content: "# Hidden Gems of Spiti\n\nMost itineraries stop at Key, Kaza and Chandratal. Here are the lesser-known places we love...\n\n## 1. Komic — the world's highest village\n\nAt 4,587m...\n\n## 2. Hikkim post office\n\nDrop a postcard from the highest post office on the planet...",
      author: "Aditi Negi",
      coverImage: IMG.blogSpiti,
      category: "Travel Guide",
      tags: ["spiti", "offbeat", "guide"],
      isPublished: true,
      publishedAt: new Date("2026-04-10"),
    },
    {
      slug: "kheerganga-packing-list",
      title: "What to Pack for the Kheerganga Trek",
      excerpt: "A complete packing checklist for your backpacking trip to Kheerganga — tested by our trek leads.",
      content: "# Kheerganga Packing\n\nThe trek is short (11km) but the weather is fickle. Here's what you actually need...\n\n## Gear\n\n- Trekking shoes with grip\n- Rain jacket\n- Headlamp\n\n## Layers\n\n...",
      author: "Simran Kaur",
      coverImage: IMG.blogPacking,
      category: "Trek Tips",
      tags: ["trek", "packing", "kheerganga"],
      isPublished: true,
      publishedAt: new Date("2026-04-18"),
    },
    {
      slug: "manali-vs-shimla",
      title: "Manali or Shimla? How to Pick for Your First Trip",
      excerpt: "Both are iconic. The right choice depends on your travel style — here's the honest breakdown.",
      content: "# Manali or Shimla?\n\n## Pick Shimla if\n\nYou want a low-effort, family-friendly weekend...\n\n## Pick Manali if\n\nYou want snow, adventure sports and a chance to extend into Spiti...",
      author: "Aditi Negi",
      coverImage: IMG.blogManali,
      category: "Travel Guide",
      tags: ["manali", "shimla", "guide"],
      isPublished: true,
      publishedAt: new Date("2026-04-22"),
    },
    {
      slug: "himachali-food-trail",
      title: "A Foodie's Trail Through Himachal",
      excerpt: "Sidu, chha gosht, babru and the best dhaba stops between Shimla and Spiti.",
      content: "# Eat Like a Local\n\n## Sidu\n\nA steamed wheat bun stuffed with poppy seeds...\n\n## Chha Gosht\n\nMutton in a yogurt-besan gravy — Mandi's signature.",
      author: "Mohit Thakur",
      coverImage: IMG.blogFood,
      category: "Food",
      tags: ["food", "culture"],
      isPublished: true,
      publishedAt: new Date("2026-04-26"),
    },
    {
      slug: "best-time-spiti",
      title: "When Is the Best Time to Visit Spiti?",
      excerpt: "Roads, weather, festivals and what each season looks like in the Middle Land.",
      content: "# Best time for Spiti\n\nThe answer depends on whether you want snow, festivals or open passes...",
      author: "Aditi Negi",
      coverImage: IMG.blogTrek,
      category: "Travel Guide",
      tags: ["spiti", "planning"],
      isPublished: true,
      publishedAt: new Date("2026-04-28"),
    },
  ];
  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log("✅ Blogs");

  // ── Internal pages (nav-groups) ────────────────────────────────────
  const internalPages = [
    { title: "Honeymoon Packages", slug: "honeymoon", type: "package", sortOrder: 1, tagline: "Romantic Himalayan escapes" },
    { title: "Family Packages", slug: "family", type: "package", sortOrder: 2, tagline: "Trips that work for every age" },
    { title: "Adventure Tours", slug: "adventure", type: "package", sortOrder: 3, tagline: "Trek, raft, ride and ski" },
    { title: "Offbeat Himachal", slug: "offbeat", type: "package", sortOrder: 4, tagline: "The Himachal most travellers miss" },
    { title: "Spiritual Journeys", slug: "spiritual", type: "package", sortOrder: 5, tagline: "Monasteries, meditations, mountains" },
  ];
  for (const page of internalPages) {
    await prisma.internalPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log("✅ Internal pages");

  // ── Default site settings (only set if blank) ──────────────────────
  const defaults: Record<string, string> = {
    site_name: "Himvigo Tours",
    site_phone: "+91 98055 14018",
    site_whatsapp: "919805514018",
    site_email: "hello@himvigo.in",
    hero_headline: "Your Himachal Adventure Starts Here",
    hero_subheadline:
      "Safe rides. Local expertise. Unforgettable journeys through the heart of the Himalayas.",
    hero_cta_text: "Plan Your Trip",
    hero_cta_call: "Call Us Now",
    why_choose_us_json: JSON.stringify([
      { title: "Verified Drivers", desc: "Every driver is background-checked and skilled in navigating Himachal's mountain roads safely.", image: IMG.spiti, icon: "RiShieldCheckLine" },
      { title: "100% Local Experts", desc: "Our guides are born and raised in the Himalayas. They know the hidden trails and the best ways to keep you safe.", image: IMG.dharamshala, icon: "RiGroupLine" },
      { title: "Award Winning", desc: "Recognised by Himachal Tourism for service quality and safety standards.", image: IMG.shimla, icon: "RiTrophyLine" },
      { title: "Curated Itineraries", desc: "Hand-built journeys that balance adventure, culture and downtime.", image: IMG.kinnaur, icon: "RiCompass3Line" },
      { title: "Comfortable Vehicles", desc: "Modern fleet maintained for long mountain drives with experienced chauffeurs.", image: IMG.innova, icon: "RiCarLine" },
      { title: "Flexible Booking", desc: "Easy rescheduling and transparent pricing — pay only for what you use.", image: IMG.manali, icon: "RiCheckboxCircleLine" },
    ]),
    booking_popup_enabled: "true",
    booking_popup_title: "Plan your Himalayan getaway in 24 hours.",
    booking_popup_subtitle:
      "Tell us where you want to go and our local experts will craft a no-obligation quote for you.",
    booking_popup_cta_text: "Get a free quote",
    booking_popup_cta_link: "/contact",
    booking_popup_image: IMG.spiti,
    booking_popup_pages: "all",
    booking_popup_delay_seconds: "8",
    booking_popup_show_once: "true",
    booking_popup_exit_intent: "false",
    booking_popup_badge: "Limited slots",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {}, // do not overwrite admin's custom values on re-seed
      create: { key, value },
    });
  }
  console.log("✅ Site settings");

  console.log("🎉 Seeding complete!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
