"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Maximize, Download, Loader2, Play } from "lucide-react"
import { toast } from "sonner"
import Upscaler from "upscaler"

export function AiImageUpscalerCanvas() {
  const { files } = useWorkspaceStore()
  const activeFile = files?.[0]?.file ?? null
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [scale, setScale] = useState<2 | 4>(2)
  const [progress, setProgress] = useState(0)
  const [resultImage, setResultImage] = useState<string | null>(null)
  
  const imageRef = useRef<HTMLImageElement>(null)
  const upscalerRef = useRef<any>(null)
  
  // Initialize upscaler
  useEffect(() => {
    upscalerRef.current = new Upscaler()
    return () => {
      // cleanup if possible
    }
  }, [])

  // Show original image
  useEffect(() => {
    if (!activeFile || !imageRef.current) return
    
    const url = URL.createObjectURL(activeFile)
    imageRef.current.src = url
    setResultImage(null)
    setIsDone(false)
    setProgress(0)
    
    return () => URL.revokeObjectURL(url)
  }, [activeFile])

  const handleProcess = async () => {
    if (!activeFile || !imageRef.current || !upscalerRef.current) return
    
    setIsProcessing(true)
    setIsDone(false)
    setProgress(0)
    
    try {
      const img = imageRef.current
      
      // UpscalerJS process
      const upscaledImageSrc = await upscalerRef.current.upscale(img, {
        patchSize: 64,
        padding: 2,
        progress: (percent: number) => {
          setProgress(Math.round(percent * 100))
        }
      })
      
      setResultImage(upscaledImageSrc)
      setIsDone(true)
      toast.success("Image upscaled successfully!")
      
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to process image")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!activeFile) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-[440px] w-full text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
        onClick={() => document.getElementById('upscale-upload')?.click()}
      >
        <input 
          id="upscale-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) useWorkspaceStore.getState().addFiles([file])
          }}
        />
        <div className="w-14 h-14 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center mb-4 border border-black/10 shadow-sm">
          <Maximize className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No image selected</p>
        <p className="text-xs text-slate-500 font-medium">Click to select an image from your device to upscale 4x.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-[380px] bg-white dark:bg-slate-900">
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xs relative">
          
          <div className="w-full h-full flex items-center justify-center p-4">
             {resultImage ? (
               <img src={resultImage} alt="Upscaled" className="max-w-full max-h-[460px] object-contain drop-shadow-md rounded-xl" />
             ) : (
               <img ref={imageRef} alt="Original" className="max-w-full max-h-[460px] object-contain drop-shadow-md rounded-xl opacity-60 blur-[1px]" />
             )}
          </div>
          
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10 flex-col gap-4">
               <Loader2 className="w-8 h-8 animate-spin text-[#D7FB8E]" />
               <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-[#D7FB8E] transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-white text-xs font-bold uppercase tracking-wider">{progress}% Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Maximize className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">AI Upscaler</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Neural Super-Resolution</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-4 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-slate-800 mb-6 shadow-2xs leading-relaxed">
            Uses your device's WebGL neural pipeline to enhance detail and enlarge pixel density without sending private image data to remote servers.
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
                    <span>Processing Neural Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Upscale Image</span>
                  </>
                )}
             </button>
          ) : (
             <a
                href={resultImage!}
                download={`upscaled-${activeFile?.name || "image.jpg"}`}
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Upscaled Image</span>
             </a>
          )}
        </div>
      </div>
    </div>
  )
}
