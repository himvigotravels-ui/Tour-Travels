import { MetadataRoute } from 'next'
import { apiFetch } from '@/lib/api'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  try {
    // Fetch all active packages and filter into standard packages and treks
    const allActivePackages = await apiFetch<any[]>("/api/packages?active=true")
    const packages = allActivePackages.filter((p: any) => !p.isTrek)
    const treks = allActivePackages.filter((p: any) => p.isTrek)

    // Fetch published blogs
    const blogs = await apiFetch<any[]>("/api/blogs?published=true")

    // Fetch active destinations
    const destinations = await apiFetch<any[]>("/api/destinations?active=true")

    // Fetch active internal pages
    const allInternalPages = await apiFetch<any[]>("/api/internal-pages")
    const internalPages = allInternalPages.filter((p: any) => p.isActive)

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

    // Real entity pages win over same-slug nav-group landings, so dedupe
    // by URL keeping the first occurrence.
    const all = [
      ...staticRoutes,
      ...packagesUrls,
      ...destinationUrls,
      ...treksUrls,
      ...navGroupUrls,
      ...blogsUrls,
    ]
    const seen = new Set<string>()
    return all.filter((entry) => {
      if (seen.has(entry.url)) return false
      seen.add(entry.url)
      return true
    })
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
