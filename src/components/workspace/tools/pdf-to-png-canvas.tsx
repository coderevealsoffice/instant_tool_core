"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileImage, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import JSZip from "jszip"
import { toast } from "sonner"

export function PdfToPngCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileImage className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a PDF file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

      const arrayBuffer = await activeFile.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
      const pdfDoc = await loadingTask.promise

      const zip = new JSZip()
      const totalPages = pdfDoc.numPages

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 }) // High quality
        
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png")
        })

        zip.file(`page-${i}.png`, blob)
        setProgress(Math.round((i / totalPages) * 100))
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-images.zip`
      a.click()
      URL.revokeObjectURL(url)
      
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to convert PDF to PNG. Please ensure it's a valid PDF.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="PDF to PNG"
      description="Extracts every page of your PDF into transparent PNG images and downloads them as a ZIP file."
      icon={<FileImage className="w-6 h-6 text-sky-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert & Download ZIP"
      resultUrl={undefined}
      
    />
  )
}
