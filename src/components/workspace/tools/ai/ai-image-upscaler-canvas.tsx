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
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
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
        <Maximize className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">No image selected</p>
        <p className="text-sm">Click here to upload an image to upscale.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
        <div className="flex-1 bg-slate-200 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner relative pattern-grid-lg">
          
          <div className="w-full h-full flex items-center justify-center p-4">
             {resultImage ? (
               <img src={resultImage} alt="Upscaled" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl" />
             ) : (
               <img ref={imageRef} alt="Original" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl opacity-50 blur-[2px]" />
             )}
          </div>
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 flex-col gap-4">
               <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
               <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-white font-bold">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Maximize className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Upscaler</h2>
            <p className="text-sm text-slate-500">Enhance and enlarge your images without losing quality.</p>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-4 rounded-xl text-sm font-medium border border-indigo-200 dark:border-indigo-800/30 mb-8">
          This uses your device's GPU to process the image. It may take a few moments depending on your device's power.
        </div>

        <div className="mt-auto pt-6 space-y-4">
          {!isDone ? (
             <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
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
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Download Result</span>
             </a>
          )}
        </div>
      </div>
    </div>
  )
}
