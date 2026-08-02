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
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
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
        <ScanFace className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">No image selected</p>
        <p className="text-sm">Click here to upload an image to blur faces.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Main Canvas Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
        <div className="flex-1 bg-black rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner relative">
          
          <img ref={imageRef} alt="Original" className="hidden" />
          
          <div className="w-full h-full flex items-center justify-center p-4">
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-full object-contain drop-shadow-2xl"
             />
          </div>

          {!modelsLoaded && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-full font-semibold shadow-xl">
                 <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                 <span>Loading AI Models...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ScanFace className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Face Blur</h2>
            <p className="text-sm text-slate-500">Automatically detect and blur faces for privacy.</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800/30 mb-8">
          This tool runs entirely on your device. Your photos are never uploaded to any server, guaranteeing 100% privacy.
        </div>

        <div className="mt-auto pt-6 space-y-4">
          {!isDone ? (
             <button
                onClick={handleProcess}
                disabled={isProcessing || !modelsLoaded}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98]"
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
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
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
