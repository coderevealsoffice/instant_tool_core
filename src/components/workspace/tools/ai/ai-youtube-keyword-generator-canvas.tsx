"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, MonitorPlay, Tags } from "lucide-react"
import { toast } from "sonner"

export function AiYoutubeKeywordGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic or title.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-youtube-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate keywords")
      
      setKeywords(data.keywords || "")
      toast.success("Keywords generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!keywords) return
    navigator.clipboard.writeText(keywords)
    setIsCopied(true)
    toast.success("Copied to clipboard! Ready to paste into YouTube.")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Tags className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Keyword Generator</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">YouTube SEO Tags</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Video Topic or Title</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to bake a chocolate cake at home..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white resize-none h-36 text-sm font-medium transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                Be specific to get the most relevant search terms and tags for your video.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>{isGenerating ? 'Generating Keywords...' : 'Generate Keywords'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col min-h-[420px]">
        
        {/* Output Pane */}
        <div className="flex-1 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden relative">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex justify-between items-center">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <MonitorPlay className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              Generated Tags (Comma Separated)
            </span>
            {keywords && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy All Tags'}</span>
              </button>
            )}
          </div>
          
          <div className="flex-1 relative p-6">
            {!keywords && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <Search className="w-12 h-12 mb-3 opacity-25" />
                <p className="text-sm font-medium">Enter a topic to generate high-ranking YouTube keywords</p>
              </div>
            )}
            
            {keywords && (
              <textarea
                readOnly
                value={keywords}
                className="w-full h-full min-h-[220px] bg-transparent outline-none resize-none text-slate-800 dark:text-slate-200 text-base leading-relaxed font-mono"
              />
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-900 dark:text-white">
                  <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
                  <span className="font-semibold text-base">Finding high-ranking SEO tags...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
