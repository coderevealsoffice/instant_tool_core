import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma/client"
import { LegalEditor } from "@/components/admin/legal-editor"

export const metadata: Metadata = {
 title: "Edit Legal Page | Super Admin | Instant Tool",
}

export default async function EditLegalPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const session = await auth()
 
 if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
  redirect("/auth/signin")
 }

 const page = await prisma.legalPage.findUnique({
  where: { id }
 })

 if (!page) {
  notFound()
 }

 return (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Edit Legal Page</h1>
      <p className="text-muted-foreground mt-2">
        Update an existing legal document.
      </p>
    </div>

    <LegalEditor page={page} />
  </div>
 )
}
