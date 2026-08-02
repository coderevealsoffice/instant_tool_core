"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Crop, Download, Loader2, Play, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import smartcrop from "smartcrop"

export function AiSmartCropCanvas() {
  const { files } = useWorkspaceStore()
  const activeFile = files?.[0]?.file ?? null
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1")
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  // Draw original image initially
  useEffect(() => {
    if (!activeFile || !canvasRef.current || !imageRef.current) return
    
    const url = URL.createObjectURL(activeFile)
    
    imageRef.current.onload = () => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      canvas.width = imageRef.current!.naturalWidth
      canvas.height = imageRef.current!.naturalHeight
      ctx.drawImage(imageRef.current!, 0, 0)
      setIsDone(false)
    }
    
    imageRef.current.src = url
    
    return () => URL.revokeObjectURL(url)
  }, [activeFile])

  const handleProcess = async () => {
    if (!activeFile || !canvasRef.current || !imageRef.current) return
    
    setIsProcessing(true)
    setIsDone(false)
    
    try {
      const img = imageRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error("Could not get canvas context")
      
      // Calculate target width/height based on aspect ratio
      const origW = img.naturalWidth
      const origH = img.naturalHeight
      
      let targetW = origW
      let targetH = origH
      
      if (aspectRatio === "1:1") {
        targetW = Math.min(origW, origH)
        targetH = targetW
      } else if (aspectRatio === "16:9") {
        if (origW / 16 > origH / 9) {
          targetH = origH
          targetW = (origH / 9) * 16
        } else {
          targetW = origW
          targetH = (origW / 16) * 9
        }
      } else if (aspectRatio === "9:16") {
        if (origW / 9 > origH / 16) {
          targetH = origH
          targetW = (origH / 16) * 9
        } else {
          targetW = origW
          targetH = (origW / 9) * 16
        }
      }
      
      // Run smartcrop
      const result = await smartcrop.crop(img, { width: targetW, height: targetH })
      const topCrop = result.topCrop
      
      // Draw the cropped area to the canvas
      canvas.width = topCrop.width
      canvas.height = topCrop.height
      ctx.drawImage(
        img,
        topCrop.x, topCrop.y, topCrop.width, topCrop.height,
        0, 0, topCrop.width, topCrop.height
      )
      
      setIsDone(true)
      toast.success("Image cropped successfully using AI!")
      
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to process image")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL(activeFile?.type || "image/jpeg", 0.95)
    const a = document.createElement("a")
    a.href = url
    a.download = `smartcrop-${activeFile?.name || "image.jpg"}`
    a.click()
  }

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('smart-crop-upload')?.click()}
      >
        <input 
          id="smart-crop-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) useWorkspaceStore.getState().addFiles([file])
          }}
        />
        <Crop className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">No image selected</p>
        <p className="text-sm">Click here to upload an image for Smart Cropping.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
        <div className="flex-1 bg-slate-200 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner relative pattern-grid-lg">
          
          <img ref={imageRef} alt="Original" className="hidden" />
          
          <div className="w-full h-full flex items-center justify-center p-4">
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
             />
          </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Crop className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Smart Crop</h2>
            <p className="text-sm text-slate-500">Automatically find the most interesting part of the image.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
             <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
               <LayoutGrid className="w-4 h-4 text-orange-500" /> Target Aspect Ratio
             </h3>
             <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAspectRatio("1:1")}
                  className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === "1:1" ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                  <span className="text-xs">1:1 Square</span>
                </button>
                <button
                  onClick={() => setAspectRatio("16:9")}
                  className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === "16:9" ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <div className="w-8 h-5 border-2 border-current rounded-sm"></div>
                  <span className="text-xs">16:9 Video</span>
                </button>
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === "9:16" ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <div className="w-5 h-8 border-2 border-current rounded-sm"></div>
                  <span className="text-xs">9:16 Story</span>
                </button>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-6 space-y-4">
          {!isDone ? (
             <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Smart Crop Image</span>
                  </>
                )}
             </button>
          ) : (
             <button
                onClick={handleDownload}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Download Cropped Image</span>
             </button>
          )}
        </div>
      </div>
    </div>
  )
}
