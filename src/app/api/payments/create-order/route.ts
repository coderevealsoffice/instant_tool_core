import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { razorpayClient } from "@/lib/razorpay"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, planId, creditPack } = await req.json()
    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    // Create Razorpay order
    const order = await razorpayClient.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        planId,
        creditPack
      }
    })

    // Store pending payment in database
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: order.id,
        amount: amount,
        currency: "INR",
        status: "PENDING",
        description: planId ? `Subscription Plan ${planId}` : `Credit Pack ${creditPack}`
      }
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (error) {
    console.error("Order creation failed", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
