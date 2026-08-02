import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { UserActions } from "./UserActions"
import { Search } from "lucide-react"

export const metadata = {
 title: "Manage Users - Super Admin",
}

export default async function UsersPage(props: { searchParams: Promise<{ q?: string }> }) {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }
 
 const searchParams = await props.searchParams
 const query = searchParams.q || ""

 const users = await prisma.user.findMany({
 where: query ? {
 OR: [
 { name: { contains: query, mode: "insensitive" } },
 { email: { contains: query, mode: "insensitive" } },
 ]
 } : undefined,
 orderBy: { createdAt: "desc" },
 take: 100, // Limiting for demo; implement pagination in prod
 })

 return (
 <div className="w-full space-y-8 p-5">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Users</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage all registered users, roles, and credits.</p>
 </div>
 
 <form className="relative w-full md:w-64">
 <input
 type="text"
 name="q"
 defaultValue={query}
 placeholder="Search users..."
 className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
 />
 <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
 </form>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold w-16">S.No.</th>
 <th className="px-6 py-4 font-bold">User</th>
 <th className="px-6 py-4 font-bold">Role</th>
 <th className="px-6 py-4 font-bold">Credits</th>
 <th className="px-6 py-4 font-bold">Joined</th>
 <th className="px-6 py-4 font-bold text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {users.map((user, index) => (
 <tr key={user.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
 {index + 1}
 </td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-900 dark:text-white">{user.name || "No Name"}</div>
 <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{user.email}</div>
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
 user.role === "SUPER_ADMIN" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
 user.role === "ADMIN" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
 user.role === "EMPLOYEE" ? "bg-blue-100 text-blue-700" :
 "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
 }`}>
 {user.role}
 </span>
 </td>
 <td className="px-6 py-4 font-black text-green-600 text-lg">
 {user.credits}
 </td>
 <td className="px-6 py-4">
 {new Date(user.createdAt).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 text-right">
 <UserActions user={{ id: user.id, name: user.name, email: user.email, role: user.role, credits: user.credits }} />
 </td>
 </tr>
 ))}
 {users.length === 0 && (
 <tr>
 <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
 No users found matching your search.
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
