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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">LinkedIn Viral</h2>
            <p className="text-sm text-slate-500">Post & Carousel Maker</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic or Idea</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Why developers should learn marketing..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-[#0077b5] focus:ring-1 focus:ring-[#0077b5] outline-none text-slate-700 dark:text-slate-300 resize-none h-40"
            />
            <p className="text-xs text-slate-500 mt-2">
              Our AI acts as a top-tier B2B ghostwriter to craft a high-engagement text post AND a 5-slide carousel plan.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-[#0077b5] hover:bg-[#006097] disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-[#0077b5]/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Writing Content...' : 'Generate Post & Carousel'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-y-auto">
        
        {!post && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter a topic to generate your viral LinkedIn content</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-[#0077b5] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Crafting your viral hook...</span>
          </div>
        )}

        {!isGenerating && post && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            
            {/* Text Post Section */}
            <div className="flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full max-h-full">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center text-slate-800 dark:text-slate-200">
                  <FileText className="w-5 h-5 mr-2 text-[#0077b5]" /> 
                  Viral Text Post
                </h3>
                <button
                  onClick={handleCopyPost}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-[#0077b5] transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {copiedPost ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedPost ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  {post}
                </div>
              </div>
            </div>

            {/* Carousel Plan Section */}
            <div className="flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full max-h-full">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center text-slate-800 dark:text-slate-200">
                  <Layers className="w-5 h-5 mr-2 text-[#0077b5]" /> 
                  5-Slide Carousel Plan
                </h3>
                <button
                  onClick={handleCopyCarousel}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-[#0077b5] transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {copiedCarousel ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedCarousel ? "Copied!" : "Copy All"}
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {carousel.map((slide, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-xs text-[#0077b5] uppercase tracking-wider mb-2">Slide {i + 1}</div>
                    <div className="text-sm md:text-base text-slate-700 dark:text-slate-300">
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
