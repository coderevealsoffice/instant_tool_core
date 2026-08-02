import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { addCredits } from "@/lib/credits"
import { TransactionType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret"

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)

    if (!isValid) {
      await prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED" }
      })
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "SUCCESS"
      }
    })

    // Create Invoice
    await prisma.invoice.create({
      data: {
        userId: payment.userId,
        paymentId: payment.id,
        amount: payment.amount,
      }
    })

    // If it was a credit pack purchase, add credits
    if (payment.description?.startsWith("Credit Pack")) {
      const packId = payment.description.replace("Credit Pack ", "")
      
      // Determine credits to add based on pack ID
      let creditsToAdd = 0
      if (packId === "pack_starter") creditsToAdd = 100
      else if (packId === "pack_pro") creditsToAdd = 500
      else if (packId === "pack_ultra") creditsToAdd = 2000
      else {
        // Fallback naive logic if pack is unknown
        creditsToAdd = (payment.amount / 10) * 100
      }

      await addCredits(payment.userId, creditsToAdd, TransactionType.PURCHASE, `Purchased ${creditsToAdd} credits`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment verification failed", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
