import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits"
import prisma from "@/lib/prisma/client"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;

    // 15 days free for all - bypass credit deduction
    return NextResponse.json({ success: true, creditsDeducted: 0 })

    const { toolSlug } = await req.json()

    if (!toolSlug) {
      return NextResponse.json({ error: "Missing toolSlug" }, { status: 400 })
    }

    // Find the tool to get its credit cost
    const tool = await prisma.toolDefinition.findUnique({
      where: { slug: toolSlug }
    })

    if (!tool) {
      // If the tool doesn't exist in DB, default to 1 credit cost for safety
      await deductCredits(userId, 1, undefined, `Usage of ${toolSlug}`)
      return NextResponse.json({ success: true, creditsDeducted: 1 })
    }

    if (!tool!.isActive) {
      return NextResponse.json({ error: "Tool is currently disabled" }, { status: 400 })
    }

    await deductCredits(userId, tool!.creditCost, undefined, `Usage of ${tool!.name}`)

    return NextResponse.json({ success: true, creditsDeducted: tool!.creditCost })
  } catch (error: any) {
    console.error("Credit deduction error:", error)
    if (error.message === "Insufficient credits") {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }
    return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
  }
}
