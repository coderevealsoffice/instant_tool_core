"use server"

import { auth } from "@/auth"
import { getQueueMetrics } from "@/lib/redis/queue"

export async function fetchBullMQStats() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized")
  }

  try {
    const metrics = await getQueueMetrics()
    return metrics
  } catch (error) {
    console.error("Redis connection failed:", error)
    return null
  }
}
