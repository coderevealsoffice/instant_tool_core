"use client"

import { useEffect, useState } from "react"
import { fetchBullMQStats } from "./queue-actions"
import { Server, Activity, CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QueueClient() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadStats = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchBullMQStats()
      if (data) {
        setStats(data)
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadStats()
    // Poll every 10 seconds
    const interval = setInterval(loadStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Connecting to Redis & fetching queue stats...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Redis Connection Failed</h3>
        <p className="text-red-600 dark:text-red-300">
          Make sure your Redis server is running and the <code>REDIS_URL</code> environment variable is set correctly.
        </p>
        <Button onClick={loadStats} variant="outline" className="border-red-200 text-red-700">Try Again</Button>
      </div>
    )
  }

  const { counts, recentJobs } = stats

  return (
    <div className="space-y-8 w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={loadStats} variant="outline" size="sm" className="gap-2" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-full flex items-center justify-center mb-2">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{counts.waiting}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waiting / Queued</div>
        </div>
        
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{counts.active}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Processing</div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{counts.completed}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{counts.failed}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Failed</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h2 className="font-bold text-slate-900 dark:text-white">Recent BullMQ Jobs</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold">Job ID</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">State</th>
                <th className="px-6 py-4 font-bold">Progress</th>
                <th className="px-6 py-4 font-bold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentJobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {job.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {job.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                      job.state === "completed" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                      job.state === "failed" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                      job.state === "active" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    }`}>
                      {job.state}
                    </span>
                    {job.failedReason && (
                      <div className="text-[10px] text-red-500 mt-1 max-w-xs truncate" title={job.failedReason}>
                        {job.failedReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {job.progress}%
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(job.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {recentJobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent Redis jobs found in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
