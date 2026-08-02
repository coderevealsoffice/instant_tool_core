"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Archive, Loader2, CheckCircle, Play, Plus, X } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import JSZip from "jszip"
import { toast } from "sonner"

export function ArchiveConverterCanvas() {
  const { files } = useWorkspaceStore()
  const [extraFiles, setExtraFiles] = useState<File[]>([])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const primaryFile = files?.[0]?.file ?? null

  if (!primaryFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Archive className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a file to start creating an archive.</p>
      </div>
    )
  }

  const allFiles = [primaryFile, ...extraFiles]

  const handleProcess = async () => {
    setIsProcessing(true)
    setIsDone(false)
    try {
      const zip = new JSZip()
      
      allFiles.forEach((file) => {
        zip.file(file.name, file)
      })
      
      const zipBlob = await zip.generateAsync({ type: "blob" })
      
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `archive-${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(url)
      
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to create ZIP archive.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="ZIP Archive Creator"
      description="ZIP Archive Creator"
      icon={<Archive className="w-6 h-6 text-slate-700" />}
      originalFile={primaryFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Create ZIP & Download"
      resultUrl={undefined}
      
    />
  )
}
