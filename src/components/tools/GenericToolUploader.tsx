"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { UploadCloud } from "lucide-react"

interface GenericToolUploaderProps {
  toolName: string
  accept?: string
  toolSlug: string
  category: string
}

export function GenericToolUploader({
  toolName,
  accept = "*",
  toolSlug,
  category,
}: GenericToolUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFile = (file: File) => {
    setIsProcessing(true)
    setContext(category, toolSlug)
    addFiles([file])
    router.push(`/workspace?tool=${toolSlug}&category=${category}`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={`relative rounded-xl border-4 border-dashed p-8 md:p-16 text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-fuchsia-400 bg-white/80 dark:bg-slate-800 scale-102 text-fuchsia-600 dark:text-fuchsia-400"
          : "border-slate-300 dark:border-slate-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-600 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${toolSlug}`)?.click()}
    >
      <input
        id={`file-input-${toolSlug}`}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <UploadCloud
        className={`w-16 h-16 mb-6 mx-auto transition-transform duration-300 ${isDragging ? "scale-110 text-fuchsia-500" : "opacity-80 text-slate-400 dark:text-slate-500"}`}
      />
      
      {isProcessing ? (
        <div className="animate-pulse">
          <h3 className="text-2xl font-bold mb-2">Preparing {toolName}...</h3>
          <p className="text-slate-500 dark:text-slate-400">Loading workspace editor</p>
        </div>
      ) : (
        <>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all mb-4 hover:scale-105 active:scale-95">
            CHOOSE FILES
          </button>
          <p className="text-slate-500 dark:text-slate-400 text-sm">or drop files here</p>
        </>
      )}
    </div>
  )
}
