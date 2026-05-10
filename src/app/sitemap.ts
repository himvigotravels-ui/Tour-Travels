import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // SEO best practice: pick one canonical host (www vs apex) and stick to
  // it everywhere — sitemap, canonicals, OG, schema. We use the www
  // subdomain. Override via NEXT_PUBLIC_SITE_URL if needed.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.himvigo.com'

  try {
    const [packages, blogs, destinations, internalPages, treks] = await Promise.all([
      prisma.package.findMany({
        where: { isActive: true, isTrek: false },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.destination.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.internalPage.findMany({
        where: { isActive: true },
        select: { slug: true, type: true, updatedAt: true },
      }),
      prisma.package.findMany({
        where: { isActive: true, isTrek: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    const packagesUrls = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const blogsUrls = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const destinationUrls = destinations.map((dest) => ({
      url: `${baseUrl}/destinations/${dest.slug}`,
      lastModified: dest.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const treksUrls = treks.map((trek) => ({
      url: `${baseUrl}/treks/${trek.slug}`,
      lastModified: trek.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const navGroupUrls = internalPages
      .filter((p) => ["package", "destination", "trek"].includes(p.type))
      .map((p) => {
        const base =
          p.type === "package"
            ? "packages"
            : p.type === "trek"
            ? "treks"
            : "destinations";
        return {
          url: `${baseUrl}/${base}/${p.slug}`,
          lastModified: p.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      })

    const staticRoutes = [
      '',
      '/about',
      '/packages',
      '/destinations',
      '/treks',
      '/cab',
      '/blog',
      '/contact',
      '/privacy',
      '/terms',
      '/cancellation'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))

    return [
      ...staticRoutes,
      ...packagesUrls,
      ...destinationUrls,
      ...treksUrls,
      ...navGroupUrls,
      ...blogsUrls,
    ]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ]
  }
}
