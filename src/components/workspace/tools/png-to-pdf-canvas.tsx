"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileImage, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

export function PngToPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileImage className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a PNG image to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const pdfDoc = await PDFDocument.create()
      const image = await pdfDoc.embedPng(arrayBuffer)
      
      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: Make sure the file is a valid PNG.`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="PNG to PDF"
      description="PNG to PDF"
      icon={<FileImage className="w-6 h-6 text-sky-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert to PDF & Download"
      resultUrl={undefined}
      customSettings={<>{isDone && <div className="flex items-center space-x-2 text-emerald-600"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Done! File downloaded.</span></div>}</>}
    />
  )
}
