import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Layers, Plus, Edit, Trash2 } from "lucide-react"

export const metadata = {
 title: "Content Templates - Super Admin",
}

export default async function ContentTemplatesPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 const mockTemplates = [
 { id: 1, name: "SEO Meta Generator", description: "Generates high converting meta titles and descriptions.", type: "AI Prompt", status: "Active" },
 { id: 2, name: "Blog Post Outline", description: "Creates a structured outline for technical blogs.", type: "AI Prompt", status: "Active" },
 { id: 3, name: "Email Newsletter", description: "Standard template for weekly newsletters.", type: "HTML", status: "Draft" },
 ]

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Content Templates</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage AI prompts and standard HTML templates used across the platform.</p>
 </div>
 <button className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-lg shadow flex items-center gap-2">
 <Plus className="w-4 h-4" /> New Template
 </button>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold">Template Name</th>
 <th className="px-6 py-4 font-bold">Type</th>
 <th className="px-6 py-4 font-bold">Status</th>
 <th className="px-6 py-4 font-bold text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {mockTemplates.map((template) => (
 <tr key={template.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
 <Layers className="w-4 h-4" />
 </div>
 <div>
 <div className="font-semibold text-slate-900 dark:text-white">{template.name}</div>
 <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{template.description}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded">
 {template.type}
 </span>
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 text-xs font-bold rounded ${
 template.status === "Active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
 }`}>
 {template.status}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:text-blue-400 transition"><Edit className="w-4 h-4" /></button>
 <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
 </div>
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
