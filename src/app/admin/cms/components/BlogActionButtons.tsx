"use client"

import { useState } from "react"
import Link from "next/link"
import { deletePostAction } from "../actions"
import { toast } from "sonner"
import { Loader2, Trash2, Edit } from "lucide-react"

export function BlogActionButtons({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return

    setIsDeleting(true)
    try {
      await deletePostAction(postId)
      toast.success("Blog post deleted successfully")
    } catch (err) {
      toast.error("Failed to delete blog post")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={`/admin/cms/${postId}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm flex items-center gap-1">
        <Edit className="w-4 h-4" /> Edit
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="text-red-600 dark:text-red-400 font-semibold hover:underline text-sm flex items-center gap-1 disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
      </button>
    </div>
  )
}
