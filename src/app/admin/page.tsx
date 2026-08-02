import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { Activity, Users, Database, CreditCard, ArrowUpRight } from "lucide-react"

export const metadata = {
 title: "Overview - Admin",
}

export default async function AdminOverviewPage() {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 // Fetch quick stats
 const totalUsers = await prisma.user.count()
 const totalJobs = await prisma.toolJob.count()
 const totalRevenue = await prisma.payment.aggregate({
 where: { status: "SUCCESS" },
 _sum: { amount: true }
 })
 
 const recentJobs = await prisma.toolJob.findMany({
 orderBy: { createdAt: "desc" },
 take: 5,
 include: { tool: true, user: true }
 })

 return (
 <div className="p-8 max-w-6xl mx-auto w-full space-y-8 w-full">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome to the Admin Panel</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Here's a top-level overview of InstantTool's performance.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
 <div className="flex justify-between items-start">
 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
 <Users className="w-5 h-5" />
 </div>
 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
 <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
 </span>
 </div>
 <div>
 <div className="text-2xl font-black text-slate-900 dark:text-white">{totalUsers.toLocaleString()}</div>
 <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Total Users</div>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
 <div className="flex justify-between items-start">
 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
 <Activity className="w-5 h-5" />
 </div>
 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
 <ArrowUpRight className="w-3 h-3 mr-1" /> 8%
 </span>
 </div>
 <div>
 <div className="text-2xl font-black text-slate-900 dark:text-white">{totalJobs.toLocaleString()}</div>
 <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Tools Run</div>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
 <div className="flex justify-between items-start">
 <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
 <CreditCard className="w-5 h-5" />
 </div>
 </div>
 <div>
 <div className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue._sum.amount?.toLocaleString() || "0"}</div>
 <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Total Revenue</div>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
 <div className="flex justify-between items-start">
 <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
 <Database className="w-5 h-5" />
 </div>
 </div>
 <div>
 <div className="text-2xl font-black text-slate-900 dark:text-white">Healthy</div>
 <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">System Status</div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
 <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
 <h2 className="font-bold text-slate-900 dark:text-white">Recent Processing Jobs</h2>
 </div>
 <div className="p-0">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <tbody className="divide-y divide-slate-100">
 {recentJobs.map((job) => (
 <tr key={job.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900 dark:text-white">{job.tool.name}</div>
 <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{job.user.email}</div>
 </td>
 <td className="px-6 py-4 text-right">
 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
 job.status === "COMPLETED" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
 job.status === "FAILED" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
 "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
 }`}>
 {job.status}
 </span>
 </td>
 </tr>
 ))}
 {recentJobs.length === 0 && (
 <tr>
 <td colSpan={2} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
 No jobs have been processed yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 
 <div className="bg-slate-900 rounded-2xl shadow-sm text-white p-6">
 <h2 className="font-bold mb-4 text-slate-300">Quick Actions</h2>
 <div className="space-y-3">
 <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 px-4 rounded-xl text-left text-sm font-semibold transition">
 Create Discount Coupon
 </button>
 <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 px-4 rounded-xl text-left text-sm font-semibold transition">
 View Support Tickets
 </button>
 <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 px-4 rounded-xl text-left text-sm font-semibold transition">
 Write New Blog Post
 </button>
 </div>
 </div>
 </div>
 </div>
 )
}
