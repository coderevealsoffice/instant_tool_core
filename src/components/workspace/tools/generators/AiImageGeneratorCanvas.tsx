"use client"

import { useState } from "react"
import { ImageIcon, Download, Loader2, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AiImageGeneratorCanvas() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [, setSeed] = useState(1)
  
  // Settings
  const [aspectRatio, setAspectRatio] = useState("square") // square, landscape, portrait
  const [isHD, setIsHD] = useState(false)
  const [style, setStyle] = useState("realistic") // realistic, anime, 3d, oil, digital

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Pollinations AI URL structure with a random seed
    const newSeed = Math.floor(Math.random() * 1000000)
    setSeed(newSeed)
    
    // Determine width and height
    let w = 1024
    let h = 1024
    
    if (aspectRatio === "landscape") {
      w = 1280; h = 720
    } else if (aspectRatio === "portrait") {
      w = 720; h = 1280
    }
    
    // Apply HD multiplier
    if (isHD) {
      w = Math.floor(w * 1.5)
      h = Math.floor(h * 1.5)
    }

    // Append style to prompt
    let finalPrompt = prompt
    if (style === "realistic") finalPrompt += ", ultra realistic, highly detailed, 8k photography, photorealistic"
    if (style === "anime") finalPrompt += ", high quality anime style, studio ghibli, detailed illustration"
    if (style === "3d") finalPrompt += ", 3d render, octane render, unreal engine 5, masterpiece"
    if (style === "digital") finalPrompt += ", trending on artstation, digital art, masterpiece"
    if (style === "oil") finalPrompt += ", oil painting, masterpiece, vivid colors, canvas texture"

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${w}&height=${h}&nologo=true&seed=${newSeed}`
    
    // Preload image to avoid showing broken box
    const img = new Image()
    img.onload = () => {
      setImageUrl(url)
      setIsGenerating(false)
    }
    img.onerror = () => {
      setIsGenerating(false)
      alert("Failed to generate image. Please try again.")
    }
    img.src = url
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `ai-image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading image:", err)
      alert("Failed to download image. Try right-clicking and saving it.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Image Generator</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fast Diffusion Synthesis</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A futuristic city skyline at sunset, cyberpunk style, highly detailed 8k..."
              className="w-full h-24 md:h-14 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-14 px-8 bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold rounded-xl border border-black/10 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><ImageIcon className="w-5 h-5 mr-2" /> Generate Image</>
              )}
            </Button>
          </div>
          
          {/* Settings Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Aspect:</span>
              <select 
                value={aspectRatio} 
                onChange={e => setAspectRatio(e.target.value)}
                className="bg-[#FAFAFA] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium outline-none cursor-pointer"
              >
                <option value="square">Square (1:1)</option>
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (9:16)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Style:</span>
              <select 
                value={style} 
                onChange={e => setStyle(e.target.value)}
                className="bg-[#FAFAFA] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium outline-none cursor-pointer"
              >
                <option value="none">Auto / Natural</option>
                <option value="realistic">Photorealistic</option>
                <option value="anime">Anime Style</option>
                <option value="3d">3D Render</option>
                <option value="digital">Digital Art</option>
                <option value="oil">Oil Painting</option>
              </select>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input 
                type="checkbox" 
                checked={isHD} 
                onChange={e => setIsHD(e.target.checked)} 
                className="rounded text-emerald-600 focus:ring-emerald-500 bg-[#FAFAFA] border-slate-300"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">HD 2x Render</span>
            </label>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-[#FAFAFA] dark:bg-slate-950 rounded-[2rem] p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden group">
        
        {!imageUrl && !isGenerating && (
          <div className="text-center text-slate-400 dark:text-slate-600 my-auto">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <ImageIcon className="w-8 h-8 opacity-40 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your generated artwork will appear here</p>
            <p className="text-xs text-slate-400 mt-1">Enter a prompt above and click Generate Image</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs z-10">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
            <p className="text-slate-900 dark:text-white font-semibold text-base animate-pulse">
              Dreaming up your image...
            </p>
          </div>
        )}

        {imageUrl && (
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md group border border-slate-200 dark:border-slate-800">
            <img 
              src={imageUrl} 
              alt="Generated AI Image" 
              className={`w-full h-auto object-cover transition-opacity duration-500 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
            />
            
            {/* Overlay actions */}
            {!isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                <Button 
                  onClick={handleGenerate}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md rounded-xl text-xs font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Re-generate
                </Button>

                <Button 
                  onClick={handleDownload}
                  className="bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold rounded-xl border border-black/10 shadow-sm text-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Download HQ Image
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
