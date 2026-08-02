import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { Activity, CheckCircle, Clock, Search, XCircle } from "lucide-react"

export const metadata = {
 title: "Jobs History - Admin",
}

export default async function JobsHistoryPage(props: { searchParams: Promise<{ q?: string }> }) {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 const searchParams = await props.searchParams
 const query = searchParams.q || ""

 const jobs = await prisma.toolJob.findMany({
 where: {
 ...(query ? {
 OR: [
 { id: { contains: query, mode: "insensitive" } },
 { user: { email: { contains: query, mode: "insensitive" } } }
 ]
 } : {})
 },
 orderBy: { createdAt: "desc" },
 take: 100,
 include: {
 user: { select: { email: true, name: true } },
 tool: { select: { name: true, category: true } }
 }
 })

 return (
 <div className="p-8 max-w-6xl mx-auto w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Job Processing History</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Track all tool usage by users across the platform in real-time.</p>
 </div>
 
 <form className="relative w-full md:w-80">
 <input
 type="text"
 name="q"
 defaultValue={query}
 placeholder="Search by Job ID or User Email..."
 className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
 />
 <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
 </form>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold">Job ID</th>
 <th className="px-6 py-4 font-bold">Tool</th>
 <th className="px-6 py-4 font-bold">User</th>
 <th className="px-6 py-4 font-bold">Credits</th>
 <th className="px-6 py-4 font-bold">Status</th>
 <th className="px-6 py-4 font-bold">Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {jobs.map((job) => (
 <tr key={job.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500">
 {job.id}
 </td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900 dark:text-white">{job.tool.name}</div>
 <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{job.tool.category}</div>
 </td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-900 dark:text-white">{job.user.name || "User"}</div>
 <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{job.user.email}</div>
 </td>
 <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
 {job.creditsUsed > 0 ? `-${job.creditsUsed}` : "0"}
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
 job.status === "COMPLETED" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
 job.status === "FAILED" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
 job.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
 "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
 }`}>
 {job.status === "COMPLETED" && <CheckCircle className="w-3 h-3" />}
 {job.status === "FAILED" && <XCircle className="w-3 h-3" />}
 {job.status === "PROCESSING" && <Activity className="w-3 h-3" />}
 {job.status === "PENDING" && <Clock className="w-3 h-3" />}
 {job.status}
 </span>
 </td>
 <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
 {new Date(job.createdAt).toLocaleString()}
 </td>
 </tr>
 ))}
 {jobs.length === 0 && (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center">
 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
 <Activity className="w-6 h-6 text-slate-400 dark:text-slate-500" />
 </div>
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Jobs Found</h3>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">No processing jobs match your criteria.</p>
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
