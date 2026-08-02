"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getAdSlots() {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }
  
  return prisma.adSlotSetting.findMany({
    orderBy: { slotName: "asc" }
  })
}

export async function upsertAdSlot(data: {
  slotName: string;
  isActive: boolean;
  client_id?: string;
  slot_id?: string;
  code?: string;
}) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.adSlotSetting.findUnique({ where: { slotName: data.slotName } })
  
  if (existing) {
    await prisma.adSlotSetting.update({
      where: { id: existing.id },
      data: {
        isActive: data.isActive,
        client_id: data.client_id || null,
        slot_id: data.slot_id || null,
        code: data.code || null,
      }
    })
  } else {
    await prisma.adSlotSetting.create({
      data: {
        slotName: data.slotName,
        isActive: data.isActive,
        client_id: data.client_id || null,
        slot_id: data.slot_id || null,
        code: data.code || null,
      }
    })
  }

  revalidatePath("/admin/ads")
}

export async function deleteAdSlot(id: string) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }

  await prisma.adSlotSetting.delete({
    where: { id }
  })

  revalidatePath("/admin/ads")
}
