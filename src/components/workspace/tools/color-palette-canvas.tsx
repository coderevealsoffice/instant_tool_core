"use client"

import React, { useState, useEffect } from "react"
import { Copy, Check, Palette, Sparkles, Star, Moon, Plus } from "lucide-react"
import { generatePalettes } from "@/lib/color-utils"

export default function ColorPaletteCanvas() {
  const [baseColor, setBaseColor] = useState("#8B5CF6")
  const [inputValue, setInputValue] = useState("#8B5CF6")
  const [palettes, setPalettes] = useState<ReturnType<typeof generatePalettes> | null>(null)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Basic validation
      const hex = inputValue.startsWith('#') ? inputValue : `#${inputValue}`
      if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
        setPalettes(generatePalettes(hex))
      }
    } catch (err) {
      // ignore invalid color format during typing
    }
  }, [baseColor])

  const handleGenerate = () => {
    let hex = inputValue.trim()
    if (!hex.startsWith('#')) hex = `#${hex}`
    if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
      setBaseColor(hex)
      setInputValue(hex.toUpperCase())
      setPalettes(generatePalettes(hex))
    }
  }

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  // Generate on mount
  useEffect(() => {
    setPalettes(generatePalettes(baseColor))
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Never waste hours finding the perfect color palette again.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Just enter a color below to instantly generate matching harmonies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto mt-8">
            <div className="relative flex items-center w-full bg-white dark:bg-slate-900 rounded-lg p-1.5 shadow-sm border border-slate-200 dark:border-slate-800">
              <input 
                type="color" 
                value={inputValue.startsWith('#') ? inputValue : `#${inputValue}`}
                onChange={(e) => {
                  setInputValue(e.target.value.toUpperCase())
                  setBaseColor(e.target.value.toUpperCase())
                }}
                className="w-10 h-10 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md ml-1"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="#HEXCODE"
                className="flex-1 bg-transparent border-none outline-none font-mono text-slate-700 dark:text-slate-300 text-base px-3 uppercase"
              />
              <button 
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Palettes Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-16">
        {palettes && Object.entries(palettes).map(([name, colors]) => (
          <div key={name} className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-6">
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            
            <div className="flex w-full h-32 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              {colors.map((hex, i) => (
                <div 
                  key={`${name}-${i}`} 
                  className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-[1.5]"
                  style={{ backgroundColor: hex }}
                  onClick={() => handleCopy(hex)}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    {copiedHex === hex ? (
                      <Check className="w-8 h-8 text-white" />
                    ) : (
                      <Copy className="w-8 h-8 text-white drop-shadow-md" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex w-full mt-4">
              {colors.map((hex, i) => (
                <div key={`hex-${name}-${i}`} className="flex-1 text-center">
                  <span className="font-mono text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {hex}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="w-32 h-px bg-slate-200 dark:bg-slate-800 mt-16"></div>
          </div>
        ))}
      </section>

      {/* SEO & Education Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
              <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Understanding Color Spaces
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                A Color Palette Generator takes a single base color and uses math to find harmonious combinations. This helps designers and developers quickly find the perfect matching colors.
              </p>
              <p>
                <strong>Monochromatic</strong> palettes use variations in lightness. 
                <strong>Analogous</strong> colors sit next to each other on the color wheel. 
                <strong>Complementary</strong> colors are opposites, offering maximum contrast.
              </p>
            </div>
            <div className="relative h-32 md:h-auto opacity-30 dark:opacity-20 pointer-events-none hidden md:flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-dashed border-slate-400 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-20 h-20 border border-slate-300 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Everything you need to know about generating color palettes.</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How do I copy a color's HEX code?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Simply hover over any color block in the generated palettes and click it. The HEX code will instantly be copied to your clipboard, ready to be pasted into CSS, Figma, or Photoshop.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What is an Analogous palette?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Analogous color schemes use colors that are next to each other on the color wheel. They usually match well and create serene and comfortable designs. Analogous color schemes are often found in nature and are harmonious and pleasing to the eye.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Is this tool free to use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, our Color Palette Generator is 100% free. You can generate unlimited color schemes and harmonies without any restrictions.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
