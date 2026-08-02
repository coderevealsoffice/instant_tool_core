"use client"

import { Button } from "@/components/ui/button"
import { Crown, ArrowRight, Loader2 } from "lucide-react"

interface WorkspaceHeaderProps {
  toolName: string
  onFinish?: () => void
  isProcessing?: boolean
}

export function WorkspaceHeader({ toolName, onFinish, isProcessing }: WorkspaceHeaderProps) {
  // Format tool name: merge-pdf -> Merge
  const title = toolName.split("-")[0].charAt(0).toUpperCase() + toolName.split("-")[0].slice(1)

  return (
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      
      {/* Left side: Title */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>


      {/* Right side: Finish */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden sm:flex h-10 gap-2 font-bold text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700">
          <Crown className="w-4 h-4" /> Get Pro
        </Button>
        <Button 
          onClick={onFinish} 
          disabled={isProcessing}
          className="h-10 px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Finish <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </div>

    </header>
  )
}
