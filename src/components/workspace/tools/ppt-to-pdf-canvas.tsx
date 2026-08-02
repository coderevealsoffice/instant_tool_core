"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Presentation, Loader2, CheckCircle, Play, ArrowRight, FileWarning, Layers } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { toast } from "sonner"

export function PptToPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [slideCount, setSlideCount] = useState<number | null>(null)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Presentation className="w-12 h-12 opacity-50" />
        <p>Upload a PowerPoint (.ppt / .pptx) file to convert.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    setSlideCount(null)
    try {
      const text = await activeFile.text()
      setProgress(20)

      // Extract slide titles and content from pptx XML
      // pptx slides are in ppt/slides/slide*.xml
      // We can extract text between <a:t>...</a:t> tags
      const slideBlocks: string[][] = []

      // Split into slide-like sections (rough heuristic using sld tags or large text blocks)
      const slideMatches = text.match(/<p:sp[^>]*>[\s\S]*?<\/p:sp>/g) || []

      const tempTexts: string[] = []
      for (const block of slideMatches) {
        const texts = block.match(/<a:t[^>]*>(.*?)<\/a:t>/g)
        if (texts) {
          const clean = texts.map(t => t.replace(/<[^>]*>/g, "").trim()).filter(Boolean)
          if (clean.length > 0) tempTexts.push(...clean)
        }
      }

      // If no PPTX XML found, fall back to raw text extraction
      if (tempTexts.length === 0) {
        const rawText = text.replace(/<[^>]*>/g, " ").replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "").replace(/\s+/g, " ").trim()
        tempTexts.push(...rawText.split(".").map(s => s.trim()).filter(s => s.length > 5))
      }

      // Group into slides of ~6 text items each
      const chunkSize = 6
      for (let i = 0; i < tempTexts.length; i += chunkSize) {
        slideBlocks.push(tempTexts.slice(i, i + chunkSize))
      }

      if (slideBlocks.length === 0) throw new Error("Could not extract content from the file.")

      setProgress(40)

      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const SLIDE_W = 841.89  // Landscape A4
      const SLIDE_H = 595.28

      const slideColors = [
        { bg: rgb(0.12, 0.29, 0.69), text: rgb(1, 1, 1) },
        { bg: rgb(0.86, 0.38, 0.13), text: rgb(1, 1, 1) },
        { bg: rgb(0.08, 0.50, 0.35), text: rgb(1, 1, 1) },
        { bg: rgb(0.38, 0.13, 0.56), text: rgb(1, 1, 1) },
      ]

      for (let s = 0; s < slideBlocks.length; s++) {
        const page = pdfDoc.addPage([SLIDE_W, SLIDE_H])
        const scheme = slideColors[s % slideColors.length]
        const slide = slideBlocks[s]

        // Background
        page.drawRectangle({ x: 0, y: 0, width: SLIDE_W, height: SLIDE_H, color: scheme.bg })
        // Left accent bar
        page.drawRectangle({ x: 0, y: 0, width: 8, height: SLIDE_H, color: rgb(1, 1, 1) })

        // Slide number chip
        page.drawText(`${s + 1} / ${slideBlocks.length}`, { x: SLIDE_W - 60, y: 12, size: 9, font, color: rgb(1, 1, 1), opacity: 0.5 })

        // Title (first item)
        const title = slide[0] || `Slide ${s + 1}`
        page.drawText(title.substring(0, 60), { x: 50, y: SLIDE_H - 90, size: 28, font: boldFont, color: scheme.text })

        // Divider line
        page.drawLine({ start: { x: 50, y: SLIDE_H - 105 }, end: { x: SLIDE_W - 50, y: SLIDE_H - 105 }, thickness: 1.5, color: rgb(1, 1, 1), opacity: 0.4 })

        // Content bullets
        const bullets = slide.slice(1)
        for (let b = 0; b < bullets.length; b++) {
          const bulletY = SLIDE_H - 145 - b * 60
          if (bulletY < 60) break
          page.drawText("•", { x: 55, y: bulletY, size: 14, font: boldFont, color: rgb(1, 1, 1), opacity: 0.8 })
          page.drawText(bullets[b].substring(0, 80), { x: 75, y: bulletY, size: 13, font, color: scheme.text })
        }

        setProgress(40 + Math.round(((s + 1) / slideBlocks.length) * 55))
      }

      setSlideCount(slideBlocks.length)
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${activeFile.name.replace(/\.[^/.]+$/, "")}.pdf`
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

  const ext = activeFile.name.split(".").pop()?.toUpperCase() || "PPTX"

  return (
    <ToolSplitView
      title="PPT to PDF"
      description="PPT to PDF"
      icon={<Presentation className="w-6 h-6 text-orange-500" />}
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
