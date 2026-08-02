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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI YouTube Summarizer</h2>
            <p className="text-sm text-slate-500">Paste a YouTube link to instantly summarize the video.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !videoUrl}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Summarize Video
          </button>
        </div>
      </div>

      {/* Output Section */}
      {summary && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> 
              Summary Output
            </h3>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 flex items-center gap-2 text-sm font-medium"
            >
              {isCopied ? (
                <><CheckCircle className="w-4 h-4 text-green-500" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Text</>
              )}
            </button>
          </div>

          <div className="text-slate-700">
            {renderFormattedText(summary)}
          </div>
        </div>
      )}
    </div>
  )
}
