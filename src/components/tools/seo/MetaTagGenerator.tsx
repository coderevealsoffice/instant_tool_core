"use client"

import React, { useState } from "react"
import { 
  Globe, 
  Copy, 
  Check, 
  Eye, 
  Smartphone, 
  Monitor, 
  Share2, 
  Sparkles,
  Download,
  Code2,
  FileCheck,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const PRESETS = [
  {
    name: "SaaS / Online Tool",
    title: "InstantTool - 100% Free Online Multimedia, PDF & SEO Tools",
    description: "Compress, convert, and edit PDFs, videos, and images with zero watermarks. Check plagiarism and generate SEO schemas directly in your browser.",
    keywords: "online tools, free pdf editor, video compressor, seo tools, instant tool",
    siteName: "InstantTool",
  },
  {
    name: "Blog Post / Article",
    title: "10 Proven Generative Engine Optimization (GEO) Strategies for 2026",
    description: "Discover how to optimize web content for Perplexity AI and ChatGPT Search citations. Complete beginner-to-advanced guide with benchmarks.",
    keywords: "GEO, generative engine optimization, AEO, artificial intelligence search, SEO guide",
    siteName: "InstantTool Blog",
  },
  {
    name: "E-Commerce Product",
    title: "Noise Cancelling Wireless Headphones Pro - Free 2-Day Shipping",
    description: "Experience studio-grade active noise cancellation with 40-hour battery life. Order today for special introductory discount and free returns.",
    keywords: "wireless headphones, noise cancelling headphones, bluetooth audio, buy headphones online",
    siteName: "TechGear Store",
  },
]

export function MetaTagGenerator() {
  const [title, setTitle] = useState(PRESETS[0].title)
  const [description, setDescription] = useState(PRESETS[0].description)
  const [url, setUrl] = useState("https://devigo.cloud/tools")
  const [ogImage, setOgImage] = useState("https://devigo.cloud/favicon.png")
  const [keywords, setKeywords] = useState(PRESETS[0].keywords)
  const [siteName, setSiteName] = useState(PRESETS[0].siteName)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "social">("desktop")
  const [isCopied, setIsCopied] = useState(false)

  // Title character & approximate pixel limits
  const titleLength = title.length
  const titleStatus = titleLength >= 45 && titleLength <= 60 ? "good" : titleLength > 60 ? "warning" : "short"

  // Description character limits
  const descLength = description.length
  const descStatus = descLength >= 130 && descLength <= 160 ? "good" : descLength > 160 ? "warning" : "short"

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">`

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml)
    setIsCopied(true)
    toast.success("Meta tags copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "meta-tags.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Meta tags HTML downloaded!")
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title)
    setDescription(preset.description)
    setKeywords(preset.keywords)
    setSiteName(preset.siteName)
    toast.success(`Loaded "${preset.name}" preset!`)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tool Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 md:p-6 space-y-6">
        
        {/* Top Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-500" />
              SEO Meta Tag Generator & Live Google SERP Simulator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Design high-CTR meta tags with real-time Google search snippet and social card previews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download HTML
            </Button>
            <Button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied!" : "Copy Meta Tags"}
            </Button>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Quick Presets:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form Controls */}
          <div className="space-y-4">
            
            {/* Title Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  SEO Page Title
                </label>
                <span className={`text-xs font-semibold ${
                  titleStatus === "good" ? "text-emerald-500" : titleStatus === "warning" ? "text-red-500" : "text-amber-500"
                }`}>
                  {titleLength} / 60 chars ({titleStatus === "good" ? "Ideal" : titleStatus === "warning" ? "Truncation Risk" : "Short"})
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={`h-full ${titleStatus === "good" ? "bg-emerald-500" : titleStatus === "warning" ? "bg-red-500" : "bg-amber-400"}`}
                  style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Meta Description
                </label>
                <span className={`text-xs font-semibold ${
                  descStatus === "good" ? "text-emerald-500" : descStatus === "warning" ? "text-red-500" : "text-amber-500"
                }`}>
                  {descLength} / 160 chars ({descStatus === "good" ? "Ideal" : descStatus === "warning" ? "Truncation Risk" : "Short"})
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={`h-full ${descStatus === "good" ? "bg-emerald-500" : descStatus === "warning" ? "bg-red-500" : "bg-amber-400"}`}
                  style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                />
              </div>
            </div>

            {/* Canonical URL & Site Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Site / Brand Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Social Image URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                OG Social Image URL (1200x630px recommended)
              </label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Right Column: Live Previews */}
          <div className="space-y-4">
            
            {/* View Switcher */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Snippet Simulation
              </span>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewMode === "desktop"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Google Desktop
                </button>

                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewMode === "mobile"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Google Mobile
                </button>

                <button
                  onClick={() => setPreviewMode("social")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewMode === "social"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Social Card
                </button>
              </div>
            </div>

            {/* 1. Google Desktop Preview */}
            {previewMode === "desktop" && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                    🌐
                  </div>
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">{siteName}</span>
                    <span className="text-[11px] text-slate-500 truncate block max-w-sm">{url}</span>
                  </div>
                </div>

                <h3 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug">
                  {title || "Your Page Title Goes Here"}
                </h3>

                <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">
                  {description || "Your meta description goes here. Make it captivating and include focus keywords to maximize search click-through rate."}
                </p>
              </div>
            )}

            {/* 2. Google Mobile Preview */}
            {previewMode === "mobile" && (
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 shadow-md max-w-sm mx-auto space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-xs">
                    🌐
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-900 dark:text-white block text-xs truncate">{siteName}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{url}</span>
                  </div>
                </div>

                <h3 className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-snug">
                  {title || "Your Page Title Goes Here"}
                </h3>

                <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">
                  {description || "Your meta description goes here. On mobile devices, Google displays roughly 120 characters."}
                </p>
              </div>
            )}

            {/* 3. Social Media Card Preview */}
            {previewMode === "social" && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-md">
                <div className="w-full h-44 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={ogImage}
                    alt="OpenGraph Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                    1200 x 630 OpenGraph Banner
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block truncate">
                    {new URL(url.startsWith("http") ? url : `https://${url}`).hostname}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            )}

            {/* Generated Code Snippet */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Generated HTML Code
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto max-h-48 leading-relaxed border border-slate-800">
                {generatedHtml}
              </pre>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
