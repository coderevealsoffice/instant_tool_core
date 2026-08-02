import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { title, slug, content } = data

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingPage = await prisma.legalPage.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const page = await prisma.legalPage.create({
      data: {
        title,
        slug,
        content
      }
    })

    return NextResponse.json({ success: true, page })
  } catch (error: any) {
    console.error("Legal page create error:", error)
    return NextResponse.json({ error: error.message || "Failed to create legal page" }, { status: 500 })
  }
}
