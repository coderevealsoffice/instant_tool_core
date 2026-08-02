"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { RotateCw, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument, degrees } from "pdf-lib"
import { toast } from "sonner"

const ROTATIONS = [
  { label: "Right (90°)", value: 90 },
  { label: "Left (-90°)", value: -90 },
  { label: "Upside Down (180°)", value: 180 },
]

export function RotatePdfCanvas() {
  const { files } = useWorkspaceStore()
  const [angle, setAngle] = useState(90)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <RotateCw className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a PDF file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const pages = pdfDoc.getPages()
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(currentRotation + angle))
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rotated-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Rotation failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Rotation Angle</label>
      <div className="grid grid-cols-3 gap-3">
        {ROTATIONS.map(r => (
          <button
            key={r.value}
            onClick={() => setAngle(r.value)}
            className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${angle === r.value ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-orange-400"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Rotate PDF"
      description="Rotate all pages of your PDF to the correct orientation."
      icon={<RotateCw className="w-6 h-6 text-orange-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Rotate & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
