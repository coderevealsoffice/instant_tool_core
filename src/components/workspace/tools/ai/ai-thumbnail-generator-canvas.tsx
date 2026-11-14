"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, Image as ImageIcon, Eye, MessageSquare, PaintBucket } from "lucide-react"
import { toast } from "sonner"

interface ThumbnailIdea {
  title: string;
  visuals: string;
  text: string;
  background: string;
  reasoning: string;
}

export function AiThumbnailGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [ideas, setIdeas] = useState<ThumbnailIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic or title.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-thumbnail-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate thumbnail ideas")
      
      setIdeas(data.ideas || [])
      toast.success("Thumbnail ideas generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (idea: ThumbnailIdea, index: number) => {
    const textToCopy = `Thumbnail Concept: ${idea.title}\n\nVisuals: ${idea.visuals}\nText on Thumbnail: ${idea.text}\nBackground: ${idea.background}\nWhy it works: ${idea.reasoning}`
    navigator.clipboard.writeText(textToCopy)
    setCopiedIndex(index)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Thumbnail Ideas</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">High-CTR Concept Generator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Video Title or Topic</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., I survived 50 hours in Antarctica..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white resize-none h-36 text-sm font-medium transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                Describe your video. AI will generate 3 highly clickable thumbnail concepts.
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
          <span>{isGenerating ? 'Brainstorming...' : 'Generate Concepts'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col min-h-[420px] overflow-y-auto">
        
        {!ideas.length && !isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 mb-3 opacity-25" />
            <p className="text-sm font-medium">Enter a topic to generate 3 high-CTR thumbnail ideas</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
            <span className="font-semibold text-base text-slate-800 dark:text-slate-200">Designing clickable concepts...</span>
          </div>
        )}

        {!isGenerating && ideas.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Your Thumbnail Concepts
              </h3>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {ideas.map((idea, index) => (
                <div key={index} className="bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                  <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="bg-[#D7FB8E] text-slate-950 font-bold w-6 h-6 rounded-lg flex items-center justify-center text-xs border border-black/10">#{index + 1}</span>
                      {idea.title}
                    </span>
                    <button 
                      onClick={() => handleCopy(idea, index)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                      title="Copy Idea"
                    >
                      {copiedIndex === index ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 space-y-4 text-xs sm:text-sm">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center mb-1.5"><Eye className="w-3.5 h-3.5 mr-1 text-slate-400" /> Visuals</h4>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{idea.visuals}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center mb-1.5"><MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-400" /> Text on Thumbnail</h4>
                      <p className="text-slate-950 dark:text-slate-900 font-extrabold text-base bg-[#D7FB8E] inline-block px-2.5 py-1 rounded-lg border border-black/10">{idea.text}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center mb-1.5"><PaintBucket className="w-3.5 h-3.5 mr-1 text-slate-400" /> Background</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{idea.background}</p>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center mb-1"><Sparkles className="w-3.5 h-3.5 mr-1" /> Why it works</h4>
                      <p className="text-slate-600 dark:text-slate-400 italic">{idea.reasoning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
