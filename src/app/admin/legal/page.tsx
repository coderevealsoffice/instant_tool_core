import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Edit3, FileText, Plus } from "lucide-react"

export const metadata = {
 title: "Legal Pages Manager - Super Admin",
}

export default async function LegalPagesManager() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 const legalPages = await prisma.legalPage.findMany({
 orderBy: { updatedAt: "desc" },
 })

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Legal Page Manager</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Create and edit Privacy Policy, Terms of Service, and other legal documents.</p>
 </div>
 <Link href="/admin/legal/new" className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-lg shadow flex items-center gap-2">
 <Plus className="w-4 h-4" /> Create Page
 </Link>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {legalPages.map((page) => (
 <div key={page.id} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col h-full">
 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
 <FileText className="w-6 h-6" />
 </div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{page.title}</h2>
 <p className="text-sm font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4 bg-slate-50 dark:bg-slate-900 inline-block px-2 py-1 rounded">/{page.slug}</p>
 
 <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
 <span className="text-xs text-slate-400 dark:text-slate-500">
 Updated: {new Date(page.updatedAt).toLocaleDateString()}
 </span>
 <Link href={`/admin/legal/${page.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
 <Edit3 className="w-4 h-4" /> Edit
 </Link>
 </div>
 </div>
 ))}
 {legalPages.length === 0 && (
 <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
 <FileText className="w-12 h-12 text-slate-300 mb-4" />
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Legal Pages Found</h3>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">You haven't created any legal documents yet.</p>
 </div>
 )}
 </div>
 </div>
 )
}
