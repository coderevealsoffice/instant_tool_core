"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getCoupons() {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }
  
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  })
}

export async function createCoupon(data: {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  maxUses?: number;
  expiresAt?: Date | null;
  isActive: boolean;
}) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }

  // Ensure code is unique
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } })
  if (existing) {
    throw new Error("Coupon code already exists")
  }

  await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      discountPercent: data.discountPercent || null,
      discountAmount: data.discountAmount || null,
      maxUses: data.maxUses || null,
      expiresAt: data.expiresAt || null,
      isActive: data.isActive,
    }
  })

  revalidatePath("/admin/coupons")
}

export async function updateCoupon(id: string, data: {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  maxUses?: number;
  expiresAt?: Date | null;
  isActive: boolean;
}) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }

  // Check code uniqueness if changing code
  const existing = await prisma.coupon.findUnique({ where: { code: data.code } })
  if (existing && existing.id !== id) {
    throw new Error("Coupon code already exists")
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code.toUpperCase(),
      discountPercent: data.discountPercent || null,
      discountAmount: data.discountAmount || null,
      maxUses: data.maxUses || null,
      expiresAt: data.expiresAt || null,
      isActive: data.isActive,
    }
  })

  revalidatePath("/admin/coupons")
}

export async function deleteCoupon(id: string) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized")
  }

  await prisma.coupon.delete({
    where: { id }
  })

  revalidatePath("/admin/coupons")
}
