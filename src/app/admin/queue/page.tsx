import { auth } from "@/auth"
import { redirect } from "next/navigation"
import QueueClient from "./QueueClient"

export const metadata = {
  title: "Queue & Workers - Super Admin",
}

export default async function QueueWorkersPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/")
  }

  return (
    <div className="p-8 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Queue & Workers</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor background Redis jobs (BullMQ), webhooks, and worker health.</p>
      </div>

      <QueueClient />
    </div>
  )
}
