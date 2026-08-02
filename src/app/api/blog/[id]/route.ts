import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true }
    })
    
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
    
    return NextResponse.json({ post })
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { title, slug, content, excerpt, author, isPublished, image, metaTitle, metaDesc, categoryId } = data
    
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check slug uniqueness excluding self
    const existing = await prisma.blogPost.findFirst({ where: { slug, id: { not: id } } })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        author,
        isPublished,
        image,
        metaTitle,
        metaDesc,
        categoryId: categoryId || null
      }
    })

    return NextResponse.json({ post })
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.blogPost.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
