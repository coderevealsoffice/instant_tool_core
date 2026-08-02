import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { ShieldAlert, FileText, User, Calendar } from "lucide-react"

export const metadata = {
  title: "Audit Logs - Super Admin",
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const query = searchParams?.q || ""

  const logs = await prisma.auditLog.findMany({
    where: query ? {
      action: { contains: query, mode: "insensitive" }
    } : {},
    orderBy: { createdAt: "desc" },
    take: 100, // Limit to recent 100 for performance
    include: {
      user: {
        select: { name: true, email: true, role: true }
      }
    }
  })

  return (
    <div className="p-8 w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and monitor administrative actions and security events.</p>
        </div>
        
        <form className="relative w-full md:w-64">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search logs..."
            className="w-full pl-4 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </form>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              <tr>
                <th className="px-6 py-4 font-bold flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> User</th>
                <th className="px-6 py-4 font-bold"><ShieldAlert className="w-4 h-4 text-slate-400 inline mr-2"/> Action</th>
                <th className="px-6 py-4 font-bold"><FileText className="w-4 h-4 text-slate-400 inline mr-2"/> Details</th>
                <th className="px-6 py-4 font-bold"><Calendar className="w-4 h-4 text-slate-400 inline mr-2"/> Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {log.user?.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {log.user?.email || "No Email"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-mono font-bold tracking-wider uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 break-all max-w-sm">
                      {log.details ? JSON.stringify(log.details) : "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
