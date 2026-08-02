"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function searchUsersAction(query: string) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized")
  }

  if (!query || query.length < 2) return []

  return await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ]
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      image: true
    }
  })
}

export async function addCreditsAction(userId: string, amount: number) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized")
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        credits: { increment: amount }
      }
    })

    await tx.creditTransaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: "ADMIN_ADJUSTMENT",
        description: `Credits manually adjusted by Admin (${session.user?.email})`
      }
    })

    return user
  })

  revalidatePath("/admin/credits")
  return result
}
