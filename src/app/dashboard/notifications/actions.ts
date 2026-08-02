"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function markAsReadAction(notificationId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.notification.update({
    where: { 
      id: notificationId,
      userId: session.user.id 
    },
    data: { isRead: true }
  })

  revalidatePath("/dashboard/notifications")
  return { success: true }
}

export async function markAllAsReadAction() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.notification.updateMany({
    where: { 
      userId: session.user.id,
      isRead: false
    },
    data: { isRead: true }
  })

  revalidatePath("/dashboard/notifications")
  return { success: true }
}
