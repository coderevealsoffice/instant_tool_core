import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { BlogForm } from "../components/BlogForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Write Post - CMS",
}

export default async function NewPostPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect("/")
  }

  const categories = await prisma.blogCategory.findMany()

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/cms" className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Write New Post</h1>
          <p className="text-slate-500 dark:text-slate-400">Create a new blog post for your CMS.</p>
        </div>
      </div>

      <BlogForm categories={categories} />
    </div>
  )
}
