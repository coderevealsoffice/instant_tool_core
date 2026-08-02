"use server"

import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getFaqs() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }
  
  return prisma.fAQ.findMany({
    orderBy: { order: "asc" }
  })
}

export async function createFaq(data: { question: string; answer: string; category?: string; isActive: boolean; order: number }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.fAQ.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || null,
      isActive: data.isActive,
      order: data.order,
    }
  })

  revalidatePath("/admin/faqs")
}

export async function updateFaq(id: string, data: { question: string; answer: string; category?: string; isActive: boolean; order: number }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.fAQ.update({
    where: { id },
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category || null,
      isActive: data.isActive,
      order: data.order,
    }
  })

  revalidatePath("/admin/faqs")
}

export async function deleteFaq(id: string) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.fAQ.delete({
    where: { id }
  })

  revalidatePath("/admin/faqs")
}
