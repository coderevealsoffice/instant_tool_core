"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Table } from "lucide-react"
import { toast } from "sonner"
import { ToolSplitView } from "../canvases/tool-split-view"

export function PdfToExcelCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFilename, setResultFilename] = useState<string>("")

  const activeFile = files?.[0]?.file ?? null

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

      const arrayBuffer = await activeFile!.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
      const pdfDoc = await loadingTask.promise

      const totalPages = pdfDoc.numPages
      let csvContent = ""

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        
        // Attempt to parse tabular data by grouping items with similar Y coordinates
        const rows: { [y: number]: any[] } = {}
        
        textContent.items.forEach((item: any) => {
          // Round Y coordinate to group text roughly on the same line
          const y = Math.round(item.transform[5] / 5) * 5
          if (!rows[y]) rows[y] = []
          rows[y].push(item)
        })

        // Sort rows top to bottom (highest Y in PDF is top)
        const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a)
        
        for (const y of sortedY) {
          // Sort items left to right
          rows[y].sort((a, b) => a.transform[4] - b.transform[4])
          const lineStr = rows[y].map(item => `"${item.str.replace(/"/g, '""')}"`).join(",")
          csvContent += lineStr + "\n"
        }
        
        setProgress(Math.round((i / totalPages) * 100))
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      
      const baseName = activeFile!.name.replace(/\.[^/.]+$/, "")
      setResultUrl(url)
      setResultFilename(`${baseName}.csv`)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to extract text from PDF. Ensure it's not a scanned image PDF.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="PDF to Excel"
      description="Extracts tabular text data and structure from your PDF and saves it as a CSV file, which opens natively in Microsoft Excel."
      icon={<Table className="w-6 h-6" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert to Excel (CSV)"
      resultUrl={resultUrl || undefined}
      resultFilename={resultFilename}
    />
  )
}

