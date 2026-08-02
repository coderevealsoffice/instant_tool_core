import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma/client"
import { BlogEditor } from "@/components/admin/blog-editor"

export const metadata: Metadata = {
 title: "Create Blog Post | Super Admin | Instant Tool",
}

export default async function NewBlogPostPage() {
 const session = await auth()
 
 if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
 redirect("/auth/signin")
 }

 const categories = await prisma.blogCategory.findMany({
 orderBy: { name: "asc" }
 })

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
 <p className="text-muted-foreground mt-2">
 Draft and publish a new article for the blog.
 </p>
 </div>

 <BlogEditor categories={categories} />
 </div>
 )
}
