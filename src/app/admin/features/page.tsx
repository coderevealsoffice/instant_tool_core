import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { ToggleLeft, ToggleRight } from "lucide-react"

export const metadata = {
 title: "Feature Toggles - Super Admin",
}

export default async function FeatureTogglesPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 const tools = await prisma.toolDefinition.findMany({
 orderBy: { category: "asc" }
 })

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Feature Toggles</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Enable or disable specific tools or platform features globally.</p>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6">
 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tool Availability</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {tools.map((tool) => (
 <div key={tool.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:bg-slate-900 transition">
 <div>
 <h3 className="font-bold text-slate-900 dark:text-white">{tool.name}</h3>
 <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">{tool.category}</p>
 </div>
 <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white transition-colors">
 {tool.isActive ? (
 <ToggleRight className="w-8 h-8 text-green-500 dark:text-green-400" />
 ) : (
 <ToggleLeft className="w-8 h-8 text-slate-300" />
 )}
 </button>
 </div>
 ))}
 {tools.length === 0 && (
 <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
 No tools defined in the database to toggle.
 </div>
 )}
 </div>
 </div>
 </div>
 )
}
