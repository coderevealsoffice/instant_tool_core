"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileSignature, UploadCloud } from "lucide-react"

export function SignPdf() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === "application/pdf")
    if (pdfs.length > 0) {
      setContext("pdf-tools", "sign-pdf")
      addFiles(pdfs)
      router.push("/workspace?tool=sign-pdf&category=pdf-tools")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files))
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)) }}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full max-w-2xl mx-auto rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 p-16 flex flex-col items-center justify-center gap-5 group
        ${isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800"
        }`}
    >
      <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />

      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105
        ${isDragging ? "bg-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"}`}>
        <FileSignature className="w-10 h-10 text-white" />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {isDragging ? "Drop your PDF here!" : "Select PDF to Sign"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Drag & drop or click to upload your PDF document
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <UploadCloud className="w-4 h-4" />
        <span>PDF files only • Processed securely in your browser</span>
      </div>
    </div>
  )
}
