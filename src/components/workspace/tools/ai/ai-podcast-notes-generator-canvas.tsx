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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Show Notes</h2>
            <p className="text-sm text-slate-500">Podcast Notes & Timestamps</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic or Transcript</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Interview with a software engineer who transitioned into marketing and scaled a SaaS to $10k MRR..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300 resize-none h-48"
            />
            <p className="text-xs text-slate-500 mt-2">
              Provide a summary or rough transcript, and AI will generate professional show notes and estimated timestamps.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-indigo-500/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isGenerating ? 'Producing Notes...' : 'Generate Show Notes'}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-y-auto">
        
        {!notes && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FileAudio className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter a podcast topic to generate comprehensive show notes</p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-medium text-lg text-slate-700 dark:text-slate-300">Writing show notes...</span>
          </div>
        )}

        {!isGenerating && notes && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center text-slate-800 dark:text-slate-200">
                  <FileAudio className="w-5 h-5 mr-2 text-indigo-500" /> 
                  Generated Show Notes
                </h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Full Notes"}
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Title */}
                <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                  <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest mb-3">Episode Title</span>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {notes.title}
                  </h1>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                    <FileAudio className="w-4 h-4 mr-2" /> Summary
                  </h4>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {notes.summary}
                  </div>
                </div>

                {/* Takeaways */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" /> Key Takeaways
                  </h4>
                  <ul className="space-y-3">
                    {notes.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timestamps */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> Chapters & Timestamps
                  </h4>
                  <div className="space-y-2">
                    {notes.timestamps.map((stamp, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold w-16 mb-1 sm:mb-0">
                          {stamp.time}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
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
