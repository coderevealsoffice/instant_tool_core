"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getSiteSettings() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }
  
  const settings = await prisma.siteSetting.findMany()
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
  
  return settingsMap
}

export async function saveSiteSettings(data: Record<string, string>) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  // Use a transaction to upsert all settings
  const upserts = Object.entries(data).map(([key, value]) => {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
  })

  await prisma.$transaction(upserts)

  revalidatePath("/admin/settings")
  revalidatePath("/") // revalidate public pages if SEO settings changed
}
