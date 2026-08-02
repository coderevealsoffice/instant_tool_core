"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Download, Image as ImageIcon, Sliders, RotateCw, RotateCcw, Save } from "lucide-react"

export function AiImageEditorCanvas() {
  const { files } = useWorkspaceStore()
  const activeFile = files?.[0]?.file ?? null
  
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  // Editor state
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    if (!activeFile) return
    const url = URL.createObjectURL(activeFile)
    setImageUrl(url)
    setIsLoaded(false)
    
    return () => URL.revokeObjectURL(url)
  }, [activeFile])

  // Apply filters and rotation to canvas
  useEffect(() => {
    if (!imageUrl || !canvasRef.current || !imageRef.current || !isLoaded) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = imageRef.current
    
    // Set canvas dimensions considering rotation
    if (rotation % 180 === 0) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    } else {
      canvas.width = img.naturalHeight
      canvas.height = img.naturalWidth
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Move to center, rotate, move back
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    
    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    
    ctx.drawImage(
      img, 
      -img.naturalWidth / 2, 
      -img.naturalHeight / 2, 
      img.naturalWidth, 
      img.naturalHeight
    )
    
    ctx.restore()
  }, [imageUrl, brightness, contrast, saturation, rotation, isLoaded])

  const handleSave = () => {
    if (!canvasRef.current) return
    const a = document.createElement("a")
    a.href = canvasRef.current.toDataURL("image/png")
    a.download = `edited-${activeFile?.name || "image.png"}`
    a.click()
  }

  if (!activeFile || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('image-editor-upload')?.click()}
      >
        <input 
          id="image-editor-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) useWorkspaceStore.getState().addFiles([file])
          }}
        />
        <ImageIcon className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">No image selected</p>
        <p className="text-sm">Click here to upload an image to edit.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Hidden original image to draw from */}
      <img 
        ref={imageRef} 
        src={imageUrl} 
        alt="Original" 
        className="hidden"
        onLoad={() => setIsLoaded(true)} 
      />

      {/* Main Canvas Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0">
        <div className="flex-1 bg-slate-200 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner relative pattern-grid-lg">
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
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Image Editor</h2>
            <p className="text-sm text-slate-500">Fast, free, client-side adjustments.</p>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          {/* Adjustments */}
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Adjustments</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Brightness</span>
                <span className="font-medium">{brightness}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" 
                value={brightness} 
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Contrast</span>
                <span className="font-medium">{contrast}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" 
                value={contrast} 
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Saturation</span>
                <span className="font-medium">{saturation}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" 
                value={saturation} 
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          {/* Transform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Transform</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setRotation(r => r - 90)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Rotate L
              </button>
              <button 
                onClick={() => setRotation(r => r + 90)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
              >
                <RotateCw className="w-4 h-4" /> Rotate R
              </button>
            </div>
            
            <button 
              onClick={() => {
                setBrightness(100)
                setContrast(100)
                setSaturation(100)
                setRotation(0)
              }}
              className="w-full py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors"
            >
              Reset All Changes
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
           <button
              onClick={handleSave}
              className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-purple-600/20 active:scale-[0.98]"
            >
              <Save className="w-5 h-5" />
              <span>Save Image</span>
           </button>
        </div>
      </div>
    </div>
  )
}
