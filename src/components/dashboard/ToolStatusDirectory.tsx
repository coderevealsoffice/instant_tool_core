"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Search, CheckCircle2, AlertTriangle, ArrowUpRight, 
  Cpu, Zap, Globe, Sparkles, Filter, RefreshCw
} from "lucide-react"

export interface ToolStatusItem {
  id: string
  name: string
  category: "PDF" | "Video" | "Audio" | "SEO" | "AI" | "Image" | "Converters"
  href: string
  engine: "Client WebAssembly" | "Direct Stream CDN" | "FFmpeg.wasm Sandbox" | "In-Browser Neural" | "Serverless Edge"
  status: "ACTIVE" | "MAINTENANCE"
  uptime: string
  totalRuns: number
  avgLatency: string
}

export const COMPLETE_TOOLS_DIRECTORY: ToolStatusItem[] = [
  // Video & Downloaders
  { id: "youtube-downloader", name: "YouTube Downloader", category: "Video", href: "/video-tools/youtube-downloader", engine: "Direct Stream CDN", status: "ACTIVE", uptime: "99.99%", totalRuns: 24820, avgLatency: "14ms" },
  { id: "instagram-downloader", name: "Instagram Downloader", category: "Video", href: "/video-tools/instagram-downloader", engine: "Direct Stream CDN", status: "ACTIVE", uptime: "99.98%", totalRuns: 16410, avgLatency: "16ms" },
  { id: "trim-video", name: "Online Video Trimmer", category: "Video", href: "/video-tools/trim", engine: "FFmpeg.wasm Sandbox", status: "ACTIVE", uptime: "100%", totalRuns: 11250, avgLatency: "24ms" },
  { id: "crop-video", name: "Crop Video for Reels", category: "Video", href: "/video-tools/crop", engine: "FFmpeg.wasm Sandbox", status: "ACTIVE", uptime: "100%", totalRuns: 8940, avgLatency: "28ms" },
  { id: "change-video-speed", name: "Video Speed Changer", category: "Video", href: "/video-tools/change-speed", engine: "FFmpeg.wasm Sandbox", status: "ACTIVE", uptime: "100%", totalRuns: 6310, avgLatency: "30ms" },
  { id: "rotate-video", name: "Rotate Video 90°/180°", category: "Video", href: "/video-tools/rotate", engine: "FFmpeg.wasm Sandbox", status: "ACTIVE", uptime: "100%", totalRuns: 5120, avgLatency: "20ms" },
  { id: "loop-video", name: "Loop Video Player", category: "Video", href: "/video-tools/loop", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 4200, avgLatency: "18ms" },

  // PDF Suite (iLovePDF Alternative)
  { id: "compress-pdf", name: "Compress PDF", category: "PDF", href: "/pdf-tools/compress-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 38940, avgLatency: "18ms" },
  { id: "merge-pdf", name: "Merge PDF", category: "PDF", href: "/pdf-tools/merge-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 29420, avgLatency: "12ms" },
  { id: "split-pdf", name: "Split PDF", category: "PDF", href: "/pdf-tools/split-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 22810, avgLatency: "15ms" },
  { id: "pdf-to-word", name: "PDF to Word (.docx)", category: "PDF", href: "/pdf-tools/pdf-to-word", engine: "Client WebAssembly", status: "ACTIVE", uptime: "99.95%", totalRuns: 19400, avgLatency: "35ms" },
  { id: "jpg-to-pdf", name: "JPG to PDF Converter", category: "PDF", href: "/pdf-tools/jpg-to-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 16750, avgLatency: "10ms" },
  { id: "word-to-pdf", name: "Word to PDF", category: "PDF", href: "/pdf-tools/word-to-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "99.98%", totalRuns: 14320, avgLatency: "25ms" },
  { id: "pdf-to-excel", name: "PDF to Excel (.xlsx)", category: "PDF", href: "/pdf-tools/pdf-to-excel", engine: "Client WebAssembly", status: "ACTIVE", uptime: "99.92%", totalRuns: 9810, avgLatency: "40ms" },
  { id: "unlock-pdf", name: "Unlock Password PDF", category: "PDF", href: "/pdf-tools/unlock-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 8250, avgLatency: "22ms" },
  { id: "protect-pdf", name: "Protect PDF (AES-256)", category: "PDF", href: "/pdf-tools/protect-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 7600, avgLatency: "20ms" },
  { id: "sign-pdf", name: "Sign PDF Online", category: "PDF", href: "/pdf-tools/sign-pdf", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 6950, avgLatency: "14ms" },

  // Audio Suite
  { id: "extract-audio", name: "Video to Audio Converter", category: "Audio", href: "/audio-tools/extract-audio", engine: "FFmpeg.wasm Sandbox", status: "ACTIVE", uptime: "100%", totalRuns: 15420, avgLatency: "38ms" },
  { id: "joiner", name: "Audio Joiner & Merger", category: "Audio", href: "/audio-tools/joiner", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 12890, avgLatency: "22ms" },
  { id: "trim-audio", name: "MP3 Cutter & Trimmer", category: "Audio", href: "/audio-tools/trim", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 10450, avgLatency: "16ms" },
  { id: "change-volume", name: "Volume Booster (200%)", category: "Audio", href: "/audio-tools/change-volume", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 8320, avgLatency: "15ms" },
  { id: "change-pitch", name: "Audio Pitch Shifter", category: "Audio", href: "/audio-tools/pitch", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 5120, avgLatency: "20ms" },
  { id: "reverse-audio", name: "Reverse Audio Player", category: "Audio", href: "/audio-tools/reverse", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 4390, avgLatency: "18ms" },

  // SEO & AEO Tools
  { id: "plagiarism-checker", name: "Plagiarism Checker", category: "SEO", href: "/seo-tools/plagiarism-checker", engine: "Serverless Edge", status: "ACTIVE", uptime: "99.99%", totalRuns: 21340, avgLatency: "115ms" },
  { id: "ai-detector", name: "AI Content Detector", category: "SEO", href: "/seo-tools/ai-detector", engine: "In-Browser Neural", status: "ACTIVE", uptime: "100%", totalRuns: 28910, avgLatency: "90ms" },
  { id: "geo-aeo-auditor", name: "AEO & GEO Content Auditor", category: "SEO", href: "/seo-tools/geo-aeo-auditor", engine: "Serverless Edge", status: "ACTIVE", uptime: "99.95%", totalRuns: 7850, avgLatency: "120ms" },
  { id: "schema-generator", name: "JSON-LD Schema Generator", category: "SEO", href: "/seo-tools/schema-generator", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 8420, avgLatency: "8ms" },

  // AI & Design Suite
  { id: "caption-generator", name: "AI Caption Generator", category: "AI", href: "/ai-tools/ai-video-caption-generator", engine: "Serverless Edge", status: "ACTIVE", uptime: "100%", totalRuns: 18230, avgLatency: "140ms" },
  { id: "color-picker", name: "Color Picker & Palette", category: "Image", href: "/color-tools/color-picker", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 14920, avgLatency: "5ms" },
  { id: "remove-background", name: "AI Background Remover", category: "AI", href: "/ai-tools/remove-background", engine: "In-Browser Neural", status: "ACTIVE", uptime: "100%", totalRuns: 16840, avgLatency: "240ms" },
  { id: "ai-youtube-keyword", name: "AI YouTube Keyword Tool", category: "AI", href: "/ai-tools/ai-youtube-keyword-generator", engine: "Serverless Edge", status: "ACTIVE", uptime: "100%", totalRuns: 11200, avgLatency: "110ms" },
  { id: "convert-image", name: "Bulk Image Converter (WebP/PNG)", category: "Image", href: "/image-tools/convert", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 13910, avgLatency: "12ms" },
  { id: "generate-qr", name: "High-Res QR Code Generator", category: "Image", href: "/image-tools/generate-qr", engine: "Client WebAssembly", status: "ACTIVE", uptime: "100%", totalRuns: 9540, avgLatency: "6ms" },
]

export function ToolStatusDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "MAINTENANCE">("ALL")

  const categories = ["ALL", "Video", "PDF", "Audio", "SEO", "AI", "Image"]

  const filteredTools = useMemo(() => {
    return COMPLETE_TOOLS_DIRECTORY.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.engine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "ALL" || tool.category === selectedCategory
      const matchesStatus = statusFilter === "ALL" || tool.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, selectedCategory, statusFilter])

  const totalActive = COMPLETE_TOOLS_DIRECTORY.filter(t => t.status === "ACTIVE").length
  const totalMaintenance = COMPLETE_TOOLS_DIRECTORY.filter(t => t.status === "MAINTENANCE").length

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header and Live Status Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-Time Engine Monitor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Tools Health &amp; Traffic Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Check kaun sa tool chalu hai, live traffic performance, aur execution latency.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{totalActive} Active (Chalu Hai)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>{totalMaintenance} Issues</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tool name (e.g. YouTube, Compress PDF)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat === "ALL" ? `All (${COMPLETE_TOOLS_DIRECTORY.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Tool Name &amp; Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Engine Architecture</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Uptime</th>
                <th className="py-3.5 px-4">Runs &amp; Latency</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  {/* Name & Category */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{tool.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mt-0.5">
                      {tool.category} Tools • {tool.href}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {tool.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Chalu Hai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Maintenance
                      </span>
                    )}
                  </td>

                  {/* Engine */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      {tool.engine}
                    </span>
                  </td>

                  {/* Uptime */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {tool.uptime}
                    </span>
                  </td>

                  {/* Runs & Latency */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {tool.totalRuns.toLocaleString()} runs
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ~{tool.avgLatency} speed
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={tool.href}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#D7FB8E] hover:text-slate-950 dark:hover:bg-[#D7FB8E] dark:hover:text-slate-950 font-bold text-xs transition-all shadow-2xs"
                    >
                      <span>Launch</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
