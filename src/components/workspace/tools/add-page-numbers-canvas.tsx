"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Hash, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { toast } from "sonner"

export function AddPageNumbersCanvas() {
  const { files } = useWorkspaceStore()
  const [position, setPosition] = useState("bottom-center")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Hash className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a PDF file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      
      pages.forEach((page, idx) => {
        const { width, height } = page.getSize()
        const text = `${idx + 1}`
        const fontSize = 12
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize)
        
        let x = width / 2 - textWidth / 2
        let y = 30
        
        if (position === "bottom-right") {
          x = width - textWidth - 30
        } else if (position === "bottom-left") {
          x = 30
        } else if (position === "top-center") {
          y = height - 30
        } else if (position === "top-right") {
          x = width - textWidth - 30
          y = height - 30
        } else if (position === "top-left") {
          x = 30
          y = height - 30
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        })
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `numbered-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Processing failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Add Page Numbers"
      description="Add Page Numbers"
      icon={<Hash className="w-6 h-6 text-teal-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Add Numbers & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Position</label>
          <select 
            value={position} 
            onChange={e => setPosition(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-3 text-sm dark:bg-slate-700 dark:text-white"
          >
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>

        {isDone && <div className="flex items-center space-x-2 text-emerald-600"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Done! File downloaded.</span></div>}</>}
    />
  )
}
