import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is an admin/super_admin. If not, only return published posts.
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
    
    const posts = await prisma.blogPost.findMany({
      where: isAdmin ? {} : { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    })
    
    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { title, slug, content, excerpt, author, isPublished, image, metaTitle, metaDesc, categoryId } = data
    
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        author: author || session.user.name || "Admin",
        isPublished: isPublished || false,
        image,
        metaTitle,
        metaDesc,
        categoryId
      }
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
