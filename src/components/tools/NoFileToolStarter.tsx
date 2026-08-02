"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Play } from "lucide-react"

interface NoFileToolStarterProps {
  toolName: string
  toolSlug: string
  category?: string
  icon?: React.ReactNode
  buttonText?: string
  description?: string
}

export function NoFileToolStarter({
  toolName,
  toolSlug,
  category = "misc",
  icon,
  buttonText = "Start Tool",
  description
}: NoFileToolStarterProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { setContext, clearFiles } = useWorkspaceStore()

  const handleStart = () => {
    setIsProcessing(true)
    clearFiles()
    setContext(category, toolSlug)
    router.push(`/workspace?tool=${toolSlug}&category=${category}`)
  }

  return (
    <div
      className="relative rounded-xl border-4 border-dashed border-slate-300 dark:border-slate-700 p-8 md:p-16 text-center text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50 transition-all duration-300 hover:border-fuchsia-400 dark:hover:border-fuchsia-600 hover:bg-white dark:hover:bg-slate-900"
    >
      <div className="w-16 h-16 mb-6 mx-auto flex items-center justify-center text-slate-400 dark:text-slate-500">
        {icon || <Play className="w-12 h-12" />}
      </div>
      <h3 className="text-2xl font-bold mb-3">{toolName}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {description || "This tool generates a new file directly in your browser. Click below to begin."}
      </p>
      <button
        disabled={isProcessing}
        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-opacity-90 transition-all disabled:opacity-60"
        onClick={handleStart}
      >
        {isProcessing ? "Opening Workspace..." : buttonText}
      </button>
    </div>
  )
}
