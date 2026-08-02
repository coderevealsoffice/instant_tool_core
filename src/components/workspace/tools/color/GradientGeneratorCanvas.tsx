"use client"

import { useState } from "react"
import { Image as ImageIcon, Copy } from "lucide-react"
import { toast } from "sonner"

export function GradientGeneratorCanvas() {
  const [color1, setColor1] = useState("#4f46e5")
  const [color2, setColor2] = useState("#ec4899")
  const [angle, setAngle] = useState(90)
  const [type, setType] = useState<"linear" | "radial">("linear")

  const gradientString = type === "linear" 
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`

  const cssCode = `background: ${color1};\nbackground: ${gradientString};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success("CSS copied to clipboard")
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-2xl">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gradient Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create beautiful CSS gradients instantly</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 max-w-5xl">
        {/* Preview Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div 
            className="w-full h-64 md:h-96 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300"
            style={{ background: gradientString }}
          ></div>
          
          <div className="bg-slate-900 rounded-xl p-4 relative group">
            <pre className="text-sm font-mono text-slate-300 overflow-x-auto p-2">
              {cssCode}
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            
            {/* Type Selector */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Gradient Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                  onClick={() => setType("linear")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${type === "linear" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >Linear</button>
                <button 
                  onClick={() => setType("radial")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${type === "radial" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >Radial</button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Colors</label>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-500">{color1}</span>
                <input 
                  type="color" 
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-500">{color2}</span>
                <input 
                  type="color" 
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Angle (only for linear) */}
            {type === "linear" && (
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Angle</span>
                  <span className="text-slate-500">{angle}°</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-slate-700"
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
