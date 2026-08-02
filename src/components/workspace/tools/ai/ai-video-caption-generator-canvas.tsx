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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Viral Caption</h2>
            <p className="text-sm text-slate-500">For Reels, TikTok & Shorts</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Video Topic or Idea</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 3 hidden features in iOS 18 that will blow your mind..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-slate-700 dark:text-slate-300 resize-none h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="engaging">Engaging & Conversational</option>
              <option value="funny">Funny & Relatable</option>
              <option value="educational">Educational & Authoritative</option>
              <option value="controversial">Bold & Controversial</option>
              <option value="inspirational">Inspirational & Motivational</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-pink-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Writing Caption...' : 'Generate Caption'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-y-auto">
        
        {!result && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Describe your video to generate a viral caption & hashtags</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-pink-600 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Crafting the perfect hook...</span>
          </div>
        )}

        {!isGenerating && result && (
          <div className="max-w-2xl mx-auto w-full space-y-6">
            
            {/* Caption Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center text-slate-800 dark:text-slate-200">
                  <MessageCircle className="w-5 h-5 mr-2 text-pink-500" /> 
                  Video Caption
                </h3>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {copiedCaption ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedCaption ? "Copied!" : "Copy Caption"}
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">
                  {result.caption}
                </div>
              </div>
            </div>

            {/* Hashtags Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center text-slate-800 dark:text-slate-200">
                  <Hash className="w-5 h-5 mr-2 text-pink-500" /> 
                  Trending Hashtags
                </h3>
                <button
                  onClick={handleCopyHashtags}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {copiedHashtags ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedHashtags ? "Copied!" : "Copy All"}
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-medium rounded-lg text-sm border border-slate-200 dark:border-slate-800"
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
