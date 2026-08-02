"use client"

import { useState, useCallback } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileImage, Loader2, CheckCircle, Play, Plus, X, GripVertical, ImageIcon } from "lucide-react"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

type ImageEntry = { id: string; file: File; previewUrl: string }

export function ImageToPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [extraImages, setExtraImages] = useState<ImageEntry[]>([])
  const [pageSize, setPageSize] = useState("fit")
  const [orientation, setOrientation] = useState("portrait")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const primaryFile = files?.[0]?.file ?? null

  // Build combined list: primary from store + extras
  const allImages: ImageEntry[] = [
    ...(primaryFile ? [{ id: "primary", file: primaryFile, previewUrl: URL.createObjectURL(primaryFile) }] : []),
    ...extraImages,
  ]

  const addExtra = (f: File) => {
    setExtraImages(prev => [...prev, { id: crypto.randomUUID(), file: f, previewUrl: URL.createObjectURL(f) }])
  }

  const removeExtra = (id: string) => {
    setExtraImages(prev => prev.filter(e => e.id !== id))
  }

  if (!primaryFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <FileImage className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload an image to get started.</p>
      </div>
    )
  }

  const A4_W = 595.28
  const A4_H = 841.89

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const pdfDoc = await PDFDocument.create()

      for (let i = 0; i < allImages.length; i++) {
        const entry = allImages[i]
        const imgBytes = await entry.file.arrayBuffer()

        // Detect type from file mime
        let embeddedImg
        if (entry.file.type === "image/jpeg" || entry.file.type === "image/jpg") {
          embeddedImg = await pdfDoc.embedJpg(imgBytes)
        } else {
          // default to PNG (handles png, webp-as-png, etc.)
          embeddedImg = await pdfDoc.embedPng(imgBytes)
        }

        const { width: imgW, height: imgH } = embeddedImg

        let pageW: number, pageH: number
        if (pageSize === "fit") {
          // Page exactly fits the image
          pageW = imgW
          pageH = imgH
        } else {
          // A4
          if (orientation === "landscape") {
            pageW = A4_H
            pageH = A4_W
          } else {
            pageW = A4_W
            pageH = A4_H
          }
        }

        const page = pdfDoc.addPage([pageW, pageH])

        // Scale image to fill the page while maintaining aspect ratio
        const scale = Math.min(pageW / imgW, pageH / imgH)
        const drawW = imgW * scale
        const drawH = imgH * scale
        const x = (pageW - drawW) / 2
        const y = (pageH - drawH) / 2

        page.drawImage(embeddedImg, { x, y, width: drawW, height: drawH })

        setProgress(Math.round(((i + 1) / allImages.length) * 100))
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `images-to-pdf-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Failed to create PDF: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-full gap-4">
      {/* Left: Image List */}
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            Images ({allImages.length})
          </h3>

          <div className="space-y-2 mb-4">
            {allImages.map((entry, i) => (
              <div key={entry.id}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/60 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.previewUrl} alt={entry.file.name} className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{entry.file.name}</p>
                  <p className="text-xs text-slate-400">{(entry.file.size / 1024).toFixed(0)} KB</p>
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-full shrink-0">
                  P{i + 1}
                </span>
                {entry.id !== "primary" && (
                  <button onClick={() => removeExtra(entry.id)}
                    className="text-slate-400 hover:text-red-500 transition shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
            <Plus className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Add More Images</span>
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={e => Array.from(e.target.files || []).forEach(addExtra)} />
          </label>
        </div>
      </div>

      {/* Right: Settings + Action */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <FileImage className="w-5 h-5 text-purple-500" /> Image to PDF
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Page Size</label>
            <select value={pageSize} onChange={e => setPageSize(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none">
              <option value="fit">Fit to Image</option>
              <option value="a4">A4 Page</option>
            </select>
          </div>

          {pageSize === "a4" && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Orientation</label>
              <div className="flex gap-2">
                {["portrait", "landscape"].map(o => (
                  <button key={o} onClick={() => setOrientation(o)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition ${orientation === o ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500"><span>Building PDF...</span><span>{progress}%</span></div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {isDone && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" /> PDF Downloaded!
            </div>
          )}

          <button onClick={handleProcess} disabled={isProcessing || allImages.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isProcessing ? "Creating PDF..." : "Convert to PDF"}
          </button>
        </div>
      </div>
    </div>
  )
}
