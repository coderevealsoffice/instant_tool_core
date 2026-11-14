"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ScanFace, Download, Loader2, Play, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import * as faceapi from "@vladmandic/face-api"

export function AiFaceBlurCanvas() {
  const { files } = useWorkspaceStore()
  const activeFile = files?.[0]?.file ?? null
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ])
        setModelsLoaded(true)
      } catch (err) {
        console.error("Error loading face-api models:", err)
        toast.error("Failed to load AI models. Please check your connection.")
      }
    }
    loadModels()
  }, [])

  // Draw image on canvas whenever a new file is uploaded
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
    if (!activeFile || !canvasRef.current || !imageRef.current || !modelsLoaded) return
    
    setIsProcessing(true)
    setIsDone(false)
    
    try {
      const img = imageRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error("Could not get canvas context")
      
      // Detect faces
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      
      if (detections.length === 0) {
        toast.info("No faces detected in this image.")
        setIsProcessing(false)
        return
      }

      // Redraw original image to ensure clean state
      ctx.drawImage(img, 0, 0)

      // Apply blur to each detected face bounding box
      detections.forEach(detection => {
        const { x, y, width, height } = detection.box
        
        // Expand bounding box slightly for better coverage
        const padX = width * 0.1
        const padY = height * 0.1
        
        const bX = Math.max(0, x - padX)
        const bY = Math.max(0, y - padY)
        const bW = Math.min(canvas.width - bX, width + padX * 2)
        const bH = Math.min(canvas.height - bY, height + padY * 2)
        
        // Create an offscreen canvas to apply the blur
        const offscreen = document.createElement("canvas")
        offscreen.width = bW
        offscreen.height = bH
        const offCtx = offscreen.getContext("2d")!
        
        // Draw the region
        offCtx.drawImage(canvas, bX, bY, bW, bH, 0, 0, bW, bH)
        
        // Apply CSS filter blur and draw back
        ctx.filter = `blur(${Math.max(10, Math.floor(bW * 0.1))}px)`
        ctx.drawImage(offscreen, bX, bY)
        ctx.filter = "none" // reset
      })
      
      setIsDone(true)
      toast.success(`Blurred ${detections.length} face(s) successfully!`)
      
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
    a.download = `blurred-${activeFile?.name || "image.jpg"}`
    a.click()
  }

  if (!activeFile) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-[440px] w-full text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
        onClick={() => document.getElementById('face-blur-upload')?.click()}
      >
        <input 
          id="face-blur-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) useWorkspaceStore.getState().addFiles([file])
          }}
        />
        <div className="w-14 h-14 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center mb-4 border border-black/10 shadow-sm">
          <ScanFace className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No image selected</p>
        <p className="text-xs text-slate-500 font-medium">Click to select a photo to automatically detect and blur faces.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-[380px] bg-white dark:bg-slate-900">
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xs relative">
          
          <img ref={imageRef} alt="Original" className="hidden" />
          
          <div className="w-full h-full flex items-center justify-center p-4">
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-[460px] object-contain drop-shadow-md rounded-xl"
             />
          </div>

          {!modelsLoaded && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl font-semibold text-xs border border-black/10 shadow-xl">
                 <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                 <span>Loading Face Detection Model...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <ScanFace className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Face Blur</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Privacy & Anonymization</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-4 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-slate-800 mb-6 shadow-2xs leading-relaxed">
            Runs client-side in your browser using TensorFlow TinyFace. Your photos never leave your device, ensuring zero data retention and complete privacy.
          </div>
        </div>

        <div className="mt-6 pt-4 space-y-3">
          {!isDone ? (
             <button
                onClick={handleProcess}
                disabled={isProcessing || !modelsLoaded}
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Image...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Blur Faces</span>
                  </>
                )}
             </button>
          ) : (
             <button
                onClick={handleDownload}
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download Result</span>
             </button>
          )}
        </div>
      </div>
    </div>
  )
}
