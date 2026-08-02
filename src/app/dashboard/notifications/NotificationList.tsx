"use client"

import { useState } from "react"
import { markAsReadAction, markAllAsReadAction } from "./actions"
import { format } from "date-fns"
import { Bell, Check, CheckCircle2, Info, AlertCircle } from "lucide-react"
import { toast } from "sonner"

type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

type Notification = {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: Date
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  const handleMarkAll = async () => {
    setIsMarkingAll(true)
    try {
      await markAllAsReadAction()
      toast.success("All marked as read")
    } catch (error) {
      toast.error("Failed to update")
    } finally {
      setIsMarkingAll(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "WARNING": return <AlertCircle className="w-5 h-5 text-amber-600" />
      case "ERROR": return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case "SUCCESS": return "bg-green-50"
      case "WARNING": return "bg-amber-50"
      case "ERROR": return "bg-red-50"
      default: return "bg-blue-50"
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 font-medium">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.</p>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAll}
            disabled={isMarkingAll}
            className="text-sm font-bold text-blue-600 hover:underline disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              icon={getIcon(notification.type)} 
              bg={getBg(notification.type)} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NotificationItem({ notification, icon, bg }: { notification: Notification, icon: React.ReactNode, bg: string }) {
  const [isRead, setIsRead] = useState(notification.isRead)
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkAsRead = async () => {
    if (isRead) return
    setIsMarking(true)
    try {
      await markAsReadAction(notification.id)
      setIsRead(true)
    } catch (error) {
      toast.error("Failed to mark as read")
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <div className={`p-4 rounded-xl border flex gap-4 transition-colors ${
      isRead ? "bg-white border-slate-200" : "bg-blue-50/50 border-blue-200"
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-bold ${isRead ? "text-slate-700" : "text-slate-900"}`}>
            {notification.title}
          </h3>
          <span className="text-xs font-medium text-slate-500 shrink-0 ml-4">
            {format(new Date(notification.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
        <p className={`text-sm ${isRead ? "text-slate-500" : "text-slate-700"} mb-3`}>
          {notification.message}
        </p>
        
        {!isRead && (
          <button 
            onClick={handleMarkAsRead}
            disabled={isMarking}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" /> 
            {isMarking ? "Marking..." : "Mark as read"}
          </button>
        )}
      </div>
    </div>
  )
}
