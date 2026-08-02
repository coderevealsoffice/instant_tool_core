import { NextResponse } from "next/server"
import crypto from "crypto"
import prisma from "@/lib/prisma/client"
import { addCredits } from "@/lib/credits"
import { TransactionType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity)
        break
      default:
        // Ignore other events
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentCaptured(paymentEntity: any) {
  const razorpayOrderId = paymentEntity.order_id
  const razorpayPaymentId = paymentEntity.id

  // Find the pending payment
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
  })

  if (!payment) {
    console.error(`Payment not found for order ${razorpayOrderId}`)
    return
  }

  // If already SUCCESS (from synchronous verify route), skip credit addition
  if (payment.status === "SUCCESS") {
    return
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      razorpayPaymentId,
    },
  })

  // Create Invoice if it doesn't exist
  const existingInvoice = await prisma.invoice.findUnique({
    where: { paymentId: payment.id }
  })

  if (!existingInvoice) {
    await prisma.invoice.create({
      data: {
        userId: updatedPayment.userId,
        paymentId: updatedPayment.id,
        amount: updatedPayment.amount,
      },
    })
  }

  // Add credits
  if (updatedPayment.description?.startsWith("Credit Pack")) {
    const packId = updatedPayment.description.replace("Credit Pack ", "")
    
    let creditsToAdd = 0
    if (packId === "pack_starter") creditsToAdd = 100
    else if (packId === "pack_pro") creditsToAdd = 500
    else if (packId === "pack_ultra") creditsToAdd = 2000
    else creditsToAdd = (updatedPayment.amount / 10) * 100

    await addCredits(updatedPayment.userId, creditsToAdd, TransactionType.PURCHASE, `Purchased ${creditsToAdd} credits (Webhook)`)
  }
}

async function handlePaymentFailed(paymentEntity: any) {
  const razorpayOrderId = paymentEntity.order_id

  await prisma.payment.updateMany({
    where: { razorpayOrderId },
    data: { status: "FAILED" },
  })
}
