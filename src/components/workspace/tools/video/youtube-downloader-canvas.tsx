"use client"

import { useState, useRef } from "react"
import { 
  MonitorPlay, Download, Loader2, Link2, AlertCircle, 
  Clipboard, Music, Video, Clock, CheckCircle2, 
  ChevronDown, Sparkles, X
} from "lucide-react"
import { toast } from "sonner"

type VideoResult = {
  downloadUrl: string
  title: string
  thumbnail?: string
  duration?: string
  qualities?: { label: string; url: string }[]
  audioUrl?: string
}

type DownloadMode = "video" | "audio"

export function YoutubeDownloaderCanvas() {
  const [url, setUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<VideoResult | null>(null)
  const [mode, setMode] = useState<DownloadMode>("video")
  const [selectedQuality, setSelectedQuality] = useState<string>("")
  const [showQualityMenu, setShowQualityMenu] = useState(false)
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
      toast.error("Please enter a YouTube URL")
      return
    }

    const supportedPlatforms = ["youtube.com", "youtu.be", "twitter.com", "x.com", "facebook.com", "fb.watch", "linkedin.com"]
    if (!supportedPlatforms.some(platform => url.includes(platform))) {
      toast.error("Please enter a valid YouTube, X, Facebook, or LinkedIn URL")
      return
    }

    try {
      setIsProcessing(true)
      setResult(null)
      setSelectedQuality("")

      const res = await fetch("/api/downloader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: "youtube" })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setResult(data)
      if (data.qualities?.length) {
        setSelectedQuality(data.qualities[0].label)
      }
      toast.success("Video ready for download!")
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch video. Please check the URL and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setUrl("")
    setResult(null)
    setSelectedQuality("")
    inputRef.current?.focus()
  }

  const getDownloadUrl = () => {
    if (mode === "audio" && result?.audioUrl) return result.audioUrl
    if (selectedQuality && result?.qualities) {
      const quality = result.qualities.find(q => q.label === selectedQuality)
      if (quality) return quality.url
    }
    return result?.downloadUrl || ""
  }

  const handleDownloadClick = (downloadUrl: string, isAudio: boolean = false) => {
    if (!downloadUrl) return;
    
    // Create a form to POST the download request
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/proxy-download";
    
    const urlInput = document.createElement("input");
    urlInput.type = "hidden";
    urlInput.name = "url";
    urlInput.value = downloadUrl;
    form.appendChild(urlInput);
    
    const titleInput = document.createElement("input");
    titleInput.type = "hidden";
    titleInput.name = "title";
    titleInput.value = result?.title || "video";
    form.appendChild(titleInput);
    
    const audioInput = document.createElement("input");
    audioInput.type = "hidden";
    audioInput.name = "audio";
    audioInput.value = isAudio ? "true" : "false";
    form.appendChild(audioInput);
    
    document.body.appendChild(form);
    form.submit();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200">
        {/* Top gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-600" />
        
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl rotate-6" />
            <div className="relative w-full h-full bg-red-100 rounded-2xl flex items-center justify-center">
              <MonitorPlay className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Universal Video Downloader
          </h2>
          <p className="text-base text-slate-500 mb-8 max-w-lg mx-auto">
            Download videos from YouTube, X, Facebook, and LinkedIn in the highest quality. Free, fast, and secure.
          </p>

          {/* Mode Toggle (Video / Audio) */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setMode("video")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                mode === "video"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Video className="w-4 h-4" />
              Video (MP4)
            </button>
            <button
              onClick={() => setMode("audio")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                mode === "audio"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Music className="w-4 h-4" />
              Audio (MP3)
            </button>
          </div>

          {/* URL Input */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Link2 className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="Paste video link here (YouTube, X, FB, LinkedIn)..."
              className="w-full pl-12 pr-40 py-4 rounded-2xl border-2 border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-base transition-all outline-none"
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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-4 h-4" />
                  Paste
                </button>
              )}
              <button
                onClick={handleFetch}
                disabled={isProcessing || !url.trim()}
                className="h-full px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
            <div className="w-full md:w-72 aspect-video rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
              <div className="flex gap-3 pt-2">
                <div className="h-12 bg-slate-200 rounded-xl w-40" />
                <div className="h-12 bg-slate-200 rounded-xl w-32" />
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
              <div className="relative w-full md:w-80 flex-shrink-0">
                <div className="aspect-video md:aspect-auto md:h-full relative overflow-hidden bg-slate-900">
                  <img
                    src={result.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  {/* Duration Badge */}
                  {result.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {result.duration}
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                    </div>
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
                  {result.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                {mode === "video" && result.qualities && result.qualities.length > 0 ? (
                  result.qualities.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleDownloadClick(q.url, false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-100 bg-red-50 hover:bg-red-600 hover:border-red-600 hover:text-white rounded-xl text-sm font-bold text-red-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      {q.label}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => handleDownloadClick(getDownloadUrl(), mode === "audio")}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-red-600/20"
                  >
                    <Download className="w-5 h-5" />
                    {mode === "audio" ? "Download Audio" : "Download Video"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        {["No Registration", "No Watermark", "Unlimited Downloads", "All Qualities"].map((feature) => (
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
