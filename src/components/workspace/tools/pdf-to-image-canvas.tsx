"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { ToolSplitView } from "../canvases/tool-split-view"

let pdfjsLib: any = null

export function PdfToImageCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState<"png" | "jpg">("png")
  const [quality, setQuality] = useState(2) // scale factor for rendering
  const [previewImages, setPreviewImages] = useState<{ url: string; page: number }[]>([])
  const [currentPreview, setCurrentPreview] = useState(0)

  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFilename, setResultFilename] = useState<string>("")

  const activeFile = files?.[0]?.file ?? null

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    setPreviewImages([])
    setResultUrl(null)
    try {
      if (!pdfjsLib) {
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        pdfjsLib = pdfjs
      }

      const arrayBuffer = await activeFile!.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
      const totalPages = pdfDoc.numPages

      const previews: { url: string; page: number }[] = []
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png"
      const ext = format

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale: quality })

        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")!

        await page.render({ canvasContext: ctx, viewport }).promise

        const dataUrl = canvas.toDataURL(mimeType, 0.92)
        previews.push({ url: dataUrl, page: i })

        // Convert data URL to blob for ZIP
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        zip.file(`page-${String(i).padStart(3, "0")}.${ext}`, blob)

        setProgress(Math.round((i / totalPages) * 100))
      }

      setPreviewImages(previews)
      setCurrentPreview(0)

      // If single page - direct download, else ZIP
      if (totalPages === 1) {
        setResultUrl(previews[0].url)
        setResultFilename(`${activeFile!.name.replace(".pdf", "")}-page-1.${ext}`)
      } else {
        const zipBlob = await zip.generateAsync({ type: "blob" })
        const url = URL.createObjectURL(zipBlob)
        setResultUrl(url)
        setResultFilename(`${activeFile!.name.replace(".pdf", "")}-images.zip`)
      }

      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Failed to convert PDF: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Output Format</label>
        <div className="flex gap-2">
          {(["png", "jpg"] as const).map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${format === f ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
          Quality / Scale ({quality}x)
        </label>
        <input type="range" min={1} max={4} step={0.5} value={quality}
          onChange={e => setQuality(Number(e.target.value))}
          className="w-full accent-red-600" />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Draft</span><span>High</span>
        </div>
      </div>
    </div>
  )

  const customResultPreview = previewImages.length > 0 ? (
    <div className="flex flex-col h-full w-full p-4 relative">
      <div className="flex items-center gap-3 mb-4 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700 w-full justify-between sticky top-0 z-20">
        <button onClick={() => setCurrentPreview(p => Math.max(0, p - 1))} disabled={currentPreview === 0}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Page {currentPreview + 1} of {previewImages.length}
        </span>
        <button onClick={() => setCurrentPreview(p => Math.min(previewImages.length - 1, p + 1))} disabled={currentPreview === previewImages.length - 1}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewImages[currentPreview].url} alt={`Page ${currentPreview + 1}`}
          className="rounded-lg shadow-xl max-h-full max-w-full object-contain" />
      </div>
    </div>
  ) : undefined

  return (
    <ToolSplitView
      title="PDF to Image"
      description="Convert every page of your PDF into high-quality JPG or PNG images. Optionally download as a ZIP archive."
      icon={<ImageIcon className="w-6 h-6 text-red-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert All Pages"
      resultUrl={resultUrl || undefined}
      resultFilename={resultFilename}
      customSettings={customSettings}
      customResultPreview={customResultPreview}
    />
  )
}

