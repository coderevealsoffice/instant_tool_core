import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma/client"
import { BlogEditor } from "@/components/admin/blog-editor"

export const metadata: Metadata = {
 title: "Edit Blog Post | Super Admin | Instant Tool",
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
 const session = await auth()
 
 if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
 redirect("/auth/signin")
 }

 const { id } = await params
 
 const post = await prisma.blogPost.findUnique({
 where: { id }
 })
 
 if (!post) {
 notFound()
 }

 const categories = await prisma.blogCategory.findMany({
 orderBy: { name: "asc" }
 })
 
 // Format dates for client
 const formattedPost = {
 ...post,
 createdAt: post.createdAt.toISOString(),
 updatedAt: post.updatedAt.toISOString(),
 }

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
 <p className="text-muted-foreground mt-2">
 Update the content and SEO metadata for this article.
 </p>
 </div>

 <BlogEditor post={formattedPost} categories={categories} />
 </div>
 )
}
