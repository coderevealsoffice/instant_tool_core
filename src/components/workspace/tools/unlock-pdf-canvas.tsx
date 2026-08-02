"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Unlock, Loader2, CheckCircle, Play, ShieldOff, AlertCircle } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument } from "pdf-lib"

export function UnlockPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Unlock className="w-12 h-12 opacity-50" />
        <p>Upload a protected PDF file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setIsDone(false)
    setError(null)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()

      // Try to load with pdf-lib (client-side)
      let pdfDoc: any
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          password: password || undefined,
          ignoreEncryption: !password,
        } as any)
      } catch (e: any) {
        if (e.message?.includes("password") || e.message?.includes("encrypt")) {
          throw new Error("Incorrect password or the PDF requires a password to unlock.")
        }
        throw e
      }

      // Save as unlocked (no password)
      const unlockedBytes = await pdfDoc.save()
      const blob = new Blob([unlockedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-unlocked.pdf`
      a.click()
      URL.revokeObjectURL(url)

      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Failed to unlock PDF. Check the password and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Unlock PDF"
      description="Unlock PDF"
      icon={<Unlock className="w-6 h-6 text-green-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Unlock & Download"
      resultUrl={undefined}
      
    />
  )
}
