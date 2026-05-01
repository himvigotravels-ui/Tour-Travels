import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // SEO best practice: pick one canonical host (www vs apex) and stick to
  // it everywhere — sitemap, canonicals, OG, schema. We use the www
  // subdomain. Override via NEXT_PUBLIC_SITE_URL if needed.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.himvigo.com'

  try {
    // Fetch active packages
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    // Fetch published blogs
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })

    // Fetch active destinations
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

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

    const staticRoutes = [
      '',
      '/about',
      '/packages',
      '/destinations',
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

    return [...staticRoutes, ...packagesUrls, ...destinationUrls, ...blogsUrls]
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
