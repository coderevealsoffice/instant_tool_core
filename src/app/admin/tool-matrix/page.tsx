import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import MatrixClient from "./MatrixClient"

export const metadata = {
  title: "Tool Credit Matrix - Super Admin",
}

export default async function ToolMatrixPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/")
  }
  
  const tools = await prisma.toolDefinition.findMany({
    orderBy: { category: "asc" }
  })

  return (
    <div className="p-8 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Tool Credit Matrix</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage tool availability and the credit cost per operation.</p>
      </div>

      <MatrixClient tools={tools} />
    </div>
  )
}
