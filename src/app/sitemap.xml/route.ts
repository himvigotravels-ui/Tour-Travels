import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = "https://himvigo.com";

  try {
    // Fetch data
    const [packages, blogs, destinations] = await Promise.all([
      prisma.package.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.blog.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.destination.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const staticRoutes = [
      '', '/about', '/packages', '/destinations', '/cab', '/blog', '/contact', '/privacy', '/terms', '/cancellation'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    staticRoutes.forEach(route => {
      xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add dynamic routes
    packages.forEach(pkg => {
      xml += `
  <url>
    <loc>${baseUrl}/packages/${pkg.slug}</loc>
    <lastmod>${pkg.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    destinations.forEach(dest => {
      xml += `
  <url>
    <loc>${baseUrl}/destinations/${dest.slug}</loc>
    <lastmod>${dest.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    blogs.forEach(blog => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blog.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += "\n</urlset>";

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
