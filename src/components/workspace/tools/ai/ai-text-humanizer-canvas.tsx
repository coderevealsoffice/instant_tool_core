"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, RefreshCw, Type } from "lucide-react"
import { toast } from "sonner"

export function AiTextHumanizerCanvas() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [tone, setTone] = useState("Natural")
  const [level, setLevel] = useState("High School")

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to humanize.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-humanizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone, level })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to humanize text")
      
      setOutputText(data.content || "")
      toast.success("Text humanized successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setIsCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Humanizer</h2>
            <p className="text-sm text-slate-500">Bypass AI detectors</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {["Natural", "Casual", "Professional", "Academic"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${tone === t ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Readability Level</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="Middle School">Middle School (Simple)</option>
              <option value="High School">High School (Standard)</option>
              <option value="College">College (Advanced)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleHumanize}
          disabled={isGenerating || !inputText.trim()}
          className="mt-6 w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-orange-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Humanizing...' : 'Humanize Text'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col md:flex-row gap-4 lg:gap-6 min-h-0 overflow-hidden">
        
        {/* Input Pane */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Original AI Text
            </span>
            <span className="text-xs text-slate-400">{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your AI-generated text here (from ChatGPT, Claude, etc.)..."
            className="flex-1 w-full p-6 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-base leading-relaxed"
          />
        </div>

        {/* Output Pane */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
            <span className="font-semibold text-orange-600 dark:text-orange-500 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Humanized Output
            </span>
            {outputText && (
              <button 
                onClick={handleCopy}
                className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={outputText}
              placeholder="Your human-sounding text will appear here..."
              className="w-full h-full p-6 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-base leading-relaxed"
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center text-orange-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="font-medium">Rewriting to sound human...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
