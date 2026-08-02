import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { BookOpen, Plus, FileText, Globe } from "lucide-react"
import Link from "next/link"
import { BlogActionButtons } from "./components/BlogActionButtons"
export const metadata = {
 title: "CMS & Content - Admin",
}

export default async function CMSPage() {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 const posts = await prisma.blogPost.findMany({
 orderBy: { createdAt: "desc" },
 include: { category: true }
 })

 return (
 <div className="p-8 max-w-6xl mx-auto w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">CMS & Content Manager</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage blog posts, SEO content, and FAQs to drive organic traffic.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="h-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold px-4 rounded-lg shadow-sm flex items-center gap-2 transition">
 <Globe className="w-4 h-4" /> Manage FAQs
 </button>
 <Link href="/admin/cms/new" className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg shadow-sm flex items-center gap-2 transition">
 <Plus className="w-4 h-4" /> Write Post
 </Link>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
 <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
 <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
 <BookOpen className="w-5 h-5 text-slate-400 dark:text-slate-500" /> All Blog Posts
 </h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
 <thead className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500">
 <tr>
 <th className="px-6 py-4 font-bold">Title</th>
 <th className="px-6 py-4 font-bold">Author</th>
 <th className="px-6 py-4 font-bold">Category</th>
 <th className="px-6 py-4 font-bold">Status</th>
 <th className="px-6 py-4 font-bold">Date</th>
 <th className="px-6 py-4 font-bold text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {posts.map((post) => (
 <tr key={post.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</div>
 <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">/{post.slug}</div>
 </td>
 <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
 {post.author || "Admin"}
 </td>
 <td className="px-6 py-4">
 <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold text-slate-600 dark:text-slate-300">
 {post.category?.name || "Uncategorized"}
 </span>
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
 post.isPublished ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
 }`}>
 {post.isPublished ? "Published" : "Draft"}
 </span>
 </td>
 <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
 {new Date(post.createdAt).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 text-right">
 <BlogActionButtons postId={post.id} />
 </td>
 </tr>
 ))}
 {posts.length === 0 && (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center border-2 border-dashed border-transparent">
 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 mb-4 border border-slate-100 dark:border-slate-800">
 <FileText className="w-6 h-6 text-slate-400 dark:text-slate-500" />
 </div>
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Posts Found</h3>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Start writing to attract SEO traffic.</p>
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
