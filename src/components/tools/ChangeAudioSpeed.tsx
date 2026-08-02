"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"

export function ChangeAudioSpeed() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setContext("audio-tools", "change-speed")
      addFiles(newFiles)
      router.push(`/workspace?tool=change-speed&category=audio-tools`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  return (
    <div 
      className={`relative rounded-xl border-4 border-dashed transition-all p-8 md:p-16 text-center ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-emerald-200 hover:border-emerald-400"}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { 
        e.preventDefault(); 
        setIsDragging(false);
        if (e.dataTransfer.files) {
          handleFiles(Array.from(e.dataTransfer.files))
        }
      }}
    >
      <UploadCloud className="w-16 h-16 text-emerald-500 mb-6 mx-auto opacity-80" />
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button 
        size="lg" 
        className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 h-14 mb-4 font-bold shadow-xl rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        CHOOSE FILES
      </Button>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">or drop files here</p>
    </div>
  )
}
