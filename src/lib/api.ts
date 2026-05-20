// Fall back to the production Render backend so the live site still
// works even if NEXT_PUBLIC_BACKEND_URL isn't set on Vercel. Override
// locally by setting NEXT_PUBLIC_BACKEND_URL=http://localhost:3001.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tour-travels-backend-l6e4.onrender.com";
const API_KEY =
  process.env.BACKEND_API_KEY || "himvigo-super-secret-key-2026";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  
  // Create headers. We add the secure API key if it runs on server-side.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      // Ensure Next.js caches these API calls if desired (revalidate settings can be added)
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API fetch error (${res.status}): ${text || res.statusText}`);
    }

    return await res.json() as T;
  } catch (error) {
    console.error(`❌ apiFetch failed for ${path}:`, error);
    throw error;
  }
}
