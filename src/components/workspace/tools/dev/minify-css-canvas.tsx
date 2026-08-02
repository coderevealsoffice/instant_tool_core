"use client"

import { useState } from "react"
import { FileCode2, Play, Copy, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function MinifyCssCanvas() {
  const [inputCode, setInputCode] = useState("")
  const [outputCode, setOutputCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async () => {
    if (!inputCode.trim()) {
      toast.error("Please enter some CSS code")
      return
    }

    try {
      setIsProcessing(true)
      const res = await fetch("/api/dev-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "minify-css", code: inputCode })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setOutputCode(data.result)
      toast.success("CSS minified successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to minify code")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!outputCode) return
    navigator.clipboard.writeText(outputCode)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">CSS Minifier</h2>
            <p className="text-sm text-slate-500">Compress your CSS code to reduce file size and improve load times.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Input CSS</label>
            <button onClick={() => setInputCode("")} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full h-[500px] font-mono text-sm p-4 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Paste your CSS code here..."
            spellCheck="false"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Minified Output</label>
            <button onClick={handleCopy} className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              <Copy className="w-3 h-3" /> Copy Output
            </button>
          </div>
          <textarea
            value={outputCode}
            readOnly
            className="w-full h-[500px] font-mono text-sm p-4 rounded-xl border-slate-200 bg-slate-50 text-slate-600 shadow-sm"
            placeholder="Minified output will appear here..."
            spellCheck="false"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !inputCode.trim()}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Minify CSS
        </button>
      </div>
    </div>
  )
}
