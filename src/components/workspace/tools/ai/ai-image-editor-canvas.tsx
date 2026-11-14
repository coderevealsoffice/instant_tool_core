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
      <div 
        className="flex flex-col items-center justify-center min-h-[440px] w-full text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
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
        <div className="w-14 h-14 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center mb-4 border border-black/10 shadow-sm">
          <ImageIcon className="w-7 h-7" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No image selected</p>
        <p className="text-xs text-slate-500 font-medium">Click to select an image from your device to edit.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Hidden original image to draw from */}
      <img 
        ref={imageRef} 
        src={imageUrl} 
        alt="Original" 
        className="hidden"
        onLoad={() => setIsLoaded(true)} 
      />

      {/* Main Canvas Area */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-[380px] bg-white dark:bg-slate-900">
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xs relative">
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
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Image Editor</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Client-Side Filter Engine</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Adjustments */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Adjustments</h3>
              </div>
              
              <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Brightness</span>
                  <span className="text-slate-900 dark:text-white">{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="200" 
                  value={brightness} 
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              
              <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Contrast</span>
                  <span className="text-slate-900 dark:text-white">{contrast}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="200" 
                  value={contrast} 
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Saturation</span>
                  <span className="text-slate-900 dark:text-white">{saturation}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="200" 
                  value={saturation} 
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Transform */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Orientation</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setRotation(r => r - 90)}
                  className="flex-1 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Rotate -90°
                </button>
                <button 
                  onClick={() => setRotation(r => r + 90)}
                  className="flex-1 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate +90°
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setBrightness(100)
                  setContrast(100)
                  setSaturation(100)
                  setRotation(0)
                }}
                className="w-full py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset All Sliders
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
           <button
              onClick={handleSave}
              className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Download Edited Image</span>
           </button>
        </div>
      </div>
    </div>
  )
}
