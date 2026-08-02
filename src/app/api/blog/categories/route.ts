import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" }
    })
    
    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, slug } = await req.json()
    
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const existing = await prisma.blogCategory.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 })
    }

    const category = await prisma.blogCategory.create({
      data: { name, slug }
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog category:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
