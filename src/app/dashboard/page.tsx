import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { Zap, FileText, Download, Activity, Wrench } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export const metadata = {
  title: "Dashboard | Instant Tool",
  description: "Access the Dashboard page on Instant Tool.",
};

export default async function DashboardOverview() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch recent output files, total download count, and recent tool usages
  const [recentFiles, totalDownloads, recentJobs] = await Promise.all([
    prisma.fileAsset.findMany({
      where: { userId: session.user.id, isOutput: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.fileAsset.count({
      where: { userId: session.user.id, isOutput: true }
    }),
    prisma.toolJob.findMany({
      where: { userId: session.user.id },
      include: { tool: true },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 lg:p-8 w-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your InstantTool account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Downloads Metric */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Downloads</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{totalDownloads}</p>
          </div>
        </div>

        {/* Quick Actions Card - Spans 2 columns on lg screens */}
        <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 shadow-sm text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-yellow-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black mb-1">Ready to work?</h3>
            <p className="text-slate-400 text-sm max-w-sm">Head over to the tools directory and start processing your files quickly and easily.</p>
          </div>
          
          <Link 
            href="/tools" 
            className="inline-flex items-center justify-center gap-2 shrink-0 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Explore Tools
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Tool Activity */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" /> Tool Activity
            </h2>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              No tool usage history found.
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {recentJobs.map(job => (
                <div key={job.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{job.tool?.name || "Unknown Tool"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{format(job.createdAt, "MMM d, yyyy • h:mm a")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      job.status === "COMPLETED" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                      job.status === "FAILED" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Downloads */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-slate-400" /> Recent Downloads
            </h2>
            <Link href="/dashboard/history" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          
          {recentFiles.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              Your recent downloads will appear here.
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {recentFiles.map(file => (
                <div key={file.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{file.fileName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{format(file.createdAt, "MMM d, yyyy • h:mm a")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hidden sm:inline-block">
                      {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <a 
                      href={file.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 transition"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
