"use client"

import Link from "next/link"
import { 
  ArrowUpRight, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Zap,
  Sliders,
  Maximize2
} from "lucide-react"

// Types for the Sona.ai 3-Column Marquee Showcase
type ShowcaseCard = 
  | {
      type: "tool"
      category: string
      badge: string
      title: string
      description: string
      containerBg: string
      containerText: string
      buttonBg: string
      buttonText?: string
      href: string
      actionText: string
      visual: React.ReactNode
    }
  | {
      type: "photo"
      imageUrl: string
      label: string
      href: string
    }

// ─── COLUMN 1: Scrolls UP ───
const COLUMN_ONE_CARDS: ShowcaseCard[] = [
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    label: "4K Timeline Production",
    href: "/video-tools/trim"
  },
  {
    type: "tool",
    category: "AI TOOLS",
    badge: "◆ MULTI-MODEL SCAN",
    title: "Copyleaks-Grade AI Content Detector",
    description: "Scan multi-engine probabilities across GPT-4o, Claude 3.5, Gemini & DeepSeek.",
    containerBg: "bg-[#0B3B36]",
    containerText: "text-emerald-300",
    buttonBg: "bg-[#0B3B36] hover:bg-[#072c28] text-emerald-200",
    href: "/seo-tools/ai-detector",
    actionText: "Scan Content →",
    visual: (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
            98% Human Content
          </span>
          <span className="text-[10px] text-slate-400 font-mono">0 false positives</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold text-slate-600 dark:text-slate-300">
          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">GPT-4o ✓</div>
          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Claude ✓</div>
          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Gemini ✓</div>
          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">DeepSeek ✓</div>
        </div>
      </div>
    )
  },
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
    label: "UI & Product Design",
    href: "/tools"
  },
  {
    type: "tool",
    category: "PDF SUITE",
    badge: "◆ WEBASSEMBLY ENGINE",
    title: "Annual_Financial_Deck.pdf",
    description: "Lossless vector & font compression directly inside your browser sandbox.",
    containerBg: "bg-[#C3F53C]",
    containerText: "text-slate-900",
    buttonBg: "bg-[#18181B] hover:bg-black text-[#C3F53C]",
    href: "/pdf-tools/compress-pdf",
    actionText: "Compress PDF →",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 line-through font-mono">24.8 MB</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono text-sm">2.1 MB (-91%)</span>
        </div>
        <div className="grid grid-cols-5 gap-1 py-0.5">
          <span className="h-2 rounded bg-emerald-600"></span>
          <span className="h-2 rounded bg-emerald-600"></span>
          <span className="h-2 rounded bg-emerald-600"></span>
          <span className="h-2 rounded bg-emerald-600"></span>
          <span className="h-2 rounded bg-emerald-600"></span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">100% vector fidelity preserved</p>
      </div>
    )
  },
  {
    type: "tool",
    category: "VIDEO STUDIO",
    badge: "◆ FRAME ACCURATE",
    title: "Timeline Video Trimmer",
    description: "Lossless instant clip trimmer with millisecond keyframe accuracy.",
    containerBg: "bg-[#1E1B4B]",
    containerText: "text-indigo-300",
    buttonBg: "bg-[#4338CA] hover:bg-[#3730A3] text-white",
    href: "/video-tools/trim",
    actionText: "Open Video Editor →",
    visual: (
      <div className="space-y-2">
        <div className="h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center px-3 justify-between">
          <div className="flex items-end gap-1 h-5">
            <span className="w-1 bg-indigo-500 h-3 rounded"></span>
            <span className="w-1 bg-indigo-400 h-5 rounded"></span>
            <span className="w-1 bg-indigo-500 h-2.5 rounded"></span>
            <span className="w-1 bg-indigo-300 h-4 rounded"></span>
            <span className="w-1 bg-indigo-400 h-5 rounded"></span>
            <span className="w-1 bg-indigo-500 h-3 rounded"></span>
            <span className="w-1 bg-indigo-300 h-2 rounded"></span>
          </div>
          <span className="text-[10px] font-mono text-indigo-300 font-bold">00:04.2 / 00:30.0</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Reel 9:16 Aspect</span>
          <span className="text-indigo-500 font-semibold">Zero Re-encode</span>
        </div>
      </div>
    )
  }
]

// ─── COLUMN 2: Scrolls DOWN (Middle Column) ───
const COLUMN_TWO_CARDS: ShowcaseCard[] = [
  {
    type: "tool",
    category: "AEO & GEO AUDITOR",
    badge: "◆ CITATION OPTIMIZER",
    title: "Perplexity & ChatGPT Citation Score",
    description: "Score your content for top-ranking citations in AI Overviews.",
    containerBg: "bg-[#0369A1]",
    containerText: "text-sky-200",
    buttonBg: "bg-[#0284C7] hover:bg-[#0369A1] text-white",
    href: "/seo-tools/geo-aeo-auditor",
    actionText: "Audit for AI Citations →",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Citation Probability:</span>
          <span className="text-sm font-black text-sky-600 dark:text-sky-400 font-mono">96 / 100</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full w-[96%] rounded-full"></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Entity Density: <strong className="text-emerald-500">98%</strong></span>
          <span>Ranked <strong className="text-sky-500">#1 Candidate</strong></span>
        </div>
      </div>
    )
  },
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    label: "Growth Marketing Lab",
    href: "/seo-tools/geo-aeo-auditor"
  },
  {
    type: "tool",
    category: "PLAGIARISM SCAN",
    badge: "◆ ACADEMIC CRAWLER",
    title: "Originality & Source Check",
    description: "Scan billions of web pages and scholarly papers with 1 click.",
    containerBg: "bg-[#4C0519]",
    containerText: "text-rose-200",
    buttonBg: "bg-[#BE123C] hover:bg-[#9F1239] text-white",
    href: "/seo-tools/plagiarism-checker",
    actionText: "Verify Originality →",
    visual: (
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5 py-0.5">
          <div className="h-6 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</div>
          <div className="h-6 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</div>
          <div className="h-6 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</div>
          <div className="h-6 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</div>
          <div className="h-6 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">100% Unique Content</span>
          <span className="text-slate-400">0 Reprints</span>
        </div>
      </div>
    )
  },
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    label: "Modern SaaS Workspace",
    href: "/workspace"
  },
  {
    type: "tool",
    category: "PDF TOOLS",
    badge: "◆ 1-CLICK MERGER",
    title: "Combine 4 Client Invoices",
    description: "Organize, reorder pages, and merge multiple documents cleanly.",
    containerBg: "bg-[#064E3B]",
    containerText: "text-emerald-200",
    buttonBg: "bg-[#047857] hover:bg-[#065F46] text-white",
    href: "/pdf-tools/merge-pdf",
    actionText: "Merge Documents →",
    visual: (
      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex -space-x-1.5">
          <div className="w-6 h-8 rounded bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 flex items-center justify-center text-[8px] font-bold text-red-600 shadow-2xs">PDF1</div>
          <div className="w-6 h-8 rounded bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 flex items-center justify-center text-[8px] font-bold text-blue-600 shadow-2xs">PDF2</div>
          <div className="w-6 h-8 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[8px] font-bold text-emerald-600 shadow-2xs">PDF3</div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-900 dark:text-white">48 Pages</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Instant Reorder</p>
        </div>
      </div>
    )
  }
]

// ─── COLUMN 3: Scrolls UP (Right Column) ───
const COLUMN_THREE_CARDS: ShowcaseCard[] = [
  {
    type: "tool",
    category: "AUDIO LAB",
    badge: "◆ STUDIO MASTERING",
    title: "Dialogue & Volume Booster",
    description: "Amplify low-volume recordings up to 200% with true-peak limiter.",
    containerBg: "bg-[#2E1065]",
    containerText: "text-purple-200",
    buttonBg: "bg-[#7E22CE] hover:bg-[#6B21A8] text-white",
    href: "/audio-tools/volume",
    actionText: "Boost Audio →",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center gap-1 justify-between h-7 bg-slate-950 px-2.5 rounded-lg border border-slate-800">
          {[40, 75, 55, 90, 100, 80, 65, 95, 70, 85, 45, 60, 90].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full"
              style={{ height: `${h}%` }}
            ></span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Gain: <strong className="text-purple-400">+150%</strong></span>
          <span className="text-emerald-500 font-bold">Zero Clip</span>
        </div>
      </div>
    )
  },
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
    label: "Podcast Audio Studio",
    href: "/audio-tools/volume"
  },
  {
    type: "tool",
    category: "AI TOOLS",
    badge: "◆ NEURAL CUTOUT",
    title: "Instant Background Remover",
    description: "Isolate subjects and export transparent HD PNGs in 0.8 seconds.",
    containerBg: "bg-[#451A03]",
    containerText: "text-amber-200",
    buttonBg: "bg-[#D97706] hover:bg-[#B45309] text-white",
    href: "/ai-tools/remove-background",
    actionText: "Cut Out Image →",
    visual: (
      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:6px_6px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px]">
            PNG
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-900 dark:text-white">Alpha Mask Active</p>
            <p className="text-[9px] text-slate-500">99.4% Edge Precision</p>
          </div>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
          HD Export
        </span>
      </div>
    )
  },
  {
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    label: "Creative Commons",
    href: "/workspace"
  },
  {
    type: "tool",
    category: "DEV TOOLS",
    badge: "◆ SYNTAX ENGINE",
    title: "JSON Formatter & Validator",
    description: "Format, minify, and inspect JSON structures with zero lag.",
    containerBg: "bg-[#0F172A]",
    containerText: "text-slate-300",
    buttonBg: "bg-[#1E293B] hover:bg-[#334155] text-white",
    href: "/dev-tools/json-formatter",
    actionText: "Format Code →",
    visual: (
      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-emerald-400 leading-snug">
        <div>&#123;</div>
        <div className="pl-2 text-slate-300">&quot;status&quot;: <span className="text-amber-400">200</span>, &quot;speed&quot;: <span className="text-emerald-400">&quot;0.2ms&quot;</span></div>
        <div className="pl-2 text-slate-300">&quot;cached&quot;: <span className="text-cyan-400">true</span></div>
        <div>&#125;</div>
      </div>
    )
  }
]

export function HeroSection() {
  // Helper to render either a Sona-style Tool Card or a Photo Card
  const renderCard = (card: ShowcaseCard, keyPrefix: string) => {
    if (card.type === "photo") {
      return (
        <Link
          key={keyPrefix}
          href={card.href}
          className="group relative block aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={card.label}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle bottom gradient & frosted tag */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="inline-flex items-center justify-between w-full px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase">
              <span>{card.label}</span>
              <ArrowUpRight className="w-3 h-3 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      )
    }

    return (
      <Link
        key={keyPrefix}
        href={card.href}
        className={`group block rounded-2xl ${card.containerBg} p-2.5 sm:p-3 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
      >
        {/* Outer Top Header (Sona Style: Category in bold text) */}
        <div className={`px-1 pb-2 flex items-center justify-between text-[11px] font-black tracking-wider uppercase ${card.containerText}`}>
          <span>{card.category}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        {/* Inner White/Dark Card */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-3.5 space-y-2.5 shadow-xs border border-black/5 dark:border-white/5">
          {/* Tag & Title */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-0.5">
              {card.badge}
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-[13px] leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {card.title}
            </h4>
          </div>

          {/* Micro Visual */}
          <div>
            {card.visual}
          </div>

          {/* Subtext description */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal">
            {card.description}
          </p>

          {/* Sona Action Button */}
          <div className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${card.buttonBg} flex items-center justify-center gap-1.5 shadow-2xs`}>
            <span>{card.actionText}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 px-4 w-full bg-[#FAFAFA] dark:bg-slate-950 overflow-hidden font-sans border-b border-slate-200/70 dark:border-slate-800/60">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sky-500/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ─── LEFT COLUMN: Text, CTA & Value Proposition (Sona style) ─── */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black tracking-wider uppercase mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ◆ 100% Free &amp; Private Tools
            </div>

            {/* Giant Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
              Every tool you need,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                built for speed.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
              InstantTool helps creators and professionals eliminate bloated software. Merge PDFs, trim 4K videos, transcode media, and run Copyleaks-grade AI detection—100% free and private in your browser.
            </p>

            {/* Action Buttons (Sona.ai Dual CTAs: Lime Primary + Outline Secondary) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#C3F53C] hover:bg-[#b5ea30] text-slate-950 font-extrabold text-base transition-all shadow-md shadow-[#C3F53C]/20 hover:scale-[1.02] active:scale-[0.98] group text-center"
              >
                Explore 100+ Free Tools
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/workspace"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base transition-all shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 text-center"
              >
                Open Workspace
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Marks & Ratings */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full max-w-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex text-amber-400 text-sm">
                  ★★★★★
                </div>
                <span>4.9 / 5 rating from 40,000+ creators &amp; pros</span>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Client-side WebAssembly
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Zero server file retention
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  No sign up required
                </span>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: Infinite Scrolling 3-Column Showcase (Sona Style) ─── */}
          <div className="lg:col-span-7 relative h-[640px] lg:h-[700px] overflow-hidden rounded-3xl marquee-container">
            
            {/* Top Gradient Fade Mask */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAFAFA] dark:from-slate-950 via-[#FAFAFA]/80 dark:via-slate-950/80 to-transparent z-20"></div>
            
            {/* Bottom Gradient Fade Mask */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAFAFA] dark:from-slate-950 via-[#FAFAFA]/80 dark:via-slate-950/80 to-transparent z-20"></div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 h-full items-start px-1 sm:px-2">
              
              {/* Column 1: Scrolls UP */}
              <div className="flex flex-col gap-3.5 animate-marquee-up">
                {[...COLUMN_ONE_CARDS, ...COLUMN_ONE_CARDS].map((card, idx) => 
                  renderCard(card, `col1-${idx}`)
                )}
              </div>

              {/* Column 2 (Middle): Scrolls DOWN */}
              <div className="hidden sm:flex flex-col gap-3.5 animate-marquee-down">
                {[...COLUMN_TWO_CARDS, ...COLUMN_TWO_CARDS].map((card, idx) => 
                  renderCard(card, `col2-${idx}`)
                )}
              </div>

              {/* Column 3: Scrolls UP (Offset timing for natural organic flow) */}
              <div className="hidden lg:flex flex-col gap-3.5 animate-marquee-up-alt">
                {[...COLUMN_THREE_CARDS, ...COLUMN_THREE_CARDS].map((card, idx) => 
                  renderCard(card, `col3-${idx}`)
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
