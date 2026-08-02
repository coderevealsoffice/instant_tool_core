import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Convert price to paise (lowest currency unit for INR)
    // If your DB stores price in INR dollars/rupees, multiply by 100.
    const amountInPaise = Math.round(plan.priceMonthly * 100)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId: session.user.id,
        planId: plan.id,
      }
    })

    return NextResponse.json({ 
      id: order.id, 
      currency: order.currency, 
      amount: order.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })

  } catch (error: any) {
    console.error("Razorpay order creation failed:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
