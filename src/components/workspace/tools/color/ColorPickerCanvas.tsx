"use client"

import { useState } from "react"
import { Pipette, Copy } from "lucide-react"
import { toast } from "sonner"

export function ColorPickerCanvas() {
  const [color, setColor] = useState("#4f46e5") // Indigo-600

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  }

  const rgbArr = hexToRgb(color)?.split(',').map(Number) || [0,0,0];
  const rgb = `rgb(${rgbArr.join(', ')})`
  const hsl = `hsl(${rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2])})`

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-pink-500 flex items-center justify-center shadow-2xl">
          <Pipette className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Color Picker</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Select colors and get HEX, RGB, and HSL codes</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 max-w-4xl">
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <div 
            className="w-48 h-48 rounded-full shadow-inner border-4 border-white dark:border-slate-700 mb-6 transition-colors duration-200"
            style={{ backgroundColor: color }}
          ></div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Choose a color</label>
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-32 h-12 rounded cursor-pointer"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HEX</label>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-3 font-mono text-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 uppercase">
                {color}
              </div>
              <button onClick={() => handleCopy(color, "HEX")} className="p-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RGB</label>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-3 font-mono text-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {rgb}
              </div>
              <button onClick={() => handleCopy(rgb, "RGB")} className="p-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">HSL</label>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-3 font-mono text-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {hsl}
              </div>
              <button onClick={() => handleCopy(hsl, "HSL")} className="p-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
