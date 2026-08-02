import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { NotificationList } from "./NotificationList"

export const metadata = {
  title: "Dashboard Notifications | Instant Tool",
  description: "View your latest notifications on Instant Tool.",
};

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50 // Limit to 50 latest notifications
  })

  // Prisma returns enums as string, so we can pass it directly to the client
  const mappedNotifications = notifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: "INFO" as "INFO" | "SUCCESS" | "WARNING" | "ERROR",
    isRead: n.isRead,
    createdAt: n.createdAt
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Notifications</h1>
        <p className="text-slate-500">Stay updated on your account activity and announcements.</p>
      </div>

      <NotificationList notifications={mappedNotifications} />
    </div>
  )
}
