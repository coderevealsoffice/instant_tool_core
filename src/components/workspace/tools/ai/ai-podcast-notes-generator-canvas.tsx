"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, CheckCircle, Search, Mic, FileAudio, Clock, CheckSquare } from "lucide-react"
import { toast } from "sonner"

interface Timestamp {
  time: string;
  description: string;
}

interface PodcastNotes {
  title: string;
  summary: string;
  takeaways: string[];
  timestamps: Timestamp[];
}

export function AiPodcastNotesGeneratorCanvas() {
  const [topic, setTopic] = useState("")
  const [notes, setNotes] = useState<PodcastNotes | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a podcast topic or transcript excerpt.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-podcast-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate show notes")
      
      setNotes(data)
      toast.success("Show notes generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!notes) return;
    
    let text = `🎙️ ${notes.title}\n\n`;
    text += `SUMMARY\n${notes.summary}\n\n`;
    text += `KEY TAKEAWAYS\n${notes.takeaways.map(t => `• ${t}`).join('\n')}\n\n`;
    text += `CHAPTERS & TIMESTAMPS\n${notes.timestamps.map(t => `${t.time} - ${t.description}`).join('\n')}`;
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Show notes copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[540px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">Show Notes</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Podcast Notes & Timestamps</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Topic or Transcript</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Interview with a software engineer who transitioned into marketing and scaled a SaaS to $10k MRR..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-white resize-none h-44 text-sm font-medium transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                Provide a summary or rough transcript, and AI will generate professional show notes and estimated timestamps.
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
          <span>{isGenerating ? 'Producing Notes...' : 'Generate Show Notes'}</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col min-h-[420px] overflow-y-auto">
        
        {!notes && !isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <FileAudio className="w-12 h-12 mb-3 opacity-25" />
            <p className="text-sm font-medium">Enter a podcast topic to generate comprehensive show notes</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
            <span className="font-semibold text-base text-slate-800 dark:text-slate-200">Writing show notes and timestamps...</span>
          </div>
        )}

        {!isGenerating && notes && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-[#FAFAFA] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <FileAudio className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
                  Generated Show Notes
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-[#D7FB8E] hover:bg-[#cbf777] px-3.5 py-1.5 rounded-xl border border-black/10 transition-all shadow-2xs cursor-pointer"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied!" : "Copy Full Notes"}</span>
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Title */}
                <div className="text-center pb-6 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="inline-block px-3 py-1 bg-[#D7FB8E] text-slate-950 border border-black/10 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">Episode Title</span>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {notes.title}
                  </h1>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                    <FileAudio className="w-4 h-4 mr-2 text-slate-500" /> Summary
                  </h4>
                  <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-medium">
                    {notes.summary}
                  </div>
                </div>

                {/* Takeaways */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2 text-slate-500" /> Key Takeaways
                  </h4>
                  <ul className="space-y-3">
                    {notes.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="shrink-0 w-6 h-6 rounded-lg bg-[#D7FB8E] text-slate-950 border border-black/10 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timestamps */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-slate-500" /> Chapters & Timestamps
                  </h4>
                  <div className="space-y-2">
                    {notes.timestamps.map((stamp, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold w-16 mb-1 sm:mb-0 text-sm">
                          {stamp.time}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                          {stamp.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
