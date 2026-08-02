import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ isPro: false })
    }

    // Check if the user has any active subscription with a plan price > 0
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        plan: {
          priceMonthly: { gt: 0 }
        }
      }
    })

    return NextResponse.json({ isPro: !!activeSubscription })
  } catch (error) {
    console.error("[is-pro] error:", error)
    return NextResponse.json({ isPro: false })
  }
}
