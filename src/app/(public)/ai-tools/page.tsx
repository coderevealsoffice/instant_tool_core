import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { AdSlot } from "@/components/common/AdSlot"
import { Bot, Sparkles, CheckCircle2, Shield, Zap, ArrowRight, Brain, Cpu, Wand2 } from "lucide-react"

export const metadata = {
  title: "Free Online AI Tools - Writers & Detectors | InstantTool",
  description: "Supercharge your workflow with 10+ free AI tools. Detect AI content, summarize transcripts, enhance images, and audit content for GEO and AEO citations.",
  alternates: {
    canonical: "https://devigo.cloud/ai-tools"
  },
  keywords: [
    "free AI tools", "AI detector", "AI content optimizer", "GEO optimization",
    "AEO tools", "AI text summarizer", "AI image enhancer", "caption generator free", "InstantTool"
  ],
  openGraph: {
    title: "Free Online AI Tools - Writers & Detectors | InstantTool",
    description: "Supercharge your workflow with 10+ free AI tools. Detect AI content, summarize transcripts, enhance images, and audit content for GEO and AEO citations.",
    url: "https://devigo.cloud/ai-tools",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online AI Tools - Writers & Detectors | InstantTool",
    description: "Supercharge your workflow with 10+ free AI tools. Detect AI content, summarize transcripts, enhance images, and audit content for GEO and AEO citations.",
  }
};

export default function AiToolsPage() {
  const aiCategory = TOOL_CATEGORIES.find(c => c.title === "AI Tools");
  const tools = aiCategory?.tools || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online AI Tools - InstantTool",
    "url": "https://devigo.cloud/ai-tools",
    "description": "Comprehensive suite of free artificial intelligence tools for writing, detection, summarizing, and generative engine optimization.",
    "hasPart": tools.map(tool => ({
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description || "Free AI utility for high-speed automated workflows.",
      "url": `https://devigo.cloud${tool.href}`,
      "applicationCategory": "AIApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-fuchsia-50/60 via-white to-white dark:from-fuchsia-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-800 dark:text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-6 border border-fuchsia-200 dark:border-fuchsia-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
            Next-Gen Multi-Model AI Suite
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Intelligent AI Tools, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500">
              Built for Modern Creators
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Copyleaks-grade AI detection, YouTube video summarization, background isolation, and Generative Engine Optimization (GEO). Unlock 100% free AI automation without token credit traps.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />
              <span>Multi-Model Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />
              <span>Generative Search (GEO) Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-500" />
              <span>100% Free Daily Usage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Explore All AI Utilities
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Choose an AI tool below to accelerate your research, content analysis, and visual editing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group relative flex flex-col justify-between p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-fuchsia-400 dark:hover:border-fuchsia-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D7FB8E] group-hover:text-slate-950 transition-all shadow-2xs">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.description || "High-precision AI utility powered by next-generation neural models."}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-slate-900 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <AdSlot slotId="ai-category-middle-slot" />
      </div>

      {/* Authoritative Editorial Content & EEAT Guide */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              Ethical, Transparent, and Private AI Workflows
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-4">
              Artificial Intelligence has transformed how authors write, marketers research, and software engineers debug. However, with the rise of AI-generated content across the internet, search engines like Google and answer engines like Perplexity, ChatGPT Search, and Gemini require higher standards of original reporting, depth, and human authority (EEAT).
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              InstantTool provides tools designed for transparency and Generative Engine Optimization (GEO). Rather than replacing human creativity with low-quality robotic text, our AI suite empowers you to detect synthetic patterns, extract executive summaries from lengthy interviews, and audit your web pages so they are accurately cited as authoritative primary sources across AI answer engines.
            </p>
          </div>

          {/* Three Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Brain className="w-8 h-8 text-fuchsia-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Multi-Model Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Scan content probabilities against GPT-4o, Claude 3.5 Sonnet, Gemini 1.5, and DeepSeek to eliminate false positives and ensure natural human tone.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Shield className="w-8 h-8 text-fuchsia-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Zero Training Data Use</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your submitted text and confidential materials are never stored or used to train third-party public AI foundation models.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Zap className="w-8 h-8 text-fuchsia-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Generative Engine Optimization</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Audit semantic density and structured quotation patterns to win direct source citations in Google AI Overviews and ChatGPT responses.
              </p>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="pt-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How to Leverage AI Tools for Maximum Productivity
            </h3>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed text-sm">
              <li>
                <strong className="text-slate-900 dark:text-white">Select Your Use Case:</strong> Pick from AI Content Detection, YouTube Transcript Summarization, Background Removal, or AEO Content Auditing.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Provide Your Input:</strong> Paste your article text or enter a media URL. Our stream-based processing gives instant feedback without long queuing times.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Analyze &amp; Refine:</strong> Review detailed probability heatmaps, sentence-by-sentence perplexity scores, and export actionable insights immediately.
              </li>
            </ol>
          </div>

          {/* Frequently Asked Questions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  How accurate is the AI Content Detector?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our detector analyzes statistical perplexity and burstiness across multiple LLM token distribution patterns. By cross-checking multiple models simultaneously, it achieves 98%+ precision with industry-low false positive rates on human-authored articles.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  What is Generative Engine Optimization (GEO)?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  GEO is the modern practice of formatting content, factual claims, and structured schema so that LLM-driven search engines (like Perplexity AI, ChatGPT Search, and Google AI Overviews) quote your website as the primary authoritative answer for user queries.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Is my data private when using AI tools?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes. All API requests use zero-data retention endpoints. Content is processed in volatile memory and purged immediately after the response is returned to your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Dual CTA */}
          <div className="pt-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-medium text-base tracking-tight transition-all shadow-sm border border-black/10"
              >
                <span>Start Free Workspace</span>
                <span className="text-slate-950">↗</span>
              </Link>
              <Link 
                href="/tools" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-medium text-base tracking-tight transition-all shadow-2xs hover:border-black dark:hover:border-white"
              >
                <span>View All 100+ Tools</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
