"use client"

import React, { useState, useMemo } from "react"
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Copy, 
  Download, 
  Check,
  Zap,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function countSyllables(word: string): number {
  word = word.toLowerCase().trim()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, "")
  word = word.replace(/^y/, "")
  const syllables = word.match(/[aeiouy]{1,2}/g)
  return syllables ? syllables.length : 1
}

export function ReadabilityChecker() {
  const [text, setText] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const sampleText = `Generative Engine Optimization (GEO) is reshaping how creators and brands approach search visibility. Instead of merely aiming for the top of Google search results, modern web content must be structured so that artificial intelligence models can easily synthesize and cite it. 

To improve your readability and SEO rankings, write short, punchy sentences. Avoid jargon where simple words suffice. When explaining complex topics, break ideas into clear paragraphs with descriptive subheadings. This practice keeps human readers engaged while allowing AI crawlers to extract direct answers effortlessly.`

  const stats = useMemo(() => {
    if (!text.trim()) return null

    const words = text.trim().split(/\s+/).filter(Boolean)
    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0)
    const characters = text.replace(/\s+/g, "").length

    const wordCount = words.length
    const sentenceCount = sentences.length || 1

    if (wordCount < 5) return null

    // Syllables calculation
    let totalSyllables = 0
    let complexWords = 0
    words.forEach(w => {
      const syl = countSyllables(w)
      totalSyllables += syl
      if (syl >= 3) complexWords++
    })

    const avgWordsPerSentence = wordCount / sentenceCount
    const avgSyllablesPerWord = totalSyllables / wordCount

    // 1. Flesch Reading Ease Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const fleschEase = Math.round(
      Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)))
    )

    // 2. Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const gradeLevel = parseFloat(
      Math.max(1, (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59).toFixed(1)
    )

    // 3. Gunning Fog Index: 0.4 * ((words/sentences) + 100 * (complexWords / words))
    const gunningFog = parseFloat(
      (0.4 * (avgWordsPerSentence + (100 * (complexWords / wordCount)))).toFixed(1)
    )

    // 4. Overly Long Sentences (> 22 words)
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 22)

    let easeLabel = "Standard / Plain English"
    let audienceTarget = "General Web Readers (8th - 9th Grade)"
    let easeColor = "text-emerald-500"
    if (fleschEase >= 80) {
      easeLabel = "Very Easy / Conversational"
      audienceTarget = "Elementary & Middle School (5th - 6th Grade)"
      easeColor = "text-emerald-500"
    } else if (fleschEase >= 65) {
      easeLabel = "Optimal Web Reading Level"
      audienceTarget = "Broad Public Audience (7th - 8th Grade)"
      easeColor = "text-emerald-500"
    } else if (fleschEase >= 50) {
      easeLabel = "Fairly Difficult"
      audienceTarget = "High School & Professional (10th - 12th Grade)"
      easeColor = "text-amber-500"
    } else {
      easeLabel = "Very Difficult / Academic"
      audienceTarget = "College Graduates & Academic Peers"
      easeColor = "text-red-500"
    }

    return {
      wordCount,
      sentenceCount,
      characters,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
      complexWords,
      complexWordsPct: ((complexWords / wordCount) * 100).toFixed(1),
      fleschEase,
      gradeLevel,
      gunningFog,
      easeLabel,
      audienceTarget,
      easeColor,
      longSentencesCount: longSentences.length,
      longSentences,
    }
  }, [text])

  const handleCopyReport = () => {
    if (!stats) return
    const report = `InstantTool Content Readability & SEO Score Report
===================================================
Flesch Reading Ease: ${stats.fleschEase}/100 (${stats.easeLabel})
Target Audience: ${stats.audienceTarget}
Flesch-Kincaid Grade Level: Grade ${stats.gradeLevel}
Gunning Fog Index: ${stats.gunningFog}

Total Words: ${stats.wordCount}
Total Sentences: ${stats.sentenceCount}
Average Words per Sentence: ${stats.avgWordsPerSentence}
Complex Words: ${stats.complexWords} (${stats.complexWordsPct}%)
Overly Long Sentences (>22 words): ${stats.longSentencesCount}
===================================================
Analyzed at InstantTool SEO Suite (https://devigo.cloud/seo-tools/readability-checker)`

    navigator.clipboard.writeText(report)
    setIsCopied(true)
    toast.success("Readability report copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tool Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-500" />
              Content Readability & SEO Score Auditor
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate Flesch Reading Ease, Flesch-Kincaid Grade Level, and sentence complexity for higher dwell time and lower bounce rate.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText(sampleText)
              toast.success("Sample article text loaded!")
            }}
            className="text-xs font-semibold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            Load Sample
          </Button>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article draft, essay, or blog post here to check readability indexes and sentence flow..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm leading-relaxed font-sans resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0} words | {text.length} characters
            </span>
            {text && (
              <button
                onClick={() => setText("")}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Results Section */}
      {stats && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-500">
          
          {/* Main Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Flesch Reading Ease */}
            <div className="p-5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block mb-1">
                Flesch Reading Ease
              </span>
              <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400">
                {stats.fleschEase}/100
              </div>
              <span className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 mt-1 block">
                {stats.easeLabel}
              </span>
            </div>

            {/* Flesch-Kincaid Grade */}
            <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                US Grade Level
              </span>
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                Grade {stats.gradeLevel}
              </div>
              <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 mt-1 block">
                {stats.audienceTarget}
              </span>
            </div>

            {/* Gunning Fog Index */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Gunning Fog Index
              </span>
              <div className="text-4xl font-black text-slate-900 dark:text-white">
                {stats.gunningFog}
              </div>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                Years of formal education needed
              </span>
            </div>

          </div>

          {/* Deep Content Statistics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Avg Words / Sentence</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{stats.avgWordsPerSentence}</span>
              <span className="text-[10px] text-slate-400 block">(Optimal: 14-18)</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Complex Words (3+ syllables)</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{stats.complexWords}</span>
              <span className="text-[10px] text-slate-400 block">({stats.complexWordsPct}%)</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Total Sentences</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{stats.sentenceCount}</span>
              <span className="text-[10px] text-slate-400 block">in draft</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Long Sentences (&gt;22 words)</span>
              <span className={`text-base font-black ${stats.longSentencesCount > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {stats.longSentencesCount}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {stats.longSentencesCount > 0 ? "Consider splitting" : "Great sentence rhythm"}
              </span>
            </div>
          </div>

          {/* Long Sentences Highlight Box */}
          {stats.longSentencesCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Overly Long Sentences Detected ({stats.longSentencesCount}) - May Increase Mobile Bounce Rate:
              </span>
              <div className="space-y-2 pt-1">
                {stats.longSentences.slice(0, 4).map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    "{s}"
                    <span className="block text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                      Word count: {s.split(/\s+/).length} words
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleCopyReport}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? "Copied!" : "Copy Full Readability Report"}
            </Button>
          </div>

        </div>
      )}

    </div>
  )
}
