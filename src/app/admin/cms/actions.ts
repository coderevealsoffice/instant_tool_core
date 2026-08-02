"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { uploadToCloudinary } from "@/lib/cloudinary"

// Helpers to check admin role
const requireAdmin = async () => {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function createPostAction(data: {
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  image?: string
  categoryId?: string
  isPublished?: boolean
  metaTitle?: string
  metaDesc?: string
}) {
  await requireAdmin()
  
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      image: data.image,
      categoryId: data.categoryId || null,
      isPublished: data.isPublished || false,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
    }
  })

  revalidatePath("/admin/cms")
  return post
}

export async function updatePostAction(id: string, data: {
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  image?: string
  categoryId?: string
  isPublished?: boolean
  metaTitle?: string
  metaDesc?: string
}) {
  await requireAdmin()
  
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      image: data.image,
      categoryId: data.categoryId || null,
      isPublished: data.isPublished || false,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
    }
  })

  revalidatePath("/admin/cms")
  revalidatePath(`/admin/cms/${id}`)
  return post
}

export async function deletePostAction(id: string) {
  await requireAdmin()
  
  await prisma.blogPost.delete({
    where: { id }
  })

  revalidatePath("/admin/cms")
  return { success: true }
}

export async function uploadBlogImageAction(base64Image: string) {
  await requireAdmin()
  
  try {
    const result = await uploadToCloudinary(base64Image, "instant-tool/blog-images", "image")
    return { url: result.secure_url }
  } catch (error) {
    console.error("Image upload error:", error)
    throw new Error("Failed to upload image")
  }
}
