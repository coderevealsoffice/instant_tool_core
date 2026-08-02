import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma/client"
import { BlogAdminClient } from "@/components/admin/blog-admin-client"

export const metadata: Metadata = {
 title: "Blog Management | Super Admin | Instant Tool",
 description: "Manage SEO blog content",
}

export default async function BlogAdminPage() {
 const session = await auth()
 
 if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
 redirect("/auth/signin")
 }

 const posts = await prisma.blogPost.findMany({
 orderBy: { createdAt: "desc" },
 include: { category: true }
 })
 
 const categories = await prisma.blogCategory.findMany({
 orderBy: { name: "asc" }
 })

 // Format dates for client
 const formattedPosts = posts.map(p => ({
 ...p,
 createdAt: p.createdAt.toISOString(),
 updatedAt: p.updatedAt.toISOString(),
 }))

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-3xl font-bold tracking-tight">Blog CMS</h1>
 <p className="text-muted-foreground mt-2">
 Create and manage SEO-optimized blog content to drive organic traffic.
 </p>
 </div>

 <BlogAdminClient posts={formattedPosts} categories={categories} />
 </div>
 )
}
