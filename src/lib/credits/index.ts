import prisma from "@/lib/prisma/client"
import { TransactionType } from "@prisma/client"

/**
 * Checks if a user has enough credits.
 * Currently set to 100% free for all users.
 */
export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  return true
}

/**
 * Deducts credits from a user's wallet.
 * Runs in 100% free mode: never blocks tool execution or throws 'Insufficient credits'.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  jobId?: string,
  description?: string
) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { user: { id: userId, credits: 999 }, transaction: null }
    }

    // If user has credits, decrement safely without ever throwing
    if (user.credits >= amount) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } }
      })
      return { user: updatedUser, transaction: null }
    }

    return { user, transaction: null }
  } catch (error) {
    return { user: { id: userId, credits: 999 }, transaction: null }
  }
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
