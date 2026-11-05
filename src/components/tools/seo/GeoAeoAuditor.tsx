"use client"

import React, { useState } from "react"
import { 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  Zap, 
  Target, 
  Share2, 
  Download, 
  ExternalLink,
  Search,
  Check,
  TrendingUp,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AuditMetric {
  title: string
  score: number
  status: "good" | "warning" | "poor"
  description: string
  suggestion: string
}

export function GeoAeoAuditor() {
  const [content, setContent] = useState("")
  const [keyword, setKeyword] = useState("")
  const [isAuditing, setIsAuditing] = useState(false)
  const [hasAudited, setHasAudited] = useState(false)
  const [overallScore, setOverallScore] = useState(0)
  const [metrics, setMetrics] = useState<AuditMetric[]>([])
  const [activeTab, setActiveTab] = useState<"audit" | "simulation">("audit")

  const sampleContent = `# What is Generative Engine Optimization (GEO)?
Generative Engine Optimization (GEO) is the modern strategy of structuring digital content to be directly synthesized, cited, and recommended by generative AI search engines such as ChatGPT Search, Perplexity AI, Google AI Overviews, and Gemini.

Unlike traditional SEO that prioritizes blue links and keyword stuffing, GEO focuses on answer extraction and authoritative factual density. In a 2025 benchmark study across 15,000 queries, content containing verified statistical data and step-by-step bullet points had a 42.7% higher rate of being cited in generative AI answers.

## Key Tactics for GEO Success:
1. Provide a direct, factual answer in the first 40 to 60 words.
2. Include verifiable numbers, research years (e.g., 2025-2026), and data percentages.
3. Structure comparisons into clean tables or markdown lists.
4. Maintain authoritative author citations and clear schema markup.`

  const handleAudit = () => {
    if (!content.trim()) {
      toast.error("Please enter the content you wish to audit for AEO & GEO.")
      return
    }

    setIsAuditing(true)

    setTimeout(() => {
      const words = content.trim().split(/\s+/).filter(Boolean)
      const firstParagraph = content.split(/\n\s*\n/)[0] || ""
      const firstParagraphWords = firstParagraph.trim().split(/\s+/).length

      // 1. Direct Answer Check (Is definition provided early?)
      const hasDefinitionHook = /is\s+(the|a|an|defined\s+as)|refers\s+to|means/i.test(firstParagraph)
      const answerEarlyScore = hasDefinitionHook && firstParagraphWords <= 80 ? 95 : hasDefinitionHook ? 75 : 40

      // 2. Fact & Statistical Density (Numbers, %, $, dates)
      const numberMatches = content.match(/\b\d+(\.\d+)?%?|\$\d+/g) || []
      const factDensityRatio = (numberMatches.length / Math.max(1, words.length)) * 100
      const factScore = factDensityRatio >= 2.0 ? 92 : factDensityRatio >= 1.0 ? 78 : 45

      // 3. Structural Formatting (Bullet points, numbered steps, headings)
      const hasLists = /^(\s*[-*•]|\s*\d+\.)/m.test(content)
      const hasHeadings = /^#{1,4}\s+/m.test(content)
      const structureScore = hasLists && hasHeadings ? 95 : hasLists || hasHeadings ? 70 : 35

      // 4. Citation & Authority Signals (study, according to, research, benchmark)
      const hasCitations = /study|research|according to|benchmark|data|published|survey|report/i.test(content)
      const citationScore = hasCitations ? 90 : 50

      // 5. Keyword Relevance (if provided)
      let keywordScore = 85
      if (keyword.trim()) {
        const regex = new RegExp(keyword.trim(), "gi")
        const count = (content.match(regex) || []).length
        const density = (count / Math.max(1, words.length)) * 100
        keywordScore = density >= 0.8 && density <= 2.5 ? 95 : density > 2.5 ? 60 : 50
      }

      const calculatedOverall = Math.round(
        (answerEarlyScore * 0.3) +
        (factScore * 0.25) +
        (structureScore * 0.25) +
        (citationScore * 0.2)
      )

      const auditResults: AuditMetric[] = [
        {
          title: "Direct Answerability Hook",
          score: answerEarlyScore,
          status: answerEarlyScore >= 80 ? "good" : answerEarlyScore >= 60 ? "warning" : "poor",
          description: "AI crawlers like Perplexity extract the immediate answer from the first 50 words.",
          suggestion: answerEarlyScore >= 80
            ? "Great! You clearly define the core concept right in the introductory paragraph."
            : "Place a concise definition in the first 40-60 words using the 'X is Y' pattern.",
        },
        {
          title: "Fact & Data Density",
          score: factScore,
          status: factScore >= 80 ? "good" : factScore >= 60 ? "warning" : "poor",
          description: "Generative models heavily prioritize content with specific metrics, percentages, and dates.",
          suggestion: factScore >= 80
            ? `Excellent fact density (${numberMatches.length} metrics and statistics detected).`
            : "Add concrete numbers, percentages, dates, or measurements to reinforce statements.",
        },
        {
          title: "Structured Information Layout",
          score: structureScore,
          status: structureScore >= 80 ? "good" : structureScore >= 60 ? "warning" : "poor",
          description: "LLMs parse content with Markdown headings, ordered steps, and bullet lists with higher accuracy.",
          suggestion: structureScore >= 80
            ? "Your content is well-structured with clear headings and list formats."
            : "Organize key takeaways into bullet points or numbered step-by-step guides.",
        },
        {
          title: "Authoritative Citation Signals",
          score: citationScore,
          status: citationScore >= 80 ? "good" : "warning",
          description: "AI models cite content that references verified studies, benchmarks, and research.",
          suggestion: citationScore >= 80
            ? "Contains authoritative citation keywords (studies, reports, benchmarks)."
            : "Reference specific research, surveys, or reputable industry benchmarks.",
        },
      ]

      setOverallScore(calculatedOverall)
      setMetrics(auditResults)
      setIsAuditing(false)
      setHasAudited(true)
      toast.success("AEO & GEO Audit completed!")
    }, 700)
  }

  const handleCopyReport = () => {
    const report = `InstantTool AEO & GEO Content Audit
==============================================
Overall AI Citation Score: ${overallScore}/100
Target Query: ${keyword || "General Concept"}
Evaluation Breakdown:
${metrics.map(m => `- [${m.status.toUpperCase()}] ${m.title}: ${m.score}/100\n  Suggestion: ${m.suggestion}`).join("\n")}
==============================================
Checked with InstantTool GEO Suite (https://devigo.cloud/seo-tools/geo-aeo-auditor)`

    navigator.clipboard.writeText(report)
    toast.success("AEO & GEO report copied to clipboard!")
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Tool Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-fuchsia-500" />
              AEO & GEO Content Auditor (AI Search Optimization)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Optimize your articles to be cited and recommended by ChatGPT Search, Perplexity AI, Google AI Overviews, and Gemini.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContent(sampleContent)
              setKeyword("Generative Engine Optimization")
              toast.success("Loaded GEO benchmark sample!")
            }}
            className="text-xs font-semibold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
            Load GEO Example
          </Button>
        </div>

        {/* Target Keyword Optional Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Target Query / Focus Keyword (Optional)
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., Generative Engine Optimization, What is AEO"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

        {/* Content Input Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Content / Article Body (Markdown or Plain Text)
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to check its AI Answer Engine readiness..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm leading-relaxed font-sans resize-y"
          />
        </div>

        {/* Audit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAudit}
            disabled={isAuditing || !content.trim()}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-fuchsia-500/20 text-base gap-2"
          >
            {isAuditing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Auditing for AI Answer Engines...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run AEO & GEO Audit
              </>
            )}
          </Button>
        </div>

      </div>

      {/* Results Section */}
      {hasAudited && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-6 animate-in fade-in-50 duration-500">
          
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-fuchsia-50 via-purple-50 to-indigo-50 dark:from-fuchsia-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 border border-fuchsia-200 dark:border-fuchsia-800 gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-400">
                AI Citation Readiness Score
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {overallScore >= 80 ? "High AI Citation Probability" : overallScore >= 60 ? "Moderate Citation Potential" : "Needs Optimization for AI Search"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                {overallScore >= 80
                  ? "Your content provides direct definitions and strong factual evidence. Answer engines like Perplexity & ChatGPT are highly likely to cite this article."
                  : "Improve your opening definition and add more concrete statistics or dates to boost AI citation rates."}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-fuchsia-200 dark:border-fuchsia-800 min-w-[120px] shadow-md">
              <span className="text-4xl font-black text-fuchsia-600 dark:text-fuchsia-400">
                {overallScore}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">out of 100</span>
            </div>
          </div>

          {/* Result Tabs: Audit Metrics vs AI Simulation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "audit"
                  ? "bg-fuchsia-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Audit Criteria ({metrics.length})
            </button>
            <button
              onClick={() => setActiveTab("simulation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "simulation"
                  ? "bg-fuchsia-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Perplexity & ChatGPT Citation Simulation
            </button>
          </div>

          {/* Tab 1: Audit Criteria Cards */}
          {activeTab === "audit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {metric.status === "good" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      {metric.title}
                    </span>
                    <span className={`text-xs font-black ${
                      metric.status === "good" ? "text-emerald-600" : "text-amber-500"
                    }`}>
                      {metric.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {metric.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                    <strong className="text-slate-700 dark:text-slate-300">Action: </strong>
                    <span className="text-slate-600 dark:text-slate-400">{metric.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: AI Search Engine Simulation */}
          {activeTab === "simulation" && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 font-sans border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    AI Answer Engine Simulation (Perplexity / ChatGPT Search)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Query: {keyword || "Generative Engine Optimization"}</span>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                  According to sources <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 text-xs font-mono font-bold">[1]</span>,{" "}
                  {content.split(/\n+/)[0]?.replace(/^#+\s*/, "") || "Generative Engine Optimization (GEO)"} represents a shift toward answer extraction. Content structured with direct definition hooks and verifiable benchmarks is cited with higher frequency by neural language models.
                </p>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Citations Referenced by Model:
                  </span>
                  <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                    <span className="font-bold">[1]</span>
                    <span className="truncate">https://devigo.cloud/article/{keyword ? keyword.toLowerCase().replace(/\s+/g, "-") : "geo-guide"}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-sans">
                      Verified Citation Hook
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleCopyReport}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Full AEO Audit Report
            </Button>
          </div>

        </div>
      )}

    </div>
  )
}
