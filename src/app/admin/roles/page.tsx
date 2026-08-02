import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Check, X } from "lucide-react"

export const metadata = {
 title: "Role & Permission Matrix - Super Admin",
}

export default async function RolesPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 const permissions = [
 { name: "Access Basic Tools", USER: true, EMPLOYEE: true, ADMIN: true, SUPER_ADMIN: true },
 { name: "Access Pro Tools", USER: false, EMPLOYEE: true, ADMIN: true, SUPER_ADMIN: true },
 { name: "View Customer Data", USER: false, EMPLOYEE: true, ADMIN: true, SUPER_ADMIN: true },
 { name: "Edit Tool Pricing", USER: false, EMPLOYEE: false, ADMIN: false, SUPER_ADMIN: true },
 { name: "Manage Site Settings", USER: false, EMPLOYEE: false, ADMIN: true, SUPER_ADMIN: true },
 { name: "Manage Roles", USER: false, EMPLOYEE: false, ADMIN: false, SUPER_ADMIN: true },
 ]

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Role & Permission Matrix</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">View and manage system-wide role access control.</p>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold w-1/3">Permission</th>
 <th className="px-6 py-4 font-bold text-center">User</th>
 <th className="px-6 py-4 font-bold text-center">Employee</th>
 <th className="px-6 py-4 font-bold text-center">Admin</th>
 <th className="px-6 py-4 font-bold text-center">Super Admin</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {permissions.map((perm, idx) => (
 <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{perm.name}</td>
 <td className="px-6 py-4 text-center">
 {perm.USER ? <Check className="w-5 h-5 text-green-500 dark:text-green-400 " /> : <X className="w-5 h-5 text-slate-300 " />}
 </td>
 <td className="px-6 py-4 text-center">
 {perm.EMPLOYEE ? <Check className="w-5 h-5 text-green-500 dark:text-green-400 " /> : <X className="w-5 h-5 text-slate-300 " />}
 </td>
 <td className="px-6 py-4 text-center">
 {perm.ADMIN ? <Check className="w-5 h-5 text-green-500 dark:text-green-400 " /> : <X className="w-5 h-5 text-slate-300 " />}
 </td>
 <td className="px-6 py-4 text-center">
 {perm.SUPER_ADMIN ? <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 " /> : <X className="w-5 h-5 text-slate-300 " />}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )
}
