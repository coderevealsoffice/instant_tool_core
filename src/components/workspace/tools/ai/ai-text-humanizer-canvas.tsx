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
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">AI Humanizer</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Natural & Undetectable Prose</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Select Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {["Natural", "Casual", "Professional", "Academic"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      tone === t 
                        ? 'bg-[#D7FB8E] border-black/10 text-slate-950 shadow-2xs' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Readability Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white text-sm font-medium cursor-pointer"
              >
                <option value="Middle School">Middle School (Simple & Direct)</option>
                <option value="High School">High School (Standard & Fluent)</option>
                <option value="College">College (Advanced & Scholarly)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleHumanize}
          disabled={isGenerating || !inputText.trim()}
          className="mt-6 w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          <span>{isGenerating ? 'Humanizing...' : 'Humanize Text'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[440px]">
        
        {/* Input Pane */}
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex justify-between items-center">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <Type className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              Original AI Text
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your AI-generated text here (from ChatGPT, Claude, etc.)..."
            className="flex-1 w-full p-6 bg-transparent outline-none resize-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans placeholder:text-slate-400"
          />
        </div>

        {/* Output Pane */}
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden relative">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex justify-between items-center">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              Humanized Output
            </span>
            {outputText && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
          
          <div className="flex-1 relative p-6">
            <textarea
              readOnly
              value={outputText}
              placeholder="Your natural, human-sounding text will appear here..."
              className="w-full h-full bg-transparent outline-none resize-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans placeholder:text-slate-400"
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-900 dark:text-white">
                  <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
                  <span className="font-semibold text-base">Rewriting with human phrasing & rhythm...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
