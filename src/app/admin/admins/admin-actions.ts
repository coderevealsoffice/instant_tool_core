"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"

export async function getAdminsAndUsers() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }
  
  // Get all users who are ADMIN or SUPER_ADMIN, plus maybe regular users so they can be promoted
  // To avoid huge lists, let's just fetch admins, super_admins, and employees for the main list
  // For adding a new admin, they can search by email
  
  return prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN", "EMPLOYEE"] }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function searchUserByEmail(email: string) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }
  
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } }
  })
}

export async function changeUserRole(userId: string, newRole: Role) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  // Prevent demoting the last SUPER_ADMIN (just a basic safety check, 
  // ideally count SUPER_ADMINs in DB)
  if (newRole !== "SUPER_ADMIN") {
    const userToDemote = await prisma.user.findUnique({ where: { id: userId }})
    if (userToDemote?.role === "SUPER_ADMIN") {
      const superAdminsCount = await prisma.user.count({ where: { role: "SUPER_ADMIN" } })
      if (superAdminsCount <= 1) {
        throw new Error("Cannot demote the last Super Admin")
      }
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })

  revalidatePath("/admin/admins")
}
