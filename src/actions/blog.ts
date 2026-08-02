"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }
}

export async function saveBlogPost(data: {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId?: string
  image?: string
  metaTitle?: string
  metaDesc?: string
  isPublished: boolean
}) {
  await requireSuperAdmin()

  if (data.id) {
    await prisma.blogPost.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId || null,
        image: data.image || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        isPublished: data.isPublished,
      },
    })
  } else {
    const session = await auth()
    await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId || null,
        image: data.image || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        isPublished: data.isPublished,
        author: session?.user?.name || "InstantTool Team",
      },
    })
  }

  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  await requireSuperAdmin()
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function saveBlogCategory(data: { id?: string; name: string; slug: string }) {
  await requireSuperAdmin()

  if (data.id) {
    await prisma.blogCategory.update({
      where: { id: data.id },
      data: { name: data.name, slug: data.slug },
    })
  } else {
    await prisma.blogCategory.create({
      data: { name: data.name, slug: data.slug },
    })
  }

  revalidatePath("/admin/blog")
  return { success: true }
}
