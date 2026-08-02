import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LegalEditor } from "@/components/admin/legal-editor"

export const metadata: Metadata = {
 title: "Create Legal Page | Super Admin | Instant Tool",
}

export default async function NewLegalPage() {
 const session = await auth()
 
 if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
  redirect("/auth/signin")
 }

 return (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Create Legal Page</h1>
      <p className="text-muted-foreground mt-2">
        Draft a new privacy policy, terms of service, or other legal document.
      </p>
    </div>

    <LegalEditor />
  </div>
 )
}
