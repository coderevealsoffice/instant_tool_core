import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { title, slug, content } = data

    const page = await prisma.legalPage.update({
      where: { id },
      data: { title, slug, content }
    })

    return NextResponse.json({ success: true, page })
  } catch (error: any) {
    console.error("Legal page update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update legal page" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.legalPage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Legal page delete error:", error)
    return NextResponse.json({ error: "Failed to delete legal page" }, { status: 500 })
  }
}
