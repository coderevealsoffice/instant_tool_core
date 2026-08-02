"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { addCredits } from "@/lib/credits"
import { Role, TransactionType } from "@prisma/client"

/**
 * Ensures the caller is a SUPER_ADMIN.
 */
async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.")
  }
}

/**
 * Grants credits to a specific user.
 */
export async function grantCreditsToUser(userId: string, amount: number, reason: string = "Admin Grant") {
  await requireSuperAdmin()
  
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0.")
  }

  await addCredits(userId, amount, TransactionType.ADMIN_ADJUSTMENT, reason)
  revalidatePath("/super-admin/users")
  return { success: true }
}

/**
 * Changes a user's role.
 */
export async function updateUserRole(userId: string, newRole: Role) {
  await requireSuperAdmin()
  
  // Prevent removing the last super admin if needed, or prevent self-demotion
  const session = await auth()
  if (session?.user?.id === userId && newRole !== "SUPER_ADMIN") {
    throw new Error("You cannot demote yourself.")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })
  
  revalidatePath("/super-admin/users")
  return { success: true }
}

/**
 * Delete a user.
 */
export async function deleteUser(userId: string) {
  await requireSuperAdmin()
  
  const session = await auth()
  if (session?.user?.id === userId) {
    throw new Error("You cannot delete yourself.")
  }

  await prisma.user.delete({
    where: { id: userId }
  })
  
  revalidatePath("/super-admin/users")
  return { success: true }
}

/**
 * Creates or updates a Legal Page.
 */
export async function saveLegalPage(data: { id?: string, title: string, slug: string, content: string }) {
  await requireSuperAdmin()

  if (data.id) {
    await prisma.legalPage.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content
      }
    })
  } else {
    await prisma.legalPage.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content
      }
    })
  }

  revalidatePath("/super-admin/legal-pages")
  return { success: true }
}

/**
 * Deletes a Legal Page.
 */
export async function deleteLegalPage(id: string) {
  await requireSuperAdmin()
  
  await prisma.legalPage.delete({
    where: { id }
  })
  
  revalidatePath("/super-admin/legal-pages")
  return { success: true }
}

/**
 * Updates Support Ticket Status
 */
export async function updateTicketStatus(ticketId: string, status: any) {
  await requireSuperAdmin()
  
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status }
  })
  
  revalidatePath("/super-admin/support")
  return { success: true }
}

/**
 * Creates or updates a Subscription Plan
 */
export async function savePlan(data: {
  id?: string,
  name: string,
  description?: string,
  priceMonthly: number,
  priceYearly: number,
  credits: number,
  maxFileSizeMB: number,
  features: string[],
  isActive: boolean
}) {
  await requireSuperAdmin()

  if (data.id) {
    await prisma.plan.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        credits: data.credits,
        maxFileSizeMB: data.maxFileSizeMB,
        features: data.features,
        isActive: data.isActive
      }
    })
  } else {
    await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        credits: data.credits,
        maxFileSizeMB: data.maxFileSizeMB,
        features: data.features,
        isActive: data.isActive
      }
    })
  }

  revalidatePath("/admin/plans")
  revalidatePath("/") // Revalidate homepage for pricing section
  return { success: true }
}
