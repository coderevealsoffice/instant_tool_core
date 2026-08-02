"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateToolMatrix(id: string, data: { creditCost: number; isActive: boolean; isBatch: boolean }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.toolDefinition.update({
    where: { id },
    data: {
      creditCost: data.creditCost,
      isActive: data.isActive,
      isBatch: data.isBatch
    }
  })

  revalidatePath("/admin/tool-matrix")
}
