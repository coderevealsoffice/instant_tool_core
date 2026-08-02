"use client"

import { useState, useRef } from "react"
import { ImageIcon, Download, Loader2, Sparkles, UploadCloud, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ImageBackgroundRemoverCanvas() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.")
      return
    }
    const url = URL.createObjectURL(file)
    setOriginalImage(url)
    setOriginalFile(file)
    setProcessedImage(null)
  }

  const handleRemoveBackground = async () => {
    if (!originalFile) return
    setIsProcessing(true)
    setProgressText("Initializing AI model (this may take a moment on first run)...")

    try {
      // Configuration for imgly
      const config = {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
            setProgressText(`Downloading AI Model... ${Math.round((current / total) * 100)}%`)
          } else {
            setProgressText("Processing image...")
          }
        }
      }

      const imgly = await import("@imgly/background-removal")
      let removeBgFn: any;
      if (typeof imgly === "function") {
        removeBgFn = imgly;
      } else if (imgly.default && typeof imgly.default === "function") {
        removeBgFn = imgly.default;
      } else if (imgly.default && typeof imgly.default.removeBackground === "function") {
        removeBgFn = imgly.default.removeBackground;
      } else if (typeof (imgly as any).removeBackground === "function") {
        removeBgFn = (imgly as any).removeBackground;
      } else {
        throw new Error("Could not find removeBackground function in imported module. Module keys: " + Object.keys(imgly).join(", "));
      }

      const blob = await removeBgFn(originalFile, config)
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)
      toast.success("Background removed successfully!")
    } catch (error) {
      console.error("Error removing background:", error)
      toast.error("Failed to remove background: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsProcessing(false)
      setProgressText("")
    }
  }

  const handleDownload = () => {
    if (!processedImage) return
    const link = document.createElement("a")
    link.href = processedImage
    link.download = `removed-bg-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Uploader Section */}
      {!originalImage && (
        <div 
          className={`relative rounded-3xl border-4 border-dashed transition-all p-12 text-center bg-white dark:bg-slate-900 ${isDragging ? "border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20" : "border-slate-200 dark:border-slate-800 hover:border-fuchsia-300"}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { 
            e.preventDefault(); 
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
          }}
        >
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-20 h-20 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-10 h-10 text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Remove Image Background</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload any image to automatically remove its background using our free on-device AI.</p>
          <Button 
            size="lg" 
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full px-8 h-14 font-bold shadow-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Image
          </Button>
        </div>
      )}

      {/* Editor Section */}
      {originalImage && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Original Image
                </h4>
                <Button variant="outline" size="sm" onClick={() => { setOriginalImage(null); setProcessedImage(null); setOriginalFile(null); }}>
                  Change
                </Button>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video flex items-center justify-center">
                <img src={originalImage} className="max-w-full max-h-[300px] object-contain" alt="Original" />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center mt-10">
              <ArrowRightLeft className="w-6 h-6 text-slate-300" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fuchsia-500" /> Result
                </h4>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgLz4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIiAvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2VlZSIgLz4KPC9zdmc+')] aspect-video flex items-center justify-center">
                {processedImage ? (
                  <img src={processedImage} className="max-w-full max-h-[300px] object-contain" alt="Processed" />
                ) : isProcessing ? (
                  <div className="text-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-fuchsia-100 dark:border-fuchsia-900/30 shadow-lg">
                    <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500 mx-auto mb-4" />
                    <p className="font-semibold text-fuchsia-700 dark:text-fuchsia-400">{progressText}</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto">This happens completely in your browser.</p>
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <p>Click process to remove background</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            {!processedImage ? (
              <Button 
                size="lg" 
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold rounded-full px-12 h-14 shadow-lg hover:shadow-xl transition-all w-full md:w-auto text-lg"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Remove Background</>
                )}
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={handleDownload}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-full px-12 h-14 shadow-xl hover:shadow-2xl transition-all w-full md:w-auto text-lg"
              >
                <Download className="w-5 h-5 mr-2" /> Download Transparent PNG
              </Button>
            )}
          </div>
          
        </div>
      )}
    </div>
  )
}
