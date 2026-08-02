import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import CategoriesPage from "./CategoriesClient"

export const metadata = { title: "Blog Categories - Super Admin" }

export default async function BlogCategoriesPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } })

 return <CategoriesPage initialCategories={categories} />
}
