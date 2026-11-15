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
      className="relative rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center text-slate-900 dark:text-white shadow-sm transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center mx-auto mb-4 border border-black/10 shadow-2xs">
        {icon || <Play className="w-7 h-7" />}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">{toolName}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
        {description || "This tool operates directly in your browser. Click below to launch."}
      </p>
      <button
        disabled={isProcessing}
        className="bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 px-7 py-3 rounded-xl font-semibold text-sm sm:text-base border border-black/10 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        onClick={handleStart}
      >
        {isProcessing ? "Opening Tool Canvas..." : buttonText}
      </button>
    </div>
  )
}
