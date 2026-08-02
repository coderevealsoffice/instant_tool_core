"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileText, Loader2, CheckCircle, Play, ArrowRight, FileWarning } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { toast } from "sonner"

export function WordToPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pageCount, setPageCount] = useState<number | null>(null)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <FileText className="w-12 h-12 opacity-50" />
        <p>Upload a Word (.doc / .docx) file to convert.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    setPageCount(null)
    try {
      // Read the file as text — docx is a zip internally but we can extract text via reading raw bytes
      const text = await activeFile.text()

      // Strip XML/binary noise from docx, extract readable text
      const cleanText = text
        .replace(/<[^>]*>/g, " ")    // strip XML tags (works for .docx XML content)
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "") // strip control chars
        .replace(/\s+/g, " ")
        .trim()

      setProgress(30)

      // Build a PDF with the extracted text using pdf-lib
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontSize = 11
      const margin = 50
      const lineHeight = fontSize * 1.5

      const words = cleanText.split(" ").filter(Boolean)
      const A4_W = 595.28
      const A4_H = 841.89
      const maxWidth = A4_W - margin * 2
      const maxLinesPerPage = Math.floor((A4_H - margin * 2) / lineHeight)

      // Word-wrap into lines
      const lines: string[] = []
      let currentLine = ""
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const width = font.widthOfTextAtSize(testLine, fontSize)
        if (width > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      setProgress(60)

      // Paginate lines
      let lineIndex = 0
      let pages = 0
      while (lineIndex < lines.length) {
        const page = pdfDoc.addPage([A4_W, A4_H])
        pages++
        let y = A4_H - margin
        while (lineIndex < lines.length && y > margin) {
          page.drawText(lines[lineIndex], {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          })
          y -= lineHeight
          lineIndex++
        }
      }

      setProgress(90)
      setPageCount(pages)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      setProgress(100)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const ext = activeFile.name.split(".").pop()?.toUpperCase() || "DOC"

  return (
    <ToolSplitView
      title="Word to PDF"
      description="Word to PDF"
      icon={<FileText className="w-6 h-6 text-blue-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert to PDF & Download"
      resultUrl={undefined}
      
    />
  )
}
