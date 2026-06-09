import { SITE_URL, SITE_NAME } from "@/lib/site";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Serves /llms.txt — an llmstxt.org-style Markdown map of the site for AI
 * crawlers and answer engines. Built from live backend data so it stays
 * current; falls back to a static core listing if the backend is
 * unreachable.
 */
type Item = { slug: string; title?: string; name?: string; excerpt?: string; tagline?: string; isTrek?: boolean };

function line(title: string, path: string, note?: string) {
  return `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;
}

export async function GET() {
  const sections: string[] = [];

  sections.push(`# ${SITE_NAME}`);
  sections.push(
    `> ${SITE_NAME} is a local Himachal Pradesh travel agency offering curated tour packages, Himalayan trekking expeditions, destination guides (Spiti Valley, Manali, Shimla, Kasol, Dharamshala, Kinnaur) and verified mountain cab services. Based in Manali; serving all of Himachal Pradesh, India.`
  );
  sections.push(
    `This file helps AI assistants and answer engines understand and cite our content. All listed pages are public and may be referenced.`
  );

  // Core pages — always present.
  sections.push(
    [
      "## Core Pages",
      line("Home", "/", "Overview of tours, treks, destinations and cab services"),
      line("Tour Packages", "/packages", "Browse all Himachal tour packages"),
      line("Treks", "/treks", "Himalayan trekking expeditions"),
      line("Destinations", "/destinations", "Destination travel guides across Himachal"),
      line("Cab Services", "/cab", "Mountain cab fleet, routes and transfers"),
      line("Travel Blog", "/blog", "Guides and stories from the Himalayas"),
      line("About", "/about", "Who we are and how we operate"),
      line("Contact", "/contact", "Get a free quote within 24 hours"),
    ].join("\n")
  );

  try {
    const [pkgs, dests, blogs] = await Promise.all([
      apiFetch<Item[]>("/api/packages?active=true"),
      apiFetch<Item[]>("/api/destinations?active=true"),
      apiFetch<Item[]>("/api/blogs?published=true"),
    ]);

    const packages = pkgs.filter((p) => !p.isTrek);
    const treks = pkgs.filter((p) => p.isTrek);

    if (packages.length) {
      sections.push(
        ["## Tour Packages", ...packages.map((p) => line(p.title || p.slug, `/packages/${p.slug}`))].join("\n")
      );
    }
    if (treks.length) {
      sections.push(
        ["## Treks", ...treks.map((p) => line(p.title || p.slug, `/treks/${p.slug}`))].join("\n")
      );
    }
    if (dests.length) {
      sections.push(
        [
          "## Destinations",
          ...dests.map((d) => line(d.name || d.slug, `/destinations/${d.slug}`, d.tagline)),
        ].join("\n")
      );
    }
    if (blogs.length) {
      sections.push(
        ["## Blog Articles", ...blogs.map((b) => line(b.title || b.slug, `/blog/${b.slug}`, b.excerpt))].join("\n")
      );
    }
  } catch {
    // Backend unreachable — the core pages above are still served.
  }

  sections.push(
    ["## Contact", `- Sitemap: ${SITE_URL}/sitemap.xml`, `- Website: ${SITE_URL}`].join("\n")
  );

  return new Response(sections.join("\n\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
