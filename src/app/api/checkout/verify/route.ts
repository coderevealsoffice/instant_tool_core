import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, amount } = body

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) throw new Error("Plan not found")

    // Update DB in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Payment Record
      const payment = await tx.payment.create({
        data: {
          userId: session.user.id!,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: amount / 100, // back to normal currency
          currency: "INR",
          status: "SUCCESS",
          description: `Subscription to ${plan.name}`
        }
      })

      // 2. Add credits (as a bonus or part of plan)
      // Usually a subscription gives unlimited or a big chunk of credits
      const creditsToAdd = plan.name.toLowerCase().includes('pro') ? 1000 : 500
      
      await tx.user.update({
        where: { id: session.user.id! },
        data: { credits: { increment: creditsToAdd } }
      })

      await tx.creditTransaction.create({
        data: {
          userId: session.user.id!,
          amount: creditsToAdd,
          type: "PURCHASE",
          description: `Purchased ${plan.name}`
        }
      })

      // 3. Create Subscription Record
      const now = new Date()
      const end = new Date()
      end.setMonth(end.getMonth() + 1)

      // cancel old active subscriptions
      await tx.subscription.updateMany({
        where: { userId: session.user.id!, status: "ACTIVE" },
        data: { status: "CANCELED" }
      })

      await tx.subscription.create({
        data: {
          userId: session.user.id!,
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: end,
          razorpaySubscriptionId: `sub_placeholder_${Date.now()}` // actual subs require razorpay subscriptions API
        }
      })
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Razorpay verification failed:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
