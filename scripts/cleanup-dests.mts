import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Non-Himachal destinations that don't belong on a Himvigo Himachal site.
const TO_DELETE = ["amritsar", "pathankot", "leh-ladakh"];

const before = await prisma.destination.count();
const result = await prisma.destination.deleteMany({
  where: { slug: { in: TO_DELETE } },
});
const after = await prisma.destination.count();

console.log(`Deleted ${result.count} destinations: ${TO_DELETE.join(", ")}`);
console.log(`Total destinations: ${before} → ${after}`);

const remaining = await prisma.destination.findMany({
  orderBy: { sortOrder: "asc" },
  select: { slug: true, name: true, isActive: true },
});
console.log("\nRemaining:");
for (const d of remaining) {
  console.log(`  ${d.isActive ? "✅" : "💤"}  ${d.slug.padEnd(28)} ${d.name}`);
}

await prisma.$disconnect();
