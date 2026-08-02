"use client"

import { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Split, Loader2, CheckCircle, Play, Download, Share2, FileMinus } from "lucide-react"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

export function SplitPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [range, setRange] = useState("1")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    if (activeFile) {
      const url = URL.createObjectURL(activeFile)
      setPdfPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [activeFile])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Split className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a PDF file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    if (!range.trim()) return toast.error("Please specify a page range (e.g. 1-3)")
    setIsProcessing(true)
    setIsDone(false)
    setResultUrl(null)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const srcPdf = await PDFDocument.load(arrayBuffer)
      const totalPages = srcPdf.getPageCount()

      // Parse range. Simple support: "1-3" or "2,4,5"
      const pagesToKeep: number[] = []
      const parts = range.split(",").map(p => p.trim())
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(n => parseInt(n))
          if (start > 0 && end >= start) {
            for (let i = start; i <= end; i++) pagesToKeep.push(i)
          }
        } else {
          const n = parseInt(part)
          if (!isNaN(n) && n > 0) pagesToKeep.push(n)
        }
      }

      const validZeroIndexedPages = pagesToKeep
        .map(n => n - 1)
        .filter(n => n >= 0 && n < totalPages)

      if (validZeroIndexedPages.length === 0) {
        throw new Error("No valid pages selected based on this document.")
      }

      const newPdf = await PDFDocument.create()
      const copiedPages = await newPdf.copyPages(srcPdf, validZeroIndexedPages)
      copiedPages.forEach(p => newPdf.addPage(p))

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      
      setResultUrl(url)
      setIsDone(true)
      toast.success("PDF split successfully!")
    } catch (e: any) {
      console.error(e)
      toast.error(`Splitting failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement("a")
    a.href = resultUrl
    a.download = `split-${activeFile.name}`
    a.click()
  }

  const handleShare = async () => {
    if (!resultUrl) return
    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const file = new File([blob], `split-${activeFile.name}`, { type: "application/pdf" })
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Split PDF",
          text: "Here is the split PDF file.",
        })
      } else {
        toast.error("Sharing is not supported on this browser.")
      }
    } catch (err) {
      console.error("Error sharing:", err)
      toast.error("Could not share the file.")
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shrink-0">
          <Split className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Split PDF
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Extract pages from your PDF file easily.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0">
        
        {/* Left Side: Preview area */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center overflow-hidden relative shadow-inner aspect-[4/3] lg:aspect-auto lg:h-[500px] border border-slate-200 dark:border-slate-800">
           {isDone && resultUrl ? (
             <embed src={resultUrl} type="application/pdf" className="w-full h-full" />
           ) : pdfPreviewUrl ? (
             <embed src={pdfPreviewUrl} type="application/pdf" className="w-full h-full" />
           ) : (
             <div className="flex flex-col items-center justify-center text-slate-400">
               <FileMinus className="w-16 h-16 mb-4 opacity-50" />
               <p>No preview available</p>
             </div>
           )}
           {isDone && (
              <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Result Preview
              </div>
           )}
        </div>

        {/* Right Side: Options & Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Original PDF File</label>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 rounded-lg border border-slate-100 dark:border-slate-600">
              <FileMinus className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate font-medium">{activeFile.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pages to Extract</label>
            <input
              type="text"
              placeholder="e.g. 1-3, 5, 7"
              value={range}
              onChange={e => setRange(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-shadow bg-slate-50"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use commas for individual pages (1, 3, 5) or dashes for ranges (1-5).</p>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            <span>{isProcessing ? "Processing..." : "Extract Pages"}</span>
          </button>

          {isDone && resultUrl && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">Success! Your split PDF is ready.</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-3 rounded-xl text-sm font-bold transition-all border border-indigo-200 dark:border-indigo-800/50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
