export const dynamic = 'force-dynamic'
import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma/client'
import { toolsRegistry } from '@/lib/tools-registry'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devigo.cloud'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Core Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faqs`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/tutorials`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/creators`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/education`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/business`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // 2. Category Hub Pages
  const categoryHubRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/seo-tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/pdf-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/image-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/video-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/audio-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ai-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/qr-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/converters`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/color-tools/color-palette`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // 3. Legal & Compliance Pages (Essential for AdSense Approval)
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/legal/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/legal/terms-of-service`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/legal/cookie-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/legal/refund-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/legal/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // 4. Dynamic Tools from Registry
  const toolRoutes: MetadataRoute.Sitemap = []
  Object.keys(toolsRegistry).forEach(category => {
    Object.keys(toolsRegistry[category]).forEach(slug => {
      toolRoutes.push({
        url: `${baseUrl}/${category}/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  // 5. Dynamic Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      take: 200,
    })

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.75,
    }))
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error)
  }

  return [...coreRoutes, ...categoryHubRoutes, ...legalRoutes, ...toolRoutes, ...blogRoutes]
}
