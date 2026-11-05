"use client"

import React, { useState, useMemo, useRef } from "react"
import { 
  Hash, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  BarChart2, 
  BookOpen, 
  Layers, 
  Download, 
  Copy, 
  Upload, 
  Trash2,
  PieChart,
  FileCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
  "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
  "your", "yours", "yourself", "yourselves"
])

export function KeywordDensityAnalyzer() {
  const [text, setText] = useState("")
  const [filterStopWords, setFilterStopWords] = useState(true)
  const [ngramTab, setNgramTab] = useState<1 | 2 | 3>(1)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleText = `Search engine optimization and Generative Engine Optimization are crucial for modern websites. To rank on Google search and AI answer engines, you need high quality content. Keyword density should be natural, avoiding keyword stuffing. High keyword density can trigger search engine penalties. A good keyword density is generally between 1% and 2.5% for focus keywords. Use semantic keywords, LSI terms, and helpful explanations to improve your search engine rankings and AI citation probability.`

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setText(content || "")
      toast.success(`Loaded "${file.name}" successfully!`)
    }
    reader.readAsText(file)
  }

  // Analysis computation
  const analysis = useMemo(() => {
    if (!text.trim()) return null

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1)

    const totalWords = words.length
    if (totalWords === 0) return null

    // Unique words
    const uniqueWords = new Set(words).size
    const lexicalDiversity = Math.round((uniqueWords / totalWords) * 100)

    // Unigrams (1-word)
    const unigrams: Record<string, number> = {}
    words.forEach(w => {
      if (filterStopWords && STOP_WORDS.has(w)) return
      unigrams[w] = (unigrams[w] || 0) + 1
    })

    // Bigrams (2-word)
    const bigrams: Record<string, number> = {}
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i]
      const w2 = words[i + 1]
      if (filterStopWords && (STOP_WORDS.has(w1) || STOP_WORDS.has(w2))) continue
      const phrase = `${w1} ${w2}`
      bigrams[phrase] = (bigrams[phrase] || 0) + 1
    }

    // Trigrams (3-word)
    const trigrams: Record<string, number> = {}
    for (let i = 0; i < words.length - 2; i++) {
      const w1 = words[i]
      const w2 = words[i + 1]
      const w3 = words[i + 2]
      if (filterStopWords && (STOP_WORDS.has(w1) || STOP_WORDS.has(w3))) continue
      const phrase = `${w1} ${w2} ${w3}`
      trigrams[phrase] = (trigrams[phrase] || 0) + 1
    }

    const sortDict = (dict: Record<string, number>) =>
      Object.entries(dict)
        .map(([kw, count]) => ({
          keyword: kw,
          count,
          density: parseFloat(((count / totalWords) * 100).toFixed(2)),
          isStuffing: ((count / totalWords) * 100) > 3.0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15)

    // Intent detection
    let informationalScore = 0
    let transactionalScore = 0
    let commercialScore = 0

    const lower = text.toLowerCase()
    if (/(how to|what is|guide|tutorial|tips|learn|steps|explained)/i.test(lower)) informationalScore += 4
    if (/(buy|price|pricing|download|get|subscribe|sign up|order|cost)/i.test(lower)) transactionalScore += 4
    if (/(best|top|review|vs|comparison|alternative|features)/i.test(lower)) commercialScore += 4

    const totalIntentWeight = Math.max(1, informationalScore + transactionalScore + commercialScore)
    const infoPct = Math.round((informationalScore / totalIntentWeight) * 100) || 60
    const commPct = Math.round((commercialScore / totalIntentWeight) * 100) || 25
    const transPct = Math.max(0, 100 - infoPct - commPct)

    let detectedIntent = "Informational (Educational & Explanatory)"
    if (transactionalScore > informationalScore && transactionalScore >= commercialScore) {
      detectedIntent = "Transactional (Action & Conversion Oriented)"
    } else if (commercialScore > informationalScore) {
      detectedIntent = "Commercial Investigation (Comparison & Review Oriented)"
    }

    return {
      totalWords,
      uniqueWords,
      lexicalDiversity,
      detectedIntent,
      intentBreakdown: { infoPct, commPct, transPct },
      unigrams: sortDict(unigrams),
      bigrams: sortDict(bigrams),
      trigrams: sortDict(trigrams),
    }
  }, [text, filterStopWords])

  const currentList = ngramTab === 1 ? analysis?.unigrams : ngramTab === 2 ? analysis?.bigrams : analysis?.trigrams

  const handleExportCsv = () => {
    if (!analysis) return
    const rows = [
      ["Keyword Phrase", "Frequency", "Density (%)", "Stuffing Warning"],
      ...(currentList || []).map(k => [k.keyword, k.count, `${k.density}%`, k.isStuffing ? "Yes (>3%)" : "No"])
    ]
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `keyword-density-${ngramTab}word-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Keyword density exported to CSV!")
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tool Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 md:p-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Hash className="w-6 h-6 text-amber-500" />
              Keyword Density & Search Intent Analyzer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Extract 1-word, 2-word, and 3-word phrase frequencies, detect search intent, and avoid keyword stuffing penalties.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-amber-500" />
              Upload Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setText(sampleText)
                toast.success("Sample text loaded!")
              }}
              className="text-xs font-semibold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Sample
            </Button>
          </div>
        </div>

        {/* Uploaded File Banner */}
        {fileName && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-2 font-medium">
              <FileCheck className="w-4 h-4 text-amber-600" />
              Loaded document: <strong>{fileName}</strong>
            </span>
            <button
              onClick={() => {
                setFileName(null)
                setText("")
              }}
              className="text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content or article here to analyze keyword densities and search intent..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y leading-relaxed font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filterStopWords}
                onChange={(e) => setFilterStopWords(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              Filter common stop words (a, the, in, and, etc.)
            </label>

            {text && (
              <button
                onClick={() => {
                  setText("")
                  setFileName(null)
                }}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Text
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-500">
          
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Words
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {analysis.totalWords}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Unique Words
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {analysis.uniqueWords}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Vocabulary Diversity
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {analysis.lexicalDiversity}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Detected Intent
              </span>
              <div className="text-sm font-black text-amber-600 dark:text-amber-400 truncate mt-1">
                {analysis.detectedIntent.split(" ")[0]}
              </div>
              <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 block mt-0.5">
                Target Google SERP
              </span>
            </div>
          </div>

          {/* Search Intent Distribution Meter */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Search Intent Breakdown:</span>
              <span className="text-slate-500 font-normal">Primary: {analysis.detectedIntent}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
              <div 
                className="bg-blue-500 h-2.5" 
                style={{ width: `${analysis.intentBreakdown.infoPct}%` }}
                title={`Informational: ${analysis.intentBreakdown.infoPct}%`}
              />
              <div 
                className="bg-amber-500 h-2.5" 
                style={{ width: `${analysis.intentBreakdown.commPct}%` }}
                title={`Commercial: ${analysis.intentBreakdown.commPct}%`}
              />
              <div 
                className="bg-emerald-500 h-2.5" 
                style={{ width: `${analysis.intentBreakdown.transPct}%` }}
                title={`Transactional: ${analysis.intentBreakdown.transPct}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Informational ({analysis.intentBreakdown.infoPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Commercial ({analysis.intentBreakdown.commPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Transactional ({analysis.intentBreakdown.transPct}%)
              </span>
            </div>
          </div>

          {/* N-Gram Selector Tabs + Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setNgramTab(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  ngramTab === 1
                    ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                1-Word Keywords ({analysis.unigrams.length})
              </button>

              <button
                onClick={() => setNgramTab(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  ngramTab === 2
                    ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                2-Word Phrases ({analysis.bigrams.length})
              </button>

              <button
                onClick={() => setNgramTab(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  ngramTab === 3
                    ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                3-Word Long-Tail ({analysis.trigrams.length})
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs gap-1.5 border-slate-300 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>

          {/* Keywords Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-2">Keyword Phrase</th>
                  <th className="pb-3 text-center">Frequency</th>
                  <th className="pb-3 text-center">Density</th>
                  <th className="pb-3 text-right pr-2">SEO Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {currentList && currentList.length > 0 ? (
                  currentList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 pl-2 font-medium text-slate-900 dark:text-white capitalize">
                        {item.keyword}
                      </td>
                      <td className="py-2.5 text-center text-slate-600 dark:text-slate-300 font-mono">
                        {item.count}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`font-mono font-bold ${
                          item.isStuffing ? "text-red-500 font-bold" : "text-slate-900 dark:text-white"
                        }`}>
                          {item.density}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-2">
                        {item.isStuffing ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            Stuffing Risk (&gt;3%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                      No phrases found matching current stopword filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  )
}
