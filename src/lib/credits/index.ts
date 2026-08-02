import prisma from "@/lib/prisma/client"
import { TransactionType } from "@prisma/client"

/**
 * Checks if a user has enough credits.
 */
export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    })
    if (!user) return false
    return user.credits >= requiredCredits
  } catch {
    return false
  }
}

/**
 * Deducts credits from a user's wallet and records the transaction.
 * Uses sequential queries (no $transaction) for compatibility with the pg adapter.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  jobId?: string,
  description?: string
) {
  if (amount <= 0) throw new Error("Amount to deduct must be greater than 0")

  // 1. Check user exists and has enough credits
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")
  if (user.credits < amount) throw new Error("Insufficient credits")

  // 2. Decrement credits
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } }
  })

  // 3. Log the credit transaction
  const transaction = await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -amount,
      type: TransactionType.JOB_USAGE,
      jobId,
      description: description || "Tool usage deduction",
    }
  })

  return { user: updatedUser, transaction }
}

/**
 * Refunds credits (e.g., if a job fails).
 */
export async function refundCredits(
  userId: string,
  amount: number,
  jobId?: string,
  description?: string
) {
  if (amount <= 0) throw new Error("Amount to refund must be greater than 0")

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } }
  })

  const transaction = await prisma.creditTransaction.create({
    data: {
      userId,
      amount,
      type: TransactionType.REFUND,
      jobId,
      description: description || "Refund for failed job",
    }
  })

  return { user: updatedUser, transaction }
}

/**
 * Adds credits to a user's wallet (e.g., upon purchase or subscription renewal).
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: TransactionType = TransactionType.PURCHASE,
  description?: string
) {
  if (amount <= 0) throw new Error("Amount to add must be greater than 0")

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } }
  })

  const transaction = await prisma.creditTransaction.create({
    data: {
      userId,
      amount,
      type,
      description: description || "Credit addition",
    }
  })

  return { user: updatedUser, transaction }
}
