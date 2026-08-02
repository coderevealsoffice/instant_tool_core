"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ImageIcon, ArrowRight, Loader2, CheckCircle, Play, Download } from "lucide-react"
import { toast } from "sonner"

type OutputFormat = "webp" | "png" | "jpeg" | "gif" | "avif" | "bmp"

const FORMATS: { id: OutputFormat; label: string; desc: string }[] = [
  { id: "webp", label: "WebP", desc: "Best for web" },
  { id: "png",  label: "PNG",  desc: "Lossless" },
  { id: "jpeg", label: "JPEG", desc: "Photos" },
]

export function ImageConvertCanvas() {
  const { files } = useWorkspaceStore()
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("webp")
  const [quality, setQuality] = useState(90)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activeFile = files?.[0]?.file ?? null
  const inputExt = activeFile?.name.split(".").pop()?.toLowerCase() || "unknown"

  // Show input preview
  useEffect(() => {
    if (!activeFile) return
    const url = URL.createObjectURL(activeFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [activeFile])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <ImageIcon className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload an image file to convert it.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setIsDone(false)
    setOutputSize(null)
    try {
      const img = new Image()
      const objectUrl = URL.createObjectURL(activeFile)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = objectUrl
      })

      const canvas = canvasRef.current!
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fill white background for JPEG (no transparency)
      if (targetFormat === "jpeg" || targetFormat === "bmp") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(objectUrl)

      const mimeType = targetFormat === "jpeg" ? "image/jpeg"
        : targetFormat === "png" ? "image/png"
        : targetFormat === "webp" ? "image/webp"
        : targetFormat === "avif" ? "image/avif"
        : targetFormat === "gif" ? "image/gif"
        : "image/bmp"

      // Canvas toBlob with quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error("Conversion failed")),
          mimeType,
          ["jpeg", "webp", "avif"].includes(targetFormat) ? quality / 100 : undefined
        )
      })

      setOutputSize(blob.size)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.${targetFormat}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatSize = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`
  const hasQuality = ["jpeg", "webp"].includes(targetFormat)

  return (
    <div className="flex h-full gap-4">
      {/* Left: Preview */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[repeating-conic-gradient(#f8f8f8_0%_25%,white_0%_50%)] bg-[length:20px_20px] dark:bg-slate-900 rounded-xl p-4 overflow-auto border border-slate-200 dark:border-slate-700">
        {previewUrl ? (
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-2 font-medium">Original Preview</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl" />
            <p className="text-xs text-slate-400 mt-2">{activeFile.name} • {formatSize(activeFile.size)}</p>
          </div>
        ) : (
          <div className="text-slate-400 text-sm">Upload an image to see preview</div>
        )}
        {/* hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Right: Settings */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-500" /> Image Converter
          </h3>

          {/* Format indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase px-3 py-1.5 rounded-lg">{inputExt}</span>
            <ArrowRight className="w-4 h-4 text-pink-400" />
            <span className="bg-pink-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-lg">{targetFormat}</span>
          </div>

          {/* Format grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Output Format</label>
            <div className="grid grid-cols-3 gap-1.5">
              {FORMATS.map(fmt => (
                <button key={fmt.id} onClick={() => setTargetFormat(fmt.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg border-2 transition text-center ${
                    targetFormat === fmt.id
                      ? "border-pink-600 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                      : "border-transparent bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                  }`}>
                  <span className="font-bold text-xs">{fmt.label}</span>
                  <span className="text-[10px] opacity-70 leading-tight">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality (lossy only) */}
          {hasQuality && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Quality: <span className="text-pink-600 font-bold">{quality}%</span>
              </label>
              <input type="range" min={10} max={100} step={5} value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-pink-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Smaller file</span><span>Best quality</span>
              </div>
            </div>
          )}

          {/* Stats after done */}
          {isDone && outputSize !== null && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Original:</span><span className="font-medium">{formatSize(activeFile.size)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>Converted:</span><span className="font-bold">{formatSize(outputSize)}</span>
              </div>
              {outputSize < activeFile.size && (
                <div className="text-center font-semibold text-emerald-600">
                  ↓ {Math.round((1 - outputSize / activeFile.size) * 100)}% smaller
                </div>
              )}
            </div>
          )}

          {isDone && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" /> Converted!
            </div>
          )}

          <button onClick={handleProcess} disabled={isProcessing}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isProcessing ? "Converting..." : `Convert to ${targetFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
