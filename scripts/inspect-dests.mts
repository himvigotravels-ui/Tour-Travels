import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const dests = await prisma.destination.findMany({
  orderBy: { sortOrder: "asc" },
});

console.log(`Total: ${dests.length}\n`);
for (const d of dests) {
  console.log(`--- ${d.slug} (${d.name}) ---`);
  console.log(`  active: ${d.isActive}  sort: ${d.sortOrder}`);
  console.log(`  image: ${d.image?.slice(0, 90) || "(empty)"}`);
  console.log(`  tagline: ${d.tagline || "(empty)"}`);
  console.log(`  description: ${(d.description || "").slice(0, 120)}${d.description?.length > 120 ? "..." : ""}`);
  console.log(`  bestTime: ${d.bestTime || "(empty)"}  altitude: ${d.altitude || "(empty)"}  vibe: ${d.vibe || "(empty)"}`);
  console.log(`  highlights (${d.highlights?.length || 0}): ${(d.highlights || []).join(" | ").slice(0, 100)}`);
  console.log("");
}
await prisma.$disconnect();
