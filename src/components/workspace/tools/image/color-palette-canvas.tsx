"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Palette, UploadCloud, Copy, RefreshCcw, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { getColor, getPalette } from "colorthief"

interface ColorObj {
  rgb: [number, number, number];
  hex: string;
}

export function ColorPaletteCanvas() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dominantColor, setDominantColor] = useState<ColorObj | null>(null)
  const [palette, setPalette] = useState<ColorObj[]>([])
  
  const imgRef = useRef<HTMLImageElement>(null)

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const getLuminance = (r: number, g: number, b: number) => {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const selected = acceptedFiles[0]
    
    if (!selected.type.startsWith("image/")) {
      toast.error("Please upload a valid image file")
      return
    }
    
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    
    // Reset colors
    setDominantColor(null)
    setPalette([])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
  })

  const extractColors = async () => {
    if (!imgRef.current) return
    
    try {
      // Dominant Color
      const domRGB = await getColor(imgRef.current) as any
      if (domRGB) {
        setDominantColor({
          rgb: domRGB as [number, number, number],
          hex: rgbToHex(domRGB[0], domRGB[1], domRGB[2])
        })
      }
      
      // Palette (6 colors)
      const paletteRGB = await getPalette(imgRef.current, 6 as any) as any
      if (paletteRGB) {
        setPalette(paletteRGB.map((p: any) => ({
          rgb: p as [number, number, number],
          hex: rgbToHex(p[0], p[1], p[2])
        })))
      }
      
      toast.success("Colors extracted successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to extract colors. Make sure the image is fully loaded.")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Copied ${text} to clipboard!`)
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setDominantColor(null)
    setPalette([])
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Color Palette Generator</h2>
            <p className="text-sm text-slate-500">Extract dominant colors and beautiful palettes from any image instantly.</p>
          </div>
        </div>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50 bg-white'
            }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Upload an Image</h3>
          <p className="text-slate-500 mb-6">Drag & drop your image here, or click to browse</p>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Supports JPG, PNG, WEBP
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Image Preview */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-center min-h-[300px]">
              {/* Note: crossOrigin="anonymous" is needed for ColorThief to work on some images */}
              <img 
                ref={imgRef}
                src={preview!} 
                alt="Upload preview" 
                className="max-h-[400px] object-contain rounded-xl shadow-sm" 
                onLoad={extractColors}
                crossOrigin="anonymous"
              />
            </div>
            
            <button
              onClick={clearAll}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Upload New Image
            </button>
          </div>

          {/* Right: Extracted Colors */}
          <div className="space-y-6">
            {!dominantColor ? (
               <div className="h-full border border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
                  <Palette className="w-10 h-10 mb-4 opacity-30" />
                  <p>Extracting colors...</p>
               </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Dominant Color</h3>
                  <div 
                    onClick={() => copyToClipboard(dominantColor.hex.toUpperCase())}
                    className="h-32 rounded-2xl shadow-inner cursor-pointer group relative overflow-hidden flex items-end justify-between p-4 transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: dominantColor.hex }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-2 transition-all transform scale-95 group-hover:scale-100">
                        <Copy className="w-4 h-4" /> Copy Hex
                      </span>
                    </div>
                    {(() => {
                      const luma = getLuminance(...dominantColor.rgb)
                      const textColor = luma > 0.5 ? 'text-black/70' : 'text-white/90'
                      return (
                        <>
                          <span className={`font-mono font-bold text-lg ${textColor} relative z-10 uppercase`}>{dominantColor.hex}</span>
                          <span className={`font-mono text-sm ${textColor} relative z-10`}>RGB({dominantColor.rgb.join(', ')})</span>
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Color Palette</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {palette.map((color, idx) => (
                      <div 
                        key={idx}
                        onClick={() => copyToClipboard(color.hex.toUpperCase())}
                        className="group cursor-pointer"
                      >
                        <div 
                          className="h-24 rounded-xl shadow-inner mb-2 relative overflow-hidden transition-transform hover:scale-[1.05]"
                          style={{ backgroundColor: color.hex }}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                          </div>
                        </div>
                        <div className="text-center font-mono text-sm font-bold text-slate-700 uppercase">{color.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
