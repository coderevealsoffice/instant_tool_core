"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function updateSubscriptionAction(planId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const userId = session.user.id as string

  // Fetch the plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })

  if (!plan) throw new Error("Plan not found")

  // Check if user has an existing active subscription
  const existingSub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" }
  })

  const oneMonthFromNow = new Date()
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  if (existingSub) {
    // Update existing
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        planId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: oneMonthFromNow
      }
    })
  } else {
    // Create new
    await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: oneMonthFromNow
      }
    })
  }

  revalidatePath("/dashboard/buy-credits")
  return { success: true, planName: plan.name }
}
