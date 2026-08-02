"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Code, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { toast } from "sonner"

export function PdfToHtmlCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Code className="w-12 h-12 mb-4 opacity-50" />
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

      const totalPages = pdfDoc.numPages
      let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${activeFile.name}</title>
  <style>
    body { font-family: sans-serif; background: #f0f0f0; margin: 0; padding: 20px; }
    .page { background: white; margin: 0 auto 20px auto; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; }
    p { margin-bottom: 1em; line-height: 1.5; }
  </style>
</head>
<body>
      `

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        
        let pageHtml = `<div class="page" id="page-${i}">\n`
        
        // Group by Y to form paragraphs/lines
        const rows: { [y: number]: string[] } = {}
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5] / 10) * 10
          if (!rows[y]) rows[y] = []
          rows[y].push(item.str)
        })

        const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a)
        
        for (const y of sortedY) {
          pageHtml += `  <p>${rows[y].join(" ")}</p>\n`
        }
        
        pageHtml += `</div>\n`
        htmlContent += pageHtml
        
        setProgress(Math.round((i / totalPages) * 100))
      }

      htmlContent += `</body>\n</html>`

      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.html`
      a.click()
      URL.revokeObjectURL(url)
      
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
      title="PDF to HTML"
      description="Extracts text from your PDF and generates a clean, responsive HTML document."
      icon={<Code className="w-6 h-6 text-orange-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert to HTML & Download"
      resultUrl={undefined}
      
    />
  )
}
