import { Queue, QueueEvents, Job } from "bullmq"
import IORedis from "ioredis"

const connectionUrl = process.env.REDIS_URL || "redis://localhost:6379"
const connection = new IORedis(connectionUrl, {
  maxRetriesPerRequest: null,
})

export const mainQueue = new Queue("instant-tools-main-queue", { connection })
export const queueEvents = new QueueEvents("instant-tools-main-queue", { connection })

export async function addJobToQueue(name: string, data: any) {
  return await mainQueue.add(name, data)
}

export async function getQueueMetrics() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    mainQueue.getWaitingCount(),
    mainQueue.getActiveCount(),
    mainQueue.getCompletedCount(),
    mainQueue.getFailedCount(),
    mainQueue.getDelayedCount(),
  ])

  // Get some recent jobs
  const recentJobs = await mainQueue.getJobs(["waiting", "active", "completed", "failed"], 0, 10, true)

  return {
    counts: { waiting, active, completed, failed, delayed },
    recentJobs: recentJobs.map((j) => ({
      id: j.id,
      name: j.name,
      data: j.data,
      returnvalue: j.returnvalue,
      progress: j.progress,
      failedReason: j.failedReason,
      timestamp: j.timestamp,
      finishedOn: j.finishedOn,
      state: j.id ? mainQueue.getJobState(j.id) : "unknown" // gets state as string
    })),
  }
}
