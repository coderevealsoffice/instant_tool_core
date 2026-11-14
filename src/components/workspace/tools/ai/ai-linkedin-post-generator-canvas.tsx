"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, Briefcase, Layers, FileText } from "lucide-react"
import { toast } from "sonner"

export function AiLinkedinPostGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [post, setPost] = useState<string>("")
  const [carousel, setCarousel] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [copiedPost, setCopiedPost] = useState(false)
  const [copiedCarousel, setCopiedCarousel] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate LinkedIn content")
      
      setPost(data.post || "")
      setCarousel(data.carousel || [])
      toast.success("Content generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPost = () => {
    navigator.clipboard.writeText(post)
    setCopiedPost(true)
    toast.success("Post copied to clipboard!")
    setTimeout(() => setCopiedPost(false), 2000)
  }

  const handleCopyCarousel = () => {
    const text = carousel.map((slide, i) => `Slide ${i + 1}:\n${slide}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopiedCarousel(true)
    toast.success("Carousel text copied!")
    setTimeout(() => setCopiedCarousel(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">LinkedIn Viral</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Post & Carousel Creator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Topic or Idea</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Why developers should learn marketing..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white resize-none h-40 text-sm font-medium transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                Our AI acts as an executive ghostwriter to craft a high-engagement viral text post AND a structured 5-slide carousel plan.
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
          <span>{isGenerating ? 'Writing Content...' : 'Generate Post & Carousel'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col min-h-[420px] overflow-y-auto">
        
        {!post && !isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 mb-3 opacity-25" />
            <p className="text-sm font-medium">Enter a topic to generate viral LinkedIn content</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
            <span className="font-semibold text-base text-slate-800 dark:text-slate-200">Crafting your viral hook and carousel...</span>
          </div>
        )}

        {!isGenerating && post && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            
            {/* Text Post Section */}
            <div className="flex flex-col bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs h-full max-h-full">
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
                  Viral Text Post
                </span>
                <button
                  onClick={handleCopyPost}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedPost ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPost ? "Copied!" : "Copy Post"}</span>
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  {post}
                </div>
              </div>
            </div>

            {/* Carousel Plan Section */}
            <div className="flex flex-col bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs h-full max-h-full">
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
                  5-Slide Carousel Plan
                </span>
                <button
                  onClick={handleCopyCarousel}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedCarousel ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCarousel ? "Copied!" : "Copy Carousel"}</span>
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-3.5">
                {carousel.map((slide, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                    <div className="font-bold text-[11px] text-slate-950 dark:text-slate-900 bg-[#D7FB8E] inline-block px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 border border-black/10">Slide {i + 1}</div>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {slide}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
