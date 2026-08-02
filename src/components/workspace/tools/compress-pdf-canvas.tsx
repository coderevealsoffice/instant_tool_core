"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Minimize, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument } from "pdf-lib"

export function CompressPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [level, setLevel] = useState("recommended")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFilename, setResultFilename] = useState<string>("")

  const activeFile = files?.[0]?.file ?? null

  const handleProcess = async () => {
    if (!activeFile) return
    setIsProcessing(true)
    setIsDone(false)
    setStats(null)
    setResultUrl(null)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

      // Apply compression based on selected level
      // pdf-lib compresses by stripping unused objects and optionally using object streams
      const useObjectStreams = level !== "extreme" // object streams can actually reduce size in most cases
      const addDefaultPage = false

      const pdfBytes = await pdfDoc.save({
        useObjectStreams,
        addDefaultPage,
        // For "extreme" level we remove all metadata
        ...(level === "extreme" ? {
          updateFieldAppearances: false,
        } : {})
      })

      // Remove metadata for extreme compression
      if (level === "extreme") {
        pdfDoc.setTitle("")
        pdfDoc.setAuthor("")
        pdfDoc.setSubject("")
        pdfDoc.setKeywords([])
        pdfDoc.setCreator("")
        pdfDoc.setProducer("")
      }

      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")

      setResultUrl(url)
      setResultFilename(`${baseName}-compressed.pdf`)
      setStats({ before: activeFile.size, after: blob.size })
      setIsDone(true)
      toast.success("PDF compressed successfully!")
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || "Failed to compress PDF.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const savings = stats ? Math.max(0, Math.round(((stats.before - stats.after) / stats.before) * 100)) : 0

  const customSettings = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">PDF File</label>
        <div className="flex justify-between items-center text-sm text-slate-500 bg-white dark:bg-slate-700 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600">
          <span className="truncate flex-1">{activeFile?.name}</span>
          <span className="font-semibold text-slate-400 ml-2">{activeFile ? formatSize(activeFile.size) : ""}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Compression Level</label>
        <div className="space-y-2">
          {[
            { value: "less", label: "Less Compression", desc: "High quality, minimal size reduction" },
            { value: "recommended", label: "Recommended", desc: "Balanced quality & size" },
            { value: "extreme", label: "Extreme Compression", desc: "Maximum size reduction, lower quality" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setLevel(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${level === opt.value ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-rose-400 bg-white dark:bg-slate-800"}`}
            >
              <div className="font-semibold">{opt.label}</div>
              <div className={`text-xs mt-0.5 ${level === opt.value ? "text-white/80" : "text-slate-400"}`}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {isDone && stats && (
        <div className="flex flex-col items-center space-y-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">Compressed Successfully!</span>
          </div>
          <div className="text-sm font-medium">
            {formatSize(stats.before)} → {formatSize(stats.after)}
            {savings > 0 && <span className="ml-2 font-bold text-emerald-700">({savings}% smaller)</span>}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <ToolSplitView
      title="Compress PDF"
      description="Reduce PDF file size while preserving quality. 100% client-side — your file never leaves your device."
      icon={<Minimize className="w-6 h-6 text-rose-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Compress PDF"
      resultUrl={resultUrl || undefined}
      resultFilename={resultFilename}
      customSettings={customSettings}
    />
  )
}
