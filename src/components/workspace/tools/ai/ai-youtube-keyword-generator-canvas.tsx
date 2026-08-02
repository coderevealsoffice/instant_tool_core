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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Keyword Generator</h2>
            <p className="text-sm text-slate-500">YouTube SEO Tags</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Video Topic or Title</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to bake a chocolate cake at home..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-slate-700 dark:text-slate-300 resize-none h-32"
            />
            <p className="text-xs text-slate-500 mt-2">
              Be specific to get the most relevant search terms and tags for your video.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-red-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Generating...' : 'Generate Keywords'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-hidden">
        
        {/* Output Pane */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
            <span className="font-semibold text-red-600 dark:text-red-500 flex items-center">
              <MonitorPlay className="w-4 h-4 mr-2" />
              Generated Tags (Comma Separated)
            </span>
            {keywords && (
              <button 
                onClick={handleCopy}
                className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied' : 'Copy All'}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative p-6">
            {!keywords && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Enter a topic to generate YouTube keywords</p>
              </div>
            )}
            
            {keywords && (
              <textarea
                readOnly
                value={keywords}
                className="w-full h-full bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium"
              />
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center text-red-600">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Finding the best keywords...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
