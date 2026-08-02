export const dynamic = 'force-dynamic'
import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma/client'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

import { toolsRegistry } from '@/lib/tools-registry'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const staticRoutes = [
    '',
    '/pricing',
    '/tools',
    '/blog',
    '/about',
    '/contact',
    '/faqs'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Generate routes for all tools dynamically from registry
  const toolRoutes: { url: string, lastModified: Date, changeFrequency: 'weekly', priority: number }[] = []
  
  Object.keys(toolsRegistry).forEach(category => {
    Object.keys(toolsRegistry[category]).forEach(slug => {
      toolRoutes.push({
        url: `${baseUrl}/${category}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    })
  })

  // Dynamic Blog Routes
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true }
  })

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...toolRoutes, ...blogRoutes]
}
