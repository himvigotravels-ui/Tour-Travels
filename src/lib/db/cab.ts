import { apiFetch } from "../api";

export async function getCabVehicles() {
  try {
    return await apiFetch<any[]>("/api/cab/vehicles");
  } catch (error) {
    console.error("Error fetching cab vehicles:", error);
    return [];
  }
}

export async function getCabRoutes() {
  try {
    return await apiFetch<any[]>("/api/cab/routes");
  } catch (error) {
    console.error("Error fetching cab routes:", error);
    return [];
  }
}
