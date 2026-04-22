import { prisma } from "@/lib/prisma";

export async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const obj: Record<string, string> = {};
    settings.forEach((s) => (obj[s.key] = s.value));
    return obj;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export async function getSetting(key: string, defaultValue = "") {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });
    return setting?.value || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
