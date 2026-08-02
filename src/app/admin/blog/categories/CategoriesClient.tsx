"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveBlogCategory } from "@/actions/blog"
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CategoriesPage({ initialCategories }: { initialCategories: any[] }) {
 const router = useRouter()
 const [categories, setCategories] = useState(initialCategories)
 const [name, setName] = useState("")
 const [slug, setSlug] = useState("")
 const [isProcessing, setIsProcessing] = useState(false)

 const handleNameChange = (val: string) => {
 setName(val)
 setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
 }

 const handleCreate = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsProcessing(true)
 try {
 await saveBlogCategory({ name, slug })
 setName("")
 setSlug("")
 router.refresh()
 } catch (err: any) {
 toast.error(err.message || "Failed")
 } finally {
 setIsProcessing(false)
 }
 }

 return (
 <div className="w-full space-y-8">
 <Link href="/admin/blog" className="text-sm font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white flex items-center gap-2 w-fit">
 <ArrowLeft className="w-4 h-4" /> Back to Posts
 </Link>

 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Blog Categories</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Organize your blog posts into categories.</p>
 </div>

 {/* Create Form */}
 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
 <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Category</h2>
 <form onSubmit={handleCreate} className="flex gap-3">
 <input
 required
 value={name}
 onChange={e => handleNameChange(e.target.value)}
 placeholder="Category Name"
 className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
 />
 <button
 type="submit"
 disabled={isProcessing}
 className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-70"
 >
 {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
 Add
 </button>
 </form>
 {slug && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">Slug: {slug}</p>}
 </div>

 {/* Category List */}
 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <table className="w-full text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b text-slate-900 dark:text-white">
 <tr>
 <th className="px-6 py-4 font-bold text-left">Name</th>
 <th className="px-6 py-4 font-bold text-left">Slug</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {categories.map(cat => (
 <tr key={cat.id}>
 <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{cat.name}</td>
 <td className="px-6 py-4 font-mono text-slate-400 dark:text-slate-500">{cat.slug}</td>
 </tr>
 ))}
 {categories.length === 0 && (
 <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">No categories yet.</td></tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )
}
