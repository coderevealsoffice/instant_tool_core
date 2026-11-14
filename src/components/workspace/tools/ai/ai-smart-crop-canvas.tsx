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
      <div 
        className="flex flex-col items-center justify-center min-h-[440px] w-full text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
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
        <div className="w-14 h-14 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center mb-4 border border-black/10 shadow-sm">
          <Crop className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No image selected</p>
        <p className="text-xs text-slate-500 font-medium">Click to select an image for AI content-aware smart cropping.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-[380px] bg-white dark:bg-slate-900">
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xs relative">
          
          <img ref={imageRef} alt="Original" className="hidden" />
          
          <div className="w-full h-full flex items-center justify-center p-4">
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-[460px] object-contain drop-shadow-md rounded-xl"
             />
          </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Crop className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">AI Smart Crop</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content-Aware Framing</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <LayoutGrid className="w-4 h-4 text-slate-500" /> Target Aspect Ratio
                 </h3>
               </div>
               <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setAspectRatio("1:1")}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      aspectRatio === "1:1" 
                        ? "border-black/20 bg-[#D7FB8E] text-slate-950 font-bold shadow-2xs" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-5 h-5 border-2 border-current rounded-xs"></div>
                    <span className="text-[11px] font-semibold">1:1 Square</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio("16:9")}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      aspectRatio === "16:9" 
                        ? "border-black/20 bg-[#D7FB8E] text-slate-950 font-bold shadow-2xs" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-7 h-4 border-2 border-current rounded-xs"></div>
                    <span className="text-[11px] font-semibold">16:9 Video</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio("9:16")}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      aspectRatio === "9:16" 
                        ? "border-black/20 bg-[#D7FB8E] text-slate-950 font-bold shadow-2xs" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-4 h-7 border-2 border-current rounded-xs"></div>
                    <span className="text-[11px] font-semibold">9:16 Story</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 space-y-3">
          {!isDone ? (
             <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Saliency...</span>
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
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
