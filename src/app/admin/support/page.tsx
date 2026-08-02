import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { LifeBuoy, CheckCircle, Clock, ArrowRight } from "lucide-react"

export const metadata = {
 title: "Support Tickets - Admin",
}

export default async function SupportTicketsPage() {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 const tickets = await prisma.supportTicket.findMany({
 orderBy: { createdAt: "desc" },
 include: {
 user: { select: { email: true, name: true } }
 }
 })

 return (
 <div className="p-8 max-w-6xl mx-auto w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Support Tickets</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage customer issues, bug reports, and billing queries.</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-3">
 <div className="flex items-center gap-2 mb-4">
 <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
 <h2 className="font-bold text-slate-900 dark:text-white">Recent Tickets</h2>
 </div>
 <div className="space-y-4">
 {tickets.map((ticket) => (
 <div key={ticket.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 hover:shadow-sm transition bg-slate-50 dark:bg-slate-900/50 cursor-pointer group">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
 ticket.status === "OPEN" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
 ticket.status === "IN_PROGRESS" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
 "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
 }`}>
 {ticket.status}
 </span>
 <span className="text-xs font-mono text-slate-400 dark:text-slate-500">#{ticket.id.substring(0, 8)}</span>
 </div>
 <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{ticket.subject}</h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 line-clamp-1 mb-2">{ticket.message}</p>
 <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
 <span className="font-semibold text-slate-600 dark:text-slate-300">{ticket.user.name || ticket.user.email}</span>
 <span>•</span>
 <span>{new Date(ticket.createdAt).toLocaleString()}</span>
 </div>
 </div>
 <div className="ml-4 h-full flex flex-col justify-center text-slate-300 group-hover:text-blue-600 dark:text-blue-400 transition">
 <ArrowRight className="w-5 h-5" />
 </div>
 </div>
 ))}
 {tickets.length === 0 && (
 <div className="text-center py-12 text-slate-500 dark:text-slate-400 dark:text-slate-500">
 <CheckCircle className="w-12 h-12 text-green-400 mb-3 opacity-50" />
 <p className="font-semibold">All caught up!</p>
 <p className="text-sm">There are no support tickets in the queue.</p>
 </div>
 )}
 </div>
 </div>

 <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white flex flex-col">
 <h2 className="font-bold mb-6 text-slate-300">Quick Stats</h2>
 <div className="space-y-6 flex-1">
 <div>
 <div className="text-4xl font-black mb-1 text-white">
 {tickets.filter(t => t.status === "OPEN").length}
 </div>
 <div className="text-sm font-semibold text-slate-400 dark:text-slate-500">Open Tickets</div>
 </div>
 <div>
 <div className="text-4xl font-black mb-1 text-white">
 {tickets.filter(t => t.status === "IN_PROGRESS").length}
 </div>
 <div className="text-sm font-semibold text-slate-400 dark:text-slate-500">In Progress</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
