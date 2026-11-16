"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Root Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-white dark:bg-slate-950 font-sans">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[#FAFAFA] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. Please try reloading or go back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm transition-all shadow-xs border border-black/10 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
