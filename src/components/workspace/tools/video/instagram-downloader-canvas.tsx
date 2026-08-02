"use client"

import { useState, useRef } from "react"
import {
  Camera, Download, Loader2, Link2, AlertCircle,
  Clipboard, CheckCircle2, Sparkles, X, Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"

type MediaResult = {
  downloadUrl: string
  title: string
  thumbnail?: string
}

export function InstagramDownloaderCanvas() {
  const [url, setUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<MediaResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      toast.success("Link pasted from clipboard!")
    } catch {
      toast.error("Could not access clipboard. Please paste manually.")
    }
  }

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error("Please enter an Instagram URL")
      return
    }

    if (!url.includes("instagram.com")) {
      toast.error("Please enter a valid Instagram URL")
      return
    }

    try {
      setIsProcessing(true)
      setResult(null)

      const res = await fetch("/api/downloader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: "instagram" })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setResult(data)
      toast.success("Media ready for download!")
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch media. Please check the URL and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setUrl("")
    setResult(null)
    inputRef.current?.focus()
  }

  // Detect post type from URL
  const getPostType = (): string => {
    if (url.includes("/reel/") || url.includes("/reels/")) return "Reel"
    if (url.includes("/stories/")) return "Story"
    if (url.includes("/p/")) return "Post"
    return "Media"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200">
        {/* Top gradient accent bar — Instagram style */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-pink-500/30 to-purple-500/30 rounded-2xl rotate-6" />
            <div className="relative w-full h-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Instagram Downloader
          </h2>
          <p className="text-base text-slate-500 mb-8 max-w-lg mx-auto">
            Download Instagram Reels, Posts, and Stories. Paste the link below to get started.
          </p>

          {/* Supported types */}
          <div className="inline-flex items-center gap-3 mb-6">
            {[
              { icon: <Camera className="w-4 h-4" />, label: "Reels" },
              { icon: <ImageIcon className="w-4 h-4" />, label: "Posts" },
              { icon: <Sparkles className="w-4 h-4" />, label: "Stories" },
            ].map((type) => (
              <span
                key={type.label}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg text-sm font-medium text-pink-700"
              >
                {type.icon}
                {type.label}
              </span>
            ))}
          </div>

          {/* URL Input */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Link2 className="w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="Paste Instagram link here..."
              className="w-full pl-12 pr-40 py-4 rounded-2xl border-2 border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 text-base transition-all outline-none"
            />
            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
              {url ? (
                <button
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-4 h-4" />
                  Paste
                </button>
              )}
              <button
                onClick={handleFetch}
                disabled={isProcessing || !url.trim()}
                className="h-full px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isProcessing ? "Fetching..." : "Fetch"}
              </button>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5" />
            For personal, non-commercial use only.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isProcessing && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-64 aspect-[4/5] max-w-xs rounded-2xl bg-slate-200 mx-auto" />
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
              <div className="flex gap-3 pt-2">
                <div className="h-12 bg-slate-200 rounded-xl w-48" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && !isProcessing && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            {result.thumbnail && (
              <div className="relative w-full md:w-72 flex-shrink-0">
                <div className="aspect-[4/5] md:aspect-auto md:h-full relative overflow-hidden bg-slate-900">
                  <img
                    src={result.thumbnail}
                    alt="Media thumbnail"
                    className="w-full h-full object-cover"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3 h-3" />
                    {getPostType()}
                  </div>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-600">Ready to download</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mt-2">
                  {result.title !== "Video Download" && result.title !== "Instagram Media"
                    ? result.title
                    : `Instagram ${getPostType()}`}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                {/* Download Button */}
                <a
                  href={result.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-pink-500/20"
                >
                  <Download className="w-5 h-5" />
                  Download {getPostType()}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        {["No Registration", "HD Quality", "Fast Downloads", "All Post Types"].map((feature) => (
          <span
            key={feature}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}
