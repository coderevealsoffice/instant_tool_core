"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, Smartphone, Hash, MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface VideoCaption {
  caption: string;
  hashtags: string[];
}

export function AiVideoCaptionGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("engaging")
  const [result, setResult] = useState<VideoCaption | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [copiedHashtags, setCopiedHashtags] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic or description.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-video-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate caption")
      
      setResult(data)
      toast.success("Caption generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCaption = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.caption)
    setCopiedCaption(true)
    toast.success("Caption copied to clipboard!")
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  const handleCopyHashtags = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.hashtags.join(' '))
    setCopiedHashtags(true)
    toast.success("Hashtags copied!")
    setTimeout(() => setCopiedHashtags(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Viral Caption</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">For Reels, TikTok & Shorts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Video Topic or Idea</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 3 hidden features in iOS 18 that will blow your mind..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white resize-none h-32 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white text-sm font-medium cursor-pointer"
              >
                <option value="engaging">Engaging & Conversational</option>
                <option value="funny">Funny & Relatable</option>
                <option value="educational">Educational & Authoritative</option>
                <option value="controversial">Bold & Controversial</option>
                <option value="inspirational">Inspirational & Motivational</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>{isGenerating ? 'Writing Caption...' : 'Generate Caption'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col min-h-[420px] overflow-y-auto">
        
        {!result && !isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 mb-3 opacity-25" />
            <p className="text-sm font-medium">Describe your video to generate a viral caption & hashtags</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
            <span className="font-semibold text-base text-slate-800 dark:text-slate-200">Crafting the perfect hook and hashtags...</span>
          </div>
        )}

        {!isGenerating && result && (
          <div className="max-w-2xl mx-auto w-full space-y-6">
            
            {/* Caption Card */}
            <div className="bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
                  Video Caption
                </span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedCaption ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCaption ? "Copied!" : "Copy Caption"}</span>
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {result.caption}
                </div>
              </div>
            </div>

            {/* Hashtags Card */}
            <div className="bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <Hash className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
                  Trending Hashtags
                </span>
                <button
                  onClick={handleCopyHashtags}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedHashtags ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedHashtags ? "Copied!" : "Copy Hashtags"}</span>
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold rounded-xl text-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
