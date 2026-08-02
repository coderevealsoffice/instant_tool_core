import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"

export const metadata = {
 title: "Audit Logs - Super Admin",
}

export default async function AuditLogsPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 // Fetch the latest audit logs from the database
 const logs = await prisma.auditLog.findMany({
 orderBy: { createdAt: "desc" },
 take: 50,
 include: {
 user: {
 select: {
 name: true,
 email: true,
 role: true,
 }
 }
 }
 })

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Audit Logs</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Track system events, administrative actions, and security events.</p>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold">Timestamp</th>
 <th className="px-6 py-4 font-bold">User</th>
 <th className="px-6 py-4 font-bold">Action</th>
 <th className="px-6 py-4 font-bold">Details</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {logs.map((log) => (
 <tr key={log.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono">
 {new Date(log.createdAt).toLocaleString()}
 </td>
 <td className="px-6 py-4">
 {log.user ? (
 <div>
 <div className="font-semibold text-slate-900 dark:text-white">{log.user.name}</div>
 <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{log.user.email}</div>
 </div>
 ) : (
 <span className="text-slate-400 dark:text-slate-500 font-medium">System</span>
 )}
 </td>
 <td className="px-6 py-4">
 <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold font-mono">
 {log.action}
 </span>
 </td>
 <td className="px-6 py-4">
 <pre className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 max-w-xs overflow-x-auto">
 {log.details ? JSON.stringify(log.details, null, 2) : "{}"}
 </pre>
 </td>
 </tr>
 ))}
 {logs.length === 0 && (
 <tr>
 <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
 No audit logs available yet.
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
