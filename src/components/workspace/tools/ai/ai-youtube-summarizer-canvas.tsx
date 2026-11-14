"use client"

import { useState } from "react"
import { Sparkles, Loader2, PlaySquare, Copy, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function AiYoutubeSummarizerCanvas() {
  const [videoUrl, setVideoUrl] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleSummarize = async () => {
    if (!videoUrl) {
      toast.error("Please enter a YouTube video URL")
      return
    }
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      toast.error("Please enter a valid YouTube URL")
      return
    }

    setIsLoading(true)
    setSummary("")

    try {
      const response = await fetch("/api/ai-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setSummary(data.summary)
      toast.success("Summary generated successfully!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      setIsCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // A very basic markdown parser for bold and lists
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let formattedLine = line;
      // Bold
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Headers
      if (formattedLine.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-slate-800" dangerouslySetInnerHTML={{__html: formattedLine.replace('### ', '')}} />
      }
      if (formattedLine.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-slate-900 border-b pb-1" dangerouslySetInnerHTML={{__html: formattedLine.replace('## ', '')}} />
      }
      if (formattedLine.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-black mt-6 mb-3 text-slate-900" dangerouslySetInnerHTML={{__html: formattedLine.replace('# ', '')}} />
      }
      // Lists
      if (formattedLine.trim().startsWith('- ') || formattedLine.trim().startsWith('* ')) {
        return <li key={i} className="ml-6 list-disc mb-1" dangerouslySetInnerHTML={{__html: formattedLine.substring(2)}} />
      }
      
      return (
        <p key={i} className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{__html: formattedLine}} />
      )
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center border border-black/10 shadow-2xs shrink-0">
            <PlaySquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI YouTube Summarizer</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Paste a YouTube link to instantly summarize the video</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !videoUrl}
            className="px-6 py-3.5 bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <Sparkles className="w-5 h-5 text-slate-950" />
            )}
            Summarize Video
          </button>
        </div>
      </div>

      {/* Output Section */}
      {summary && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/90 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Summary Output
            </h3>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs border border-black/10 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              {isCopied ? (
                <><CheckCircle className="w-4 h-4 text-emerald-700" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Text</>
              )}
            </button>
          </div>

          <div className="text-slate-800 dark:text-slate-200">
            {renderFormattedText(summary)}
          </div>
        </div>
      )}
    </div>
  )
}
