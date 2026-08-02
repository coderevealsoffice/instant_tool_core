"use client"

import { useState } from "react"
import { ImageIcon, Download, Loader2, Sparkles, Settings2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AiImageGeneratorCanvas() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [seed, setSeed] = useState(1)
  
  // New settings
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
    let w = 1024;
    let h = 1024;
    
    if (aspectRatio === "landscape") {
      w = 1280; h = 720;
    } else if (aspectRatio === "portrait") {
      w = 720; h = 1280;
    }
    
    // Apply HD multiplier
    if (isHD) {
      w = Math.floor(w * 1.5);
      h = Math.floor(h * 1.5);
    }

    // Append style to prompt
    let finalPrompt = prompt;
    if (style === "realistic") finalPrompt += ", ultra realistic, highly detailed, 8k photography, photorealistic";
    if (style === "anime") finalPrompt += ", high quality anime style, studio ghibli, detailed illustration";
    if (style === "3d") finalPrompt += ", 3d render, octane render, unreal engine 5, masterpiece";
    if (style === "digital") finalPrompt += ", trending on artstation, digital art, masterpiece";
    if (style === "oil") finalPrompt += ", oil painting, masterpiece, vivid colors, canvas texture";

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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fuchsia-500" />
          Describe your image
        </label>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A futuristic city skyline at sunset, cyberpunk style, highly detailed..."
              className="w-full h-24 md:h-14 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
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
              className="h-14 px-8 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 whitespace-nowrap"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><ImageIcon className="w-5 h-5 mr-2" /> Generate</>
              )}
            </Button>
          </div>
          
          {/* Settings Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Aspect Ratio:</span>
              <select 
                value={aspectRatio} 
                onChange={e => setAspectRatio(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-fuchsia-500/50"
              >
                <option value="square">Square (1:1)</option>
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (9:16)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Style:</span>
              <select 
                value={style} 
                onChange={e => setStyle(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-fuchsia-500/50"
              >
                <option value="none">Auto / None</option>
                <option value="realistic">Photorealistic</option>
                <option value="anime">Anime Style</option>
                <option value="3d">3D Render</option>
                <option value="digital">Digital Art</option>
                <option value="oil">Oil Painting</option>
              </select>
            </div>
            
            <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto">
              <input 
                type="checkbox" 
                checked={isHD} 
                onChange={e => setIsHD(e.target.checked)} 
                className="rounded text-fuchsia-600 focus:ring-fuchsia-500 bg-slate-100 border-none"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">HD Quality</span>
            </label>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Powered by Pollinations AI. Free, unlimited, no sign-up required.
        </p>
      </div>

      {/* Output Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-4 md:p-8 border border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
        
        {!imageUrl && !isGenerating && (
          <div className="text-center text-slate-400 dark:text-slate-600 my-auto">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
            <p>Your generated image will appear here</p>
            <p className="text-sm mt-1">Enter a prompt above and click generate</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10">
            <div className="w-20 h-20 relative mb-4">
              <div className="absolute inset-0 border-4 border-fuchsia-200 dark:border-fuchsia-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-fuchsia-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-fuchsia-600 dark:text-fuchsia-400 font-bold animate-pulse text-lg">
              Dreaming up your image...
            </p>
          </div>
        )}

        {imageUrl && (
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl group">
            <img 
              src={imageUrl} 
              alt="Generated AI Image" 
              className={`w-full h-auto object-cover transition-opacity duration-500 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
            />
            
            {/* Overlay actions */}
            {!isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                <Button 
                  onClick={handleGenerate}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/40 text-white border-none backdrop-blur-md"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Re-generate
                </Button>

                <Button 
                  onClick={handleDownload}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" /> Download HQ
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
