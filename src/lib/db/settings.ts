import { apiFetch } from "../api";

export async function getSettings() {
  try {
    return await apiFetch<Record<string, string>>("/api/settings");
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export async function getSetting(key: string, defaultValue = "") {
  try {
    const data = await apiFetch<{ value: string }>(`/api/settings/${key}`);
    return data.value || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
