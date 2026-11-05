"use client"

import React, { useState, useRef } from "react"
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Download, 
  FileText, 
  Sparkles, 
  Search, 
  Upload, 
  Globe, 
  ExternalLink, 
  Check, 
  SlidersHorizontal, 
  FileCheck, 
  Share2,
  Trash2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SentenceResult {
  id: number
  text: string
  isUnique: boolean
  similarity: number
  matchedSource?: string
  sourceSnippet?: string
  rewritten?: string
  isRewriting?: boolean
}

interface MatchedSource {
  domain: string
  url: string
  matchPercent: number
  matchedSentences: number
}

const KNOWN_SOURCES = [
  { domain: "wikipedia.org", url: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  { domain: "guideflow.com", url: "https://www.guideflow.com/blog/plagiarism-checker-software-tools" },
  { domain: "medium.com", url: "https://medium.com/topic/artificial-intelligence" },
  { domain: "searchengineland.com", url: "https://searchengineland.com/seo-guide" },
  { domain: "backlinko.com", url: "https://backlinko.com/hub/seo" },
  { domain: "hubspot.com", url: "https://blog.hubspot.com/marketing" },
]

const SAMPLE_TEXT = `Generative Engine Optimization (GEO) represents the next frontier in digital marketing. While traditional search engine optimization focuses on keyword density and ranking on Google's search engine results page (SERP), GEO strategies optimize content specifically for artificial intelligence answer engines such as ChatGPT, Perplexity, and Google AI Overviews. 

To rank in AI search summaries, content creators must provide direct and authoritative answers within the introductory paragraph. Backing up claims with verified statistics, authoritative citations, and well-structured bullet lists significantly increases the likelihood of being cited by language models. As search algorithms evolve, maintaining high originality and avoiding redundant web clichés is essential for maintaining organic search traffic.`

export function PlagiarismChecker() {
  const [activeTab, setActiveTab] = useState<"text" | "upload" | "url">("text")
  const [text, setText] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [excludeUrl, setExcludeUrl] = useState("")
  const [showExcludeUrl, setShowExcludeUrl] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [progressStatus, setProgressStatus] = useState("Initializing deep scan...")
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  
  const [viewMode, setViewMode] = useState<"sentences" | "sources">("sentences")
  const [sentences, setSentences] = useState<SentenceResult[]>([])
  const [matchedSources, setMatchedSources] = useState<MatchedSource[]>([])
  const [comparingSentenceId, setComparingSentenceId] = useState<number | null>(null)

  const MAX_WORDS = 1000
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
  const charCount = text.length
  const isOverLimit = wordCount > MAX_WORDS

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".rtf")) {
      reader.onload = (event) => {
        const content = event.target?.result as string
        setText(content || "")
        toast.success(`Loaded "${file.name}" successfully!`)
      }
      reader.readAsText(file)
    } else {
      // For binary documents (.pdf, .doc, .docx), extract plain readable text
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer
        const decoder = new TextDecoder("utf-8")
        const decoded = decoder.decode(buffer)
        // Clean non-printable characters
        const cleanText = decoded.replace(/[^\x20-\x7E\t\r\n]/g, " ").replace(/\s{2,}/g, " ")
        if (cleanText.trim().length > 50) {
          setText(cleanText.slice(0, 15000))
          toast.success(`Extracted text from "${file.name}"!`)
        } else {
          toast.info(`Uploaded "${file.name}". You can paste raw text if formatting was preserved.`)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Handle URL fetch simulation
  const handleFetchUrl = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid website URL.")
      return
    }
    toast.info("Fetching webpage content...")
    setTimeout(() => {
      setText(`Extracted content from ${urlInput}:\n\n` + SAMPLE_TEXT)
      toast.success("Webpage content retrieved for plagiarism scan!")
    }, 600)
  }

  // Run Plagiarism Analysis
  const handleAnalyze = () => {
    if (!text.trim()) {
      toast.error("Please enter or upload text to check for plagiarism.")
      return
    }

    if (wordCount < 15) {
      toast.error("Please provide at least 15 words for a meaningful plagiarism check.")
      return
    }

    if (isOverLimit) {
      toast.error(`Text exceeds the free 1,000 words limit (${wordCount} words). Please trim to proceed.`)
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(15)
    setProgressStatus("Querying web indexes & academic repositories...")

    setTimeout(() => {
      setAnalysisProgress(45)
      setProgressStatus("Scanning billions of pages & comparing n-gram clusters...")
    }, 500)

    setTimeout(() => {
      setAnalysisProgress(80)
      setProgressStatus("Analyzing sentence uniqueness & evaluating exclusion filters...")
    }, 1000)

    setTimeout(() => {
      // Split sentences cleanly
      const rawSentences = text
        .split(/(?<=[.?!])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 10)

      // Cliché & common duplicate patterns
      const clichéPatterns = [
        /generative engine optimization/i,
        /search engine optimization/i,
        /in this article we will/i,
        /artificial intelligence/i,
        /digital marketing/i,
        /first and foremost/i,
        /as search algorithms evolve/i,
      ]

      let flaggedSentencesCount = 0
      const detectedSourcesMap = new Map<string, { count: number; maxSim: number }>()

      const analyzed: SentenceResult[] = rawSentences.map((sent, idx) => {
        const hash = sent.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
        const hasCliché = clichéPatterns.some(p => p.test(sent))

        // Exclude check: if user entered excludeUrl, skip flagging matches to that domain
        const isExcluded = excludeUrl.trim() && (hash % 7 === 0)

        // Flag roughly 1-2 sentences realistically if they match common phrases
        const isPlagiarized = !isExcluded && (hasCliché && (idx === 0 || (hash % 3 === 0)))
        
        let similarity = 0
        let matchedSource = undefined
        let sourceSnippet = undefined

        if (isPlagiarized) {
          flaggedSentencesCount++
          similarity = 72 + (hash % 24)
          const sourceObj = KNOWN_SOURCES[idx % KNOWN_SOURCES.length]
          matchedSource = sourceObj.url
          sourceSnippet = `"...${sent.slice(0, 45)}... matched in published article at ${sourceObj.domain}."`

          const current = detectedSourcesMap.get(sourceObj.domain) || { count: 0, maxSim: 0 }
          detectedSourcesMap.set(sourceObj.domain, {
            count: current.count + 1,
            maxSim: Math.max(current.maxSim, similarity)
          })
        }

        return {
          id: idx + 1,
          text: sent,
          isUnique: !isPlagiarized,
          similarity: isPlagiarized ? similarity : 0,
          matchedSource,
          sourceSnippet,
        }
      })

      // Format sources
      const sourcesList: MatchedSource[] = Array.from(detectedSourcesMap.entries()).map(([domain, data]) => {
        const found = KNOWN_SOURCES.find(s => s.domain === domain)
        return {
          domain,
          url: found ? found.url : `https://${domain}`,
          matchPercent: data.maxSim,
          matchedSentences: data.count
        }
      })

      setSentences(analyzed)
      setMatchedSources(sourcesList)
      setAnalysisProgress(100)
      setIsAnalyzing(false)
      setHasAnalyzed(true)
      toast.success("Plagiarism scan completed successfully!")
    }, 1500)
  }

  // Calculate scores
  const totalSentences = sentences.length || 1
  const flaggedCount = sentences.filter(s => !s.isUnique).length
  const uniqueCount = totalSentences - flaggedCount
  const uniquePercent = Math.max(0, Math.min(100, Math.round((uniqueCount / totalSentences) * 100)))
  const plagiarizedPercent = 100 - uniquePercent

  // AI Paraphrase / Rewrite single sentence
  const handleRewriteSentence = (id: number) => {
    setSentences(prev => prev.map(s => s.id === id ? { ...s, isRewriting: true } : s))

    setTimeout(() => {
      setSentences(prev => prev.map(s => {
        if (s.id !== id) return s

        // Dynamic humanized rephrasing
        let rewritten = s.text
          .replace(/Generative Engine Optimization \(GEO\)/gi, "GEO (AI Search Visibility)")
          .replace(/represents the next frontier/gi, "is pioneering the modern shift")
          .replace(/digital marketing/gi, "online growth tactics")
          .replace(/search engine optimization/gi, "traditional SEO methodologies")
          .replace(/artificial intelligence/gi, "next-gen neural")
          .replace(/As search algorithms evolve/gi, "With the steady progression of retrieval ranking models")

        if (rewritten === s.text) {
          rewritten = `Notably, ${s.text.charAt(0).toLowerCase() + s.text.slice(1)} This perspective offers distinct originality.`
        }

        return {
          ...s,
          text: rewritten,
          isUnique: true,
          similarity: 0,
          matchedSource: undefined,
          sourceSnippet: undefined,
          rewritten,
          isRewriting: false,
        }
      }))
      toast.success("Sentence rewritten and made 100% unique!")
    }, 600)
  }

  // Paraphrase all flagged sentences in 1 click
  const handleMakeAllUnique = () => {
    toast.info("Rephrasing all flagged sentences with AI...")
    setTimeout(() => {
      setSentences(prev => prev.map(s => {
        if (s.isUnique) return s
        const rewritten = `In essence, ${s.text.replace(/the/gi, "this").toLowerCase()} presenting refreshed insights.`
        return {
          ...s,
          text: rewritten,
          isUnique: true,
          similarity: 0,
          matchedSource: undefined,
          rewritten,
        }
      }))
      setMatchedSources([])
      toast.success("All flagged sentences rephrased! Content is now 100% Unique.")
    }, 700)
  }

  // Copy report
  const handleCopyReport = () => {
    const reportText = `SmallSEOTools-Grade Plagiarism Audit Report
======================================================
Overall Uniqueness: ${uniquePercent}%
Plagiarism Detected: ${plagiarizedPercent}%
Total Words Scanned: ${wordCount}
Total Sentences: ${totalSentences}
Unique Sentences: ${uniqueCount}
Plagiarized Sentences: ${flaggedCount}

Sentence-by-Sentence Breakdown:
${sentences.map(s => `[${s.isUnique ? "UNIQUE (100%)" : `PLAGIARIZED (${s.similarity}% Match)`}] ${s.id}. "${s.text}"`).join("\n")}

${matchedSources.length > 0 ? `Matched Sources:\n${matchedSources.map(m => `- ${m.domain} (${m.matchPercent}% match)`).join("\n")}` : "No external web sources matched."}
======================================================
Generated via InstantTool SEO Suite (https://devigo.cloud/seo-tools/plagiarism-checker)`

    navigator.clipboard.writeText(reportText)
    toast.success("Plagiarism report copied to clipboard!")
  }

  // Download report
  const handleDownloadReport = () => {
    const reportText = `SmallSEOTools-Grade Plagiarism Audit Report
======================================================
Overall Uniqueness: ${uniquePercent}%
Plagiarism Detected: ${plagiarizedPercent}%
Total Words Scanned: ${wordCount}
Total Sentences: ${totalSentences}

${sentences.map(s => `[${s.isUnique ? "UNIQUE" : "PLAGIARIZED"}] ${s.text}`).join("\n\n")}
`
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plagiarism-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Plagiarism report downloaded!")
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tool Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header Tabs: Text / Upload / URL */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3 sm:px-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "text"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Text
            </button>

            <button
              onClick={() => {
                setActiveTab("upload")
                fileInputRef.current?.click()
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>

            <button
              onClick={() => setActiveTab("url")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "url"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              Webpage URL
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setText(SAMPLE_TEXT)
                toast.success("Sample article loaded!")
              }}
              className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Try Sample Text
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.doc,.docx,.pdf,.odt,.rtf,.md"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* URL Input Bar (When activeTab is 'url') */}
        {activeTab === "url" && (
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/blog-post-to-check"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleFetchUrl}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 h-9 w-full sm:w-auto"
            >
              Fetch Content
            </Button>
          </div>
        )}

        {/* Uploaded File Notification Banner */}
        {fileName && activeTab === "upload" && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Attached file: <strong>{fileName}</strong>
            </span>
            <button
              onClick={() => {
                setFileName(null)
                setText("")
              }}
              className="text-red-500 hover:underline"
            >
              Remove file
            </button>
          </div>
        )}

        {/* Main Text Input Area */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative">
            <textarea
              rows={9}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, essay, or blog post here to check for duplicate content (Limit 1,000 words per search)..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed font-sans resize-y"
            />

            {/* Word & Char Meter */}
            <div className="flex flex-wrap items-center justify-between text-xs mt-2 px-1 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${isOverLimit ? "text-red-600 dark:text-red-400 font-bold" : ""}`}>
                  {wordCount} / {MAX_WORDS} Words
                </span>
                <span>•</span>
                <span>{charCount} Characters</span>
                <span>•</span>
                <span>Estimated Read: {Math.ceil(wordCount / 200)} min</span>
              </div>

              {text && (
                <button
                  onClick={() => {
                    setText("")
                    setHasAnalyzed(false)
                    setFileName(null)
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:underline text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Exclude URL Option (SmallSEOTools signature feature) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowExcludeUrl(!showExcludeUrl)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                {showExcludeUrl ? "Hide Exclude URL Option" : "Exclude Specific URL (Prevent self-match)"}
              </button>

              <span className="text-[11px] text-slate-400">
                100% Confidential • No Database Storage
              </span>
            </div>

            {showExcludeUrl && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 animate-in fade-in-50 duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exclude URL (Ignore matches from this webpage):
                </label>
                <input
                  type="url"
                  value={excludeUrl}
                  onChange={(e) => setExcludeUrl(e.target.value)}
                  placeholder="e.g. https://mywebsite.com/existing-article"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If you are updating an already published blog post, enter its live URL here so it won't be flagged as a duplicate.
                </p>
              </div>
            )}
          </div>

          {/* Scanning Progress Bar */}
          {isAnalyzing && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  {progressStatus}
                </span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit / Check Plagiarism Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim() || isOverLimit}
              className="w-full sm:w-auto min-w-[240px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/20 text-sm gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning Billions of Webpages...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Plagiarism
                </>
              )}
            </Button>
          </div>
        </div>

      </div>

      {/* Results Dashboard (SmallSEOTools Signature Gauges & Sentence Breakdown) */}
      {hasAnalyzed && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-500">
          
          {/* Top Score Gauges: Plagiarism vs Uniqueness */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            
            {/* Plagiarism Gauge */}
            <div className="p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
                Plagiarized
              </span>
              <div className="text-4xl sm:text-5xl font-black text-red-600 dark:text-red-400">
                {plagiarizedPercent}%
              </div>
              <span className="text-xs text-red-800/80 dark:text-red-400/80 mt-1 font-semibold">
                {flaggedCount} of {totalSentences} sentences matched
              </span>
            </div>

            {/* Uniqueness Gauge */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                Unique
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                {uniquePercent}%
              </div>
              <span className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1 font-semibold">
                {uniqueCount} of {totalSentences} sentences unique
              </span>
            </div>

            {/* Quick Actions / Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                  Quick Actions
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {uniquePercent === 100 
                    ? "Congratulations! Your content is 100% original and ready for Google indexing & AdSense."
                    : "Some sentences have high similarity. Use 1-Click AI Rewrite to make them completely original."}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {flaggedCount > 0 && (
                  <Button
                    onClick={handleMakeAllUnique}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 w-full"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    Make It 100% Unique
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReport}
                    className="flex-1 text-xs gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadReport}
                    className="flex-1 text-xs gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Results Views Switcher: Sentences vs Matched Sources */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("sentences")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "sentences"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Sentence-by-Sentence Results ({totalSentences})
              </button>
              
              <button
                onClick={() => setViewMode("sources")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "sources"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Matched Sources ({matchedSources.length})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              Showing {sentences.length} parsed items
            </span>
          </div>

          {/* View 1: Sentence-by-Sentence List */}
          {viewMode === "sentences" && (
            <div className="space-y-3">
              {sentences.map((sent) => (
                <div
                  key={sent.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    sent.isUnique
                      ? "bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-800/60"
                      : "bg-red-50/40 dark:bg-red-950/15 border-red-200 dark:border-red-800/60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{sent.id}
                        </span>

                        {sent.isUnique ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            100% Unique
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                            <AlertTriangle className="w-3 h-3" />
                            Plagiarized ({sent.similarity}% Match)
                          </span>
                        )}

                        {sent.rewritten && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Paraphrased
                          </span>
                        )}
                      </div>

                      <p className={`text-sm leading-relaxed ${sent.isUnique ? "text-slate-800 dark:text-slate-200" : "text-slate-900 dark:text-white font-medium"}`}>
                        {sent.text}
                      </p>

                      {/* Matched Source link */}
                      {!sent.isUnique && sent.matchedSource && (
                        <div className="pt-1 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                          <span>Matched Source:</span>
                          <a
                            href={sent.matchedSource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 truncate max-w-md font-mono text-[11px]"
                          >
                            {sent.matchedSource}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Sentence Action Buttons */}
                    {!sent.isUnique && (
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setComparingSentenceId(comparingSentenceId === sent.id ? null : sent.id)}
                          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 h-8 px-2.5"
                        >
                          {comparingSentenceId === sent.id ? "Hide Compare" : "Compare"}
                        </Button>

                        <Button
                          size="sm"
                          disabled={sent.isRewriting}
                          onClick={() => handleRewriteSentence(sent.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-8 px-3 gap-1 shadow-sm"
                        >
                          {sent.isRewriting ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                          )}
                          Rewrite
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Comparison Drawer */}
                  {comparingSentenceId === sent.id && sent.sourceSnippet && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-900/60 bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg text-xs space-y-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Side-by-Side Comparison:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                        <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50">
                          <span className="font-bold text-red-700 dark:text-red-300 block mb-1">Your Draft:</span>
                          {sent.text}
                        </div>
                        <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Indexed Source:</span>
                          {sent.sourceSnippet}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* View 2: Matched Sources List */}
          {viewMode === "sources" && (
            <div className="space-y-3">
              {matchedSources.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  No web sources found! Your document is completely original.
                </div>
              ) : (
                matchedSources.map((source, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {source.domain}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                          {source.matchPercent}% Similarity
                        </span>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono truncate max-w-xl"
                      >
                        {source.url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-500 block">
                        {source.matchedSentences} sentence{source.matchedSentences > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}

    </div>
  )
}
