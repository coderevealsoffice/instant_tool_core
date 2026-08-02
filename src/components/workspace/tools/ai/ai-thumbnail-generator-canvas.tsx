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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Thumbnail Ideas</h2>
            <p className="text-sm text-slate-500">Boost your CTR</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Video Title or Topic</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., I survived 50 hours in Antarctica..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-300 resize-none h-32"
            />
            <p className="text-xs text-slate-500 mt-2">
              Describe your video. AI will generate 3 highly clickable thumbnail concepts.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Brainstorming...' : 'Generate Ideas'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-y-auto">
        
        {!ideas.length && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter a topic to generate 3 high-CTR thumbnail ideas</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-blue-600 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Designing concepts...</span>
          </div>
        )}

        {!isGenerating && ideas.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
              Your Thumbnail Concepts
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ideas.map((idea, index) => (
                <div key={index} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">#{index + 1}</span>
                      {idea.title}
                    </span>
                    <button 
                      onClick={() => handleCopy(idea, index)}
                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Copy Idea"
                    >
                      {copiedIndex === index ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1"><Eye className="w-3 h-3 mr-1" /> Visuals</h4>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{idea.visuals}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1"><MessageSquare className="w-3 h-3 mr-1" /> Text on Thumbnail</h4>
                      <p className="text-slate-900 dark:text-white font-black text-lg bg-yellow-100 dark:bg-yellow-900/30 inline-block px-2 py-0.5 rounded">{idea.text}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1"><PaintBucket className="w-3 h-3 mr-1" /> Background</h4>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{idea.background}</p>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center mb-1"><Sparkles className="w-3 h-3 mr-1" /> Why it works</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm italic">{idea.reasoning}</p>
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
