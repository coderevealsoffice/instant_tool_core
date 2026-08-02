"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Table, Loader2, CheckCircle, Play, ArrowRight, FileWarning } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { toast } from "sonner"

export function ExcelToPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState<{ rows: number; pages: number } | null>(null)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Table className="w-12 h-12 opacity-50" />
        <p>Upload an Excel (.xls / .xlsx) file to convert.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    setStats(null)
    try {
      // Read the Excel file as text and extract CSV-like structure
      const text = await activeFile.text()
      setProgress(20)

      // Strip XML/binary noise, try to extract tab/comma separated values
      const rows: string[][] = []
      const lines = text
        .replace(/<[^>]*>/g, "\t")    // xml tags → tabs
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        .split(/\n|\r/)
        .map(l => l.trim())
        .filter(Boolean)

      for (const line of lines) {
        const cells = line.split(/\t|,/).map(c => c.trim()).filter(Boolean)
        if (cells.length > 0 && cells.some(c => c.length > 0)) {
          rows.push(cells)
        }
      }

      setProgress(40)

      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const A4_W = 841.89  // Landscape A4
      const A4_H = 595.28
      const margin = 40
      const colWidth = 120
      const rowHeight = 18
      const headerHeight = 22
      const fontSize = 8
      const headerFontSize = 9
      const rowsPerPage = Math.floor((A4_H - margin * 2 - headerHeight) / rowHeight)

      let pageCount = 0
      let rowIndex = 0
      const headerRow = rows[0] || []
      const dataRows = rows.slice(1)

      while (rowIndex < dataRows.length || pageCount === 0) {
        const page = pdfDoc.addPage([A4_W, A4_H])
        pageCount++

        // Draw header
        let x = margin
        let y = A4_H - margin
        for (let c = 0; c < headerRow.length && x < A4_W - margin; c++) {
          page.drawRectangle({ x, y: y - headerHeight, width: colWidth, height: headerHeight, color: rgb(0.2, 0.4, 0.8) })
          page.drawText(headerRow[c].substring(0, 15), { x: x + 4, y: y - headerHeight + 6, size: headerFontSize, font: boldFont, color: rgb(1, 1, 1) })
          x += colWidth
        }
        y -= headerHeight

        // Draw data rows
        for (let r = 0; r < rowsPerPage && rowIndex < dataRows.length; r++, rowIndex++) {
          x = margin
          const isEven = r % 2 === 0
          for (let c = 0; c < headerRow.length && x < A4_W - margin; c++) {
            if (isEven) {
              page.drawRectangle({ x, y: y - rowHeight, width: colWidth, height: rowHeight, color: rgb(0.96, 0.97, 0.99) })
            }
            const cell = (dataRows[rowIndex]?.[c] || "").substring(0, 18)
            page.drawText(cell, { x: x + 4, y: y - rowHeight + 5, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
            x += colWidth
          }
          y -= rowHeight
        }

        // Page number
        page.drawText(`Page ${pageCount}`, { x: A4_W - margin - 40, y: margin / 2, size: 7, font, color: rgb(0.5, 0.5, 0.5) })

        setProgress(40 + Math.round((rowIndex / Math.max(dataRows.length, 1)) * 50))

        if (rowIndex >= dataRows.length) break
      }

      setStats({ rows: dataRows.length, pages: pageCount })
      setProgress(95)

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

  const ext = activeFile.name.split(".").pop()?.toUpperCase() || "XLSX"

  return (
    <ToolSplitView
      title="Excel to PDF"
      description="Excel to PDF"
      icon={<Table className="w-6 h-6 text-emerald-600" />}
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
