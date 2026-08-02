import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ManageCreditsClient } from "./ManageCreditsClient"
import prisma from "@/lib/prisma/client"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Admin Credits | Instant Tool",
  description: "Access the Admin Credits page on Instant Tool.",
};

export default async function Page() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch initial list of users
  const initialUsers = await prisma.user.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      role: true,
    }
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Credits</h2>
      </div>
      <div className="mt-8">
        <ManageCreditsClient initialUsers={initialUsers} />
      </div>
    </div>
  )
}
