"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { ToolSplitView } from "../canvases/tool-split-view"

export function PdfToWordCanvas() {
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
      let extractedText = ""

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        
        // Basic text extraction
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        extractedText += pageText + "\n\n"
        setProgress(Math.round((i / totalPages) * 100))
      }

      // Create a basic Word document structure using HTML
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Export HTML To Doc</title></head>
        <body>
          <div style="white-space: pre-wrap; font-family: Calibri, sans-serif;">${extractedText.replace(/\n/g, "<br>")}</div>
        </body>
        </html>
      `

      const blob = new Blob([wordHtml as any], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      
      const baseName = activeFile!.name.replace(/\.[^/.]+$/, "")
      setResultUrl(url)
      setResultFilename(`${baseName}.doc`)
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
      title="PDF to Word"
      description="Extracts text content from your PDF and saves it as an editable Microsoft Word document (.doc). Note: Scanned images will not be extracted without OCR."
      icon={<FileText className="w-6 h-6" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert to Word"
      resultUrl={resultUrl || undefined}
      resultFilename={resultFilename}
    />
  )
}

