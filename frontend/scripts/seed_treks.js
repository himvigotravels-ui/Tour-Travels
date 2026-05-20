/* eslint-disable */
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMG = {
  triund:
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  kheerganga:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  hampta:
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
  bhrigu:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
  pinparvati:
    "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=1200&q=80",
  buran:
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
  churdhar:
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
  beaskund:
    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80",
  indrahar:
    "https://images.unsplash.com/photo-1561361398-a8d3aaae9e6e?auto=format&fit=crop&w=1200&q=80",
  chandratal:
    "https://images.unsplash.com/photo-1473444330585-93a48b18ba79?auto=format&fit=crop&w=1200&q=80",
  camp:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  trek:
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
};

const treks = [
  {
    slug: "triund-trek",
    title: "Triund Trek — Sunrise over the Dhauladhars",
    location: "Dharamshala",
    pricePerPerson: 3499,
    durationDays: 2,
    durationNights: 1,
    imageUrls: [IMG.triund, IMG.indrahar, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 12,
    description:
      "A short, beginner-friendly Himachali trek from McLeod Ganj that ends with a meadow-top sunrise over the entire Dhauladhar range.",
    itinerary: [
      {
        day: 1,
        title: "McLeod Ganj → Triund Top",
        activities:
          "9km uphill via Galu Devi temple. Reach Triund by afternoon, set up camp, sunset views.",
      },
      {
        day: 2,
        title: "Sunrise & Descent",
        activities: "Sunrise over Dhauladhars, breakfast at camp, descend to McLeod Ganj.",
      },
    ],
    inclusions: [
      "Camping at Triund (twin sharing)",
      "Trek guide",
      "Dinner & breakfast at camp",
      "Forest entry permits",
    ],
    exclusions: ["Travel to McLeod Ganj", "Personal trek gear", "Lunches"],
    categories: ["adventure"],
    isFeatured: true,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "kheerganga-trek",
    title: "Kheerganga Trek — Hot Springs in Parvati Valley",
    location: "Kasol",
    pricePerPerson: 4499,
    durationDays: 3,
    durationNights: 2,
    imageUrls: [IMG.kheerganga, IMG.camp, IMG.trek],
    vehicleType: "Tempo Traveller",
    maxOccupancy: 14,
    description:
      "A 12km trek through pine forests to the legendary Kheerganga hot springs — one of Himachal's most loved short treks.",
    itinerary: [
      {
        day: 1,
        title: "Kasol → Barshaini → Kheerganga",
        activities: "Drive to Barshaini, start trek, reach camp by evening, hot spring dip.",
      },
      {
        day: 2,
        title: "Kheerganga & Tosh",
        activities: "Sunrise meditation, descend to Barshaini, drive to Tosh village.",
      },
      { day: 3, title: "Departure", activities: "Breakfast at Tosh, drive back to Kasol." },
    ],
    inclusions: [
      "Camp at Kheerganga (twin sharing)",
      "Stay at Tosh village",
      "Trek leader & support staff",
      "Meals during trek",
    ],
    exclusions: ["Travel to Kasol", "Personal expenses", "Mule charges"],
    categories: ["adventure"],
    isFeatured: true,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "hampta-pass-trek",
    title: "Hampta Pass Trek — Lush Valleys to Cold Desert",
    location: "Manali",
    pricePerPerson: 12999,
    durationDays: 5,
    durationNights: 4,
    imageUrls: [IMG.hampta, IMG.chandratal, IMG.camp],
    vehicleType: "Tempo Traveller",
    maxOccupancy: 12,
    description:
      "A dramatic crossover trek that takes you from the green Kullu Valley to the moonscape of Lahaul-Spiti in just 4 days.",
    itinerary: [
      { day: 1, title: "Manali → Jobra → Chika", activities: "Short drive, gentle 2km trek to Chika camp." },
      { day: 2, title: "Chika → Balu Ka Ghera", activities: "7km along the Rani Nallah, river crossings." },
      { day: 3, title: "Balu Ka Ghera → Hampta Pass → Siagoru", activities: "Summit day. Pass at 14,100 ft." },
      { day: 4, title: "Siagoru → Chatru → Chandratal", activities: "Descend, drive to Chandratal Lake camp." },
      { day: 5, title: "Chandratal → Manali", activities: "Cross Atal Tunnel, end in Manali." },
    ],
    inclusions: [
      "All camping & meals on trek",
      "Trek leader, cook, support staff",
      "Tempo from Manali",
      "Forest & camping permits",
    ],
    exclusions: ["Travel to Manali", "Backpack offload (extra)", "Insurance"],
    categories: ["adventure", "offbeat"],
    isFeatured: true,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "bhrigu-lake-trek",
    title: "Bhrigu Lake Trek — Alpine Meadows above Manali",
    location: "Manali",
    pricePerPerson: 8499,
    durationDays: 4,
    durationNights: 3,
    imageUrls: [IMG.bhrigu, IMG.beaskund, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 8,
    description:
      "Walk through endless meadows to a sacred high-altitude lake. The fastest route to a 14,000 ft summit from Manali.",
    itinerary: [
      { day: 1, title: "Manali → Gulaba → Jonker Thatch", activities: "Drive to Gulaba, trek 4km to camp." },
      { day: 2, title: "Jonker Thatch → Roli Kholi", activities: "Acclimatisation walk, ridge views." },
      { day: 3, title: "Summit Bhrigu Lake & return", activities: "Lake at 14,100 ft, descend to Jonker." },
      { day: 4, title: "Descent to Manali", activities: "Trek down, drive back." },
    ],
    inclusions: [
      "Camping & meals",
      "Trek leader & support",
      "Manali transfers",
      "Permits",
    ],
    exclusions: ["Travel to Manali", "Personal gear"],
    categories: ["adventure"],
    isFeatured: false,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "pin-parvati-pass-trek",
    title: "Pin Parvati Pass Trek — The Crossover Classic",
    location: "Spiti Valley",
    pricePerPerson: 28999,
    durationDays: 11,
    durationNights: 10,
    imageUrls: [IMG.pinparvati, IMG.hampta, IMG.camp],
    vehicleType: "Tempo Traveller",
    maxOccupancy: 10,
    description:
      "An expedition-grade Himalayan crossover from green Parvati Valley to the cold desert of Pin Valley over a 17,400 ft pass.",
    itinerary: [
      { day: 1, title: "Manikaran → Barshaini → Kheerganga", activities: "Trek up to Kheerganga." },
      { day: 2, title: "Kheerganga → Tunda Bhuj", activities: "8km along the Parvati river." },
      { day: 3, title: "Tunda Bhuj → Thakur Kuan", activities: "River crossing on a pulley." },
      { day: 4, title: "Thakur Kuan → Odi Thatch", activities: "Cross 12,000 ft mark." },
      { day: 5, title: "Odi Thatch → Mantalai Lake", activities: "Source of the Parvati." },
      { day: 6, title: "Acclimatisation at Mantalai", activities: "Rest, short walks." },
      { day: 7, title: "Mantalai → Base Camp", activities: "Move to Pin Parvati base." },
      { day: 8, title: "Summit Pin Parvati Pass → Pin side", activities: "Long summit day, glacier walk." },
      { day: 9, title: "Pin valley descent", activities: "Drop into Mud village." },
      { day: 10, title: "Mud → Kaza", activities: "Drive into Kaza, hot showers." },
      { day: 11, title: "Kaza → Manali", activities: "Long drive across Kunzum & Atal Tunnel." },
    ],
    inclusions: [
      "Full expedition support (cook, porters, leader)",
      "All meals & camps",
      "Manali → Manikaran → Kaza → Manali transfers",
      "All permits",
    ],
    exclusions: ["Travel to Manali", "Insurance", "Evac costs"],
    categories: ["adventure", "offbeat"],
    isFeatured: true,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "buran-ghati-trek",
    title: "Buran Ghati Trek — The Hidden Pass of Shimla",
    location: "Shimla",
    pricePerPerson: 11499,
    durationDays: 7,
    durationNights: 6,
    imageUrls: [IMG.buran, IMG.churdhar, IMG.camp],
    vehicleType: "Tempo Traveller",
    maxOccupancy: 12,
    description:
      "A wild trek through the Pabbar Valley with apple orchards, thick forests and a heart-thumping rappel down Buran Pass.",
    itinerary: [
      { day: 1, title: "Shimla → Janglik", activities: "Long drive into the Pabbar Valley." },
      { day: 2, title: "Janglik → Dayara Thatch", activities: "Climb through deodar forest." },
      { day: 3, title: "Dayara → Litham", activities: "Ridge walk to alpine meadow." },
      { day: 4, title: "Litham → Dhunda", activities: "Move to summit base." },
      { day: 5, title: "Summit & rappel down", activities: "Cross Buran Ghati at 15,000 ft." },
      { day: 6, title: "Barua → Sangla", activities: "Reach Sangla Valley by evening." },
      { day: 7, title: "Sangla → Shimla", activities: "Long drive back." },
    ],
    inclusions: [
      "All camping & meals",
      "Trek leader, technical staff",
      "Rappelling gear",
      "Permits",
    ],
    exclusions: ["Travel to Shimla", "Personal gear"],
    categories: ["adventure", "offbeat"],
    isFeatured: false,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "churdhar-trek",
    title: "Churdhar Peak Trek — The Highest Peak of Outer Himalayas",
    location: "Shimla",
    pricePerPerson: 5999,
    durationDays: 3,
    durationNights: 2,
    imageUrls: [IMG.churdhar, IMG.trek, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 8,
    description:
      "A weekend-friendly summit trek to Churdhar Peak (11,965 ft) from Nohradhar — closest high-altitude trek to Shimla and Chandigarh.",
    itinerary: [
      { day: 1, title: "Shimla → Nohradhar", activities: "Drive to base village, evening briefing." },
      { day: 2, title: "Nohradhar → Teesari → Summit", activities: "Long summit day, descend to Teesari." },
      { day: 3, title: "Teesari → Nohradhar → Shimla", activities: "Trek down, drive back." },
    ],
    inclusions: ["Camping & meals", "Trek leader", "Shimla transfers", "Permits"],
    exclusions: ["Travel to Shimla", "Personal gear"],
    categories: ["adventure"],
    isFeatured: false,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "beas-kund-trek",
    title: "Beas Kund Trek — Source of the Beas River",
    location: "Manali",
    pricePerPerson: 6499,
    durationDays: 3,
    durationNights: 2,
    imageUrls: [IMG.beaskund, IMG.bhrigu, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 10,
    description:
      "A glacial-lake trek from Solang Valley with up-close views of Hanuman Tibba, Friendship Peak and Shitidhar.",
    itinerary: [
      { day: 1, title: "Manali → Dhundi → Bakarthach", activities: "Drive to Dhundi, trek 6km to camp." },
      { day: 2, title: "Bakarthach → Beas Kund & back", activities: "Day trip to glacial lake, return to camp." },
      { day: 3, title: "Bakarthach → Manali", activities: "Trek down, drive back." },
    ],
    inclusions: ["Camping & meals", "Trek leader", "Manali transfers", "Permits"],
    exclusions: ["Travel to Manali", "Personal gear"],
    categories: ["adventure"],
    isFeatured: false,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "indrahar-pass-trek",
    title: "Indrahar Pass Trek — Beyond Triund",
    location: "Dharamshala",
    pricePerPerson: 7999,
    durationDays: 4,
    durationNights: 3,
    imageUrls: [IMG.indrahar, IMG.triund, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 10,
    description:
      "Continue past Triund to the technical Indrahar Pass at 14,245 ft — the natural border crossing into Chamba Valley.",
    itinerary: [
      { day: 1, title: "McLeod Ganj → Triund", activities: "9km to Triund camp." },
      { day: 2, title: "Triund → Lahesh Cave", activities: "Acclimatise & summit base." },
      { day: 3, title: "Summit Indrahar Pass & return", activities: "Long summit day." },
      { day: 4, title: "Descent to McLeod Ganj", activities: "Trek down." },
    ],
    inclusions: ["Camping & meals", "Trek leader, technical staff", "Permits"],
    exclusions: ["Travel to McLeod Ganj", "Personal gear"],
    categories: ["adventure", "offbeat"],
    isFeatured: false,
    isActive: true,
    isTrek: true,
  },
  {
    slug: "chandratal-lake-trek",
    title: "Chandratal Lake Trek — Moon Lake of Spiti",
    location: "Spiti Valley",
    pricePerPerson: 9999,
    durationDays: 4,
    durationNights: 3,
    imageUrls: [IMG.chandratal, IMG.pinparvati, IMG.camp],
    vehicleType: "SUV",
    maxOccupancy: 8,
    description:
      "A short high-altitude trek + drive that ends at Chandratal — the crescent-shaped lake that appears nowhere on maps.",
    itinerary: [
      { day: 1, title: "Manali → Chatru", activities: "Cross Atal Tunnel, camp at Chatru." },
      { day: 2, title: "Chatru → Chandratal", activities: "Drive + 1.5km walk to lake." },
      { day: 3, title: "Chandratal stay & shoot", activities: "Sunrise & milky-way photography." },
      { day: 4, title: "Chandratal → Manali", activities: "Long drive back." },
    ],
    inclusions: ["Camping & meals", "Trek + driver", "Permits"],
    exclusions: ["Travel to Manali", "Personal gear"],
    categories: ["adventure", "offbeat"],
    isFeatured: true,
    isActive: true,
    isTrek: true,
  },
];

const trekNavGroups = [
  {
    title: "Treks in Shimla",
    slug: "treks-in-shimla",
    type: "trek",
    sortOrder: 1,
    tagline: "High-altitude trails out of the Queen of Hills",
    destinationSlugs: ["shimla"],
  },
  {
    title: "Treks in Manali",
    slug: "treks-in-manali",
    type: "trek",
    sortOrder: 2,
    tagline: "Cross passes, glacial lakes & alpine meadows",
    destinationSlugs: ["manali"],
  },
  {
    title: "Treks in Spiti Valley",
    slug: "treks-in-spiti-valley",
    type: "trek",
    sortOrder: 3,
    tagline: "Cold-desert expeditions in the Middle Land",
    destinationSlugs: ["spiti-valley"],
  },
  {
    title: "Treks in Dharamshala",
    slug: "treks-in-dharamshala",
    type: "trek",
    sortOrder: 4,
    tagline: "Trails in the Dhauladhar range",
    destinationSlugs: ["dharamshala"],
  },
  {
    title: "Treks in Kasol",
    slug: "treks-in-kasol",
    type: "trek",
    sortOrder: 5,
    tagline: "Parvati Valley classics",
    destinationSlugs: ["kasol"],
  },
];

async function main() {
  console.log("🥾 Seeding treks…");

  // ── Trek packages (upsert by slug) ──
  for (const trek of treks) {
    await prisma.package.upsert({
      where: { slug: trek.slug },
      update: trek,
      create: trek,
    });
  }
  console.log(`✅ ${treks.length} trek packages`);

  // ── Trek nav-groups with destination filters ──
  for (const group of trekNavGroups) {
    const destinations = await prisma.destination.findMany({
      where: { slug: { in: group.destinationSlugs } },
      select: { id: true },
    });

    if (destinations.length === 0) {
      console.warn(
        `⚠️  No destinations matched ${group.destinationSlugs.join(", ")} for "${group.title}" — group will still be created with no filter.`
      );
    }

    const { destinationSlugs, ...rest } = group;

    await prisma.internalPage.upsert({
      where: { slug: group.slug },
      update: {
        ...rest,
        destinations: {
          set: destinations.map((d) => ({ id: d.id })),
        },
        packages: { set: [] },
      },
      create: {
        ...rest,
        isActive: true,
        destinations: {
          connect: destinations.map((d) => ({ id: d.id })),
        },
      },
    });
    console.log(
      `✅ Trek nav-group "${group.title}" (${destinations.length} dest)`
    );
  }

  console.log("🎉 Trek seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
