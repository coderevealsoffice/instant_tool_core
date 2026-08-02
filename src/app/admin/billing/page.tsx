import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { CreditCard, Check, X, Clock, Search, ExternalLink } from "lucide-react"

export const metadata = {
 title: "Billing & Payments - Super Admin",
}

export default async function PaymentsPage(props: { searchParams: Promise<{ q?: string }> }) {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 const searchParams = await props.searchParams
 const query = searchParams.q || ""

 const payments = await prisma.payment.findMany({
 where: {
 ...(query ? {
 OR: [
 { razorpayOrderId: { contains: query, mode: "insensitive" } },
 { razorpayPaymentId: { contains: query, mode: "insensitive" } },
 { user: { email: { contains: query, mode: "insensitive" } } }
 ]
 } : {})
 },
 orderBy: { createdAt: "desc" },
 take: 50,
 include: {
 user: { select: { email: true, name: true } },
 }
 })

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Payments & Transactions</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Monitor incoming revenue, failed payments, and subscriptions.</p>
 </div>
 
 <form className="relative w-full md:w-80">
 <input
 type="text"
 name="q"
 defaultValue={query}
 placeholder="Search by Order ID or User..."
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
 <th className="px-6 py-4 font-bold">Transaction ID</th>
 <th className="px-6 py-4 font-bold">User</th>
 <th className="px-6 py-4 font-bold">Amount</th>
 <th className="px-6 py-4 font-bold">Status</th>
 <th className="px-6 py-4 font-bold">Date</th>
 <th className="px-6 py-4 font-bold text-right">Invoice</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {payments.map((payment) => (
 <tr key={payment.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4">
 <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{payment.razorpayPaymentId || "Manual Entry"}</div>
 <div className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">{payment.razorpayOrderId}</div>
 </td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-900 dark:text-white">{payment.user.name || "User"}</div>
 <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{payment.user.email}</div>
 </td>
 <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-base">
 {payment.currency === "INR" ? "₹" : "$"}{payment.amount}
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
 payment.status === "SUCCESS" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
 payment.status === "FAILED" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
 "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
 }`}>
 {payment.status === "SUCCESS" && <Check className="w-3 h-3" />}
 {payment.status === "FAILED" && <X className="w-3 h-3" />}
 {payment.status === "PENDING" && <Clock className="w-3 h-3" />}
 {payment.status}
 </span>
 </td>
 <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
 {new Date(payment.createdAt).toLocaleString()}
 </td>
 <td className="px-6 py-4 text-right">
 <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition inline-flex items-center gap-1" title="View Invoice">
 <ExternalLink className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 {payments.length === 0 && (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center">
 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
 <CreditCard className="w-6 h-6 text-slate-400 dark:text-slate-500" />
 </div>
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Payments Yet</h3>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">No transactions have been recorded.</p>
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
