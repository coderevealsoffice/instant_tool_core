"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, Video, Zap } from "lucide-react"
import { toast } from "sonner"

export function AiShortsScriptGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("Energetic")
  const [script, setScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic or idea.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-shorts-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate script")
      
      setScript(data.script || "")
      toast.success("Script generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!script) return
    navigator.clipboard.writeText(script)
    setIsCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Shorts Script</h2>
            <p className="text-sm text-slate-500">TikTok, Reels & Shorts</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Video Topic or Idea</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 3 psychological tricks to study faster..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-slate-700 dark:text-slate-300 resize-none h-32"
            />
            <p className="text-xs text-slate-500 mt-2">
              Provide a clear idea. The AI will structure it into a 60s viral script.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {["Energetic", "Educational", "Storytelling", "Controversial"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${tone === t ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-purple-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Writing Script...' : 'Generate Script'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-hidden">
        
        {/* Output Pane */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
            <span className="font-semibold text-purple-600 dark:text-purple-500 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Generated Script (Hook + Body + CTA)
            </span>
            {script && (
              <button 
                onClick={handleCopy}
                className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied' : 'Copy Text'}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative p-6">
            {!script && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Enter an idea to generate a viral script</p>
              </div>
            )}
            
            {script && (
              <textarea
                readOnly
                value={script}
                className="w-full h-full bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap"
              />
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center text-purple-600">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Writing a viral script...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
