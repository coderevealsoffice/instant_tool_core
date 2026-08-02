import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { SupportClient } from "@/components/dashboard/support-client"

export const metadata = {
  title: "Support - InstantTool",
}

export default async function SupportPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const initialTickets = await prisma.supportTicket.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Help & Support</h1>
        <p className="text-slate-500">Need help? Create a ticket and our team will get back to you.</p>
      </div>

      <SupportClient initialTickets={initialTickets} />
    </div>
  )
}
