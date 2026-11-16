import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Sparkles, 
  Star, 
  Download, 
  Play, 
  Smartphone, 
  FileCheck, 
  RefreshCw, 
  ImageIcon, 
  Briefcase, 
  Mic, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck, 
  Cpu, 
  Zap, 
  FileText, 
  Globe, 
  Check, 
  Layers, 
  Code, 
  HardDrive, 
  HelpCircle, 
  Users, 
  BookOpen 
} from "lucide-react"
import { HeroSection } from "@/components/home/hero"
import { BUILTIN_BLOG_POSTS } from "@/lib/blogs-data"
import type { Metadata } from 'next'

export const revalidate = 3600; // Cache page for 1 hour for ultra-fast TTFB

export const metadata: Metadata = {
  title: "InstantTool - Free Online Tools (iLovePDF Alternative, Compress PDF, Video & AI Tools)",
  description: "Free online file tools like iLovePDF: Compress PDF, Merge PDF, Split PDF, PDF to Word, JPG to PDF, Video to Audio Converter, YouTube Downloader, and AI Caption Generator. 100% free, private WebAssembly processing with zero watermarks.",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "ilovepdf",
    "i love pdf alternative",
    "pdf to word",
    "jpg to pdf",
    "word to pdf",
    "compress pdf",
    "merge pdf",
    "split pdf",
    "pdf to excel",
    "pdf editor online",
    "caption generator free",
    "youtube downloader",
    "color picker online",
    "video to audio converter online free",
    "image compressor",
    "audio joiner",
    "joiner",
    "extract audio from video",
    "ai content detector",
    "free online tools",
    "no watermark free tools",
    "InstantTool"
  ],
  openGraph: {
    title: "InstantTool - Free Online Tools (iLovePDF Alternative, Compress PDF, Video & AI)",
    description: "Access 100+ free online tools for PDF editing, video trimming, image optimization, audio conversion, and AI creation. 100% private in-browser processing with zero data retention.",
    url: "/",
    siteName: "InstantTool",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630, alt: "InstantTool - Modern Digital Utilities" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool - Free Online PDF, Video, Image, Audio & AI Tools",
    description: "Private in-browser file utilities. Zero cloud file retention, zero watermarks, and instant WebAssembly performance.",
    images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
  }
};

const FEATURED_ARTICLES = (BUILTIN_BLOG_POSTS || []).slice(0, 4);

export default function HomePage() {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devigo.cloud";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${appBaseUrl}/#website`,
        "url": appBaseUrl,
        "name": "InstantTool",
        "description": "Free, browser-based online PDF, Image, Video, Audio and AI tools. Zero installations, client-side privacy, and high-performance WebAssembly processing.",
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${appBaseUrl}/tools?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${appBaseUrl}/#organization`,
        "name": "InstantTool",
        "url": appBaseUrl,
        "logo": `${appBaseUrl}/favicon.png`,
        "description": "Comprehensive productivity suite providing free, private, client-side tools for PDF manipulation, multimedia processing, image conversion, and AI content creation.",
        "sameAs": [
          "https://twitter.com/instanttool",
          "https://www.linkedin.com/company/instanttool"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "info.techyfe@gmail.com",
          "contactType": "customer service"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are InstantTool tools completely free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all core file manipulation tools—including PDF splitting, merging, compression, image format conversion, audio extraction, and video trimming—are 100% free with zero watermarks, no mandatory account sign-up, and no hidden subscriptions."
            }
          },
          {
            "@type": "Question",
            "name": "How does client-side WebAssembly file processing protect my privacy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike legacy converter portals that upload your sensitive documents to remote servers across the public internet, InstantTool runs optimized WebAssembly binaries directly inside your browser. Your confidential files are processed within your device's RAM memory and never leave your computer or phone."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to install any software or browser extensions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No installation is required. InstantTool operates natively inside modern web browsers across Windows, macOS, Linux, ChromeOS, iOS, and Android devices."
            }
          },
          {
            "@type": "Question",
            "name": "Are my processed files permanently stored on your servers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Because client-side tools execute directly in your browser, your files are never transmitted to our servers. For background batch queues that require server computation, files are encrypted with TLS 1.3 in transit and permanently deleted from RAM immediately upon download."
            }
          },
          {
            "@type": "Question",
            "name": "Does InstantTool add watermarks or reduce output quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Never. All downloaded files retain their original vector clarity, color profiles, and resolution without watermarks, degraded bitrates, or forced compression."
            }
          },
          {
            "@type": "Question",
            "name": "What is the maximum file size supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Client-side tools can process files up to 100MB for PDFs and images, and up to 500MB for media files, constrained only by your device's available browser memory."
            }
          }
        ]
      }
    ]
  };

  const getCategoryHref = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("seo")) return "/seo-tools"
    if (t.includes("video")) return "/video-tools"
    if (t.includes("audio")) return "/audio-tools"
    if (t.includes("pdf")) return "/pdf-tools"
    if (t.includes("image")) return "/image-tools"
    if (t.includes("converter")) return "/converters"
    return "/tools"
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {/* 1. Sona.ai Dynamic Marquee Hero */}
      <HeroSection />

      {/* 2. WebAssembly Client-Side Zero-Retention Security Architecture */}
      <section className="py-10 sm:py-20 px-2 sm:px-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Retention Privacy Architecture</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 sm:mb-3">
              Engineered for Absolute Document Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg leading-relaxed">
              Legacy converter websites upload your confidential legal contracts, personal photos, and sensitive spreadsheets across the internet to unvetted cloud servers. InstantTool fundamentally rethinks file utilities with client-side WebAssembly (WASM).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Card 1 */}
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4 sm:mb-6">
                <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                Client-Side WebAssembly
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                High-performance C++ and Rust compilation algorithms run directly inside your browser's V8 engine. Splitting, merging, and compression execute locally with zero network upload latency.
              </p>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4" /> 100% In-Browser Execution
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center mb-4 sm:mb-6">
                <HardDrive className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                0 MB Cloud Disk Retention
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We maintain an uncompromising zero-storage policy. Documents reside only in temporary volatile RAM memory and are automatically expunged as soon as you close your browser tab or complete your download.
              </p>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4" /> GDPR &amp; HIPAA Compliant Flow
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#D7FB8E]/30 text-slate-950 dark:text-[#D7FB8E] border border-black/5 dark:border-white/10 flex items-center justify-center mb-4 sm:mb-6">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                Cryptographic TLS 1.3
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                For complex AI processing and cloud models, all data in transit is protected with modern TLS 1.3 encryption and 256-bit AES cryptographic handshakes. Zero unencrypted eavesdropping is mathematically possible.
              </p>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted Tunnel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured AI & Creator Suite */}
      <section className="py-12 sm:py-24 bg-gradient-to-b from-white via-purple-50/40 to-white dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 px-2 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-16">
            <span className="inline-block py-1 px-3.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4">
              AI ENGINE &bull; CREATOR OPTIMIZATION
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 sm:mb-3">
              Supercharge Content Creation with AI
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto">
              Production-grade generative AI tools designed to help creators, marketers, and founders optimize workflows, improve search visibility, and scale digital output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* AI YouTube Keyword Generator */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/50 shadow-xl shadow-red-100/30 dark:shadow-none hover:border-red-400 dark:hover:border-red-500 transition-all overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-3 sm:p-4">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 dark:bg-red-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI YouTube Keyword Generator</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Extract high-volume, low-competition tags and search queries calibrated to maximize video rank and suggested impressions.
                </p>
              </div>
              <Link href="/ai-tools/ai-youtube-keyword-generator" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Thumbnail Generator */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI Thumbnail Generator</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Generate high-CTR YouTube thumbnail concepts with visual composition descriptions, color contrast rules, and hook layouts.
                </p>
              </div>
              <Link href="/ai-tools/ai-thumbnail-generator" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI LinkedIn Post Generator */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI LinkedIn Post Generator</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Craft viral LinkedIn narratives, thought-leadership hooks, and structured 5-slide carousels calibrated for professional reach.
                </p>
              </div>
              <Link href="/ai-tools/ai-linkedin-post-generator" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Podcast Notes Generator */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI Podcast Notes Generator</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Turn transcripts into executive show notes, chapter timestamps, key quotes, and action summaries for podcast platforms.
                </p>
              </div>
              <Link href="/ai-tools/ai-podcast-notes-generator" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Viral Video Caption Generator */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI Viral Video Caption</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Generate engaging hooks, captions, and trending hashtags customized for Instagram Reels, YouTube Shorts, and TikTok.
                </p>
              </div>
              <Link href="/ai-tools/ai-video-caption-generator" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Content Detector */}
            <div className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AI Content Detector</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Analyze perplexity and burstiness patterns to identify synthetic AI prose across GPT-4, Claude 3.5, and Gemini with granular metrics.
                </p>
              </div>
              <Link href="/seo-tools/ai-detector" className="inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-sm border border-black/10 transition-all w-full shadow-2xs">
                Try Tool Free <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Tool Categories Directory */}
      <section className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl px-2.5 sm:px-4">
          <div className="text-center mb-8 sm:mb-14">
            <span className="inline-block py-1 px-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wider uppercase mb-3">
              COMPREHENSIVE UTILITY ECOSYSTEM
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
              Explore 100+ Free Online Utilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              High-throughput tools categorized by format and engineering discipline. Everything you need to manipulate, optimize, and convert digital files.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {TOOL_CATEGORIES.map((category, catIdx) => (
              <div key={category.title} className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{category.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Production utilities for {category.title.toLowerCase()} workflows with zero watermark penalties.
                    </p>
                  </div>
                  <Link 
                    href={getCategoryHref(category.title)} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View All {category.title} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {category.tools?.slice(0, 6).map((tool, idx) => (
                    <Link
                      key={`${category.title}-${idx}`}
                      href={tool.href}
                      className="bg-slate-50/70 dark:bg-slate-900/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3 sm:gap-4 group border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
                        catIdx === 0 ? "bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400" :
                        catIdx === 1 ? "bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400" :
                        catIdx === 2 ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400" :
                        "bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400"
                      }`}>
                        {tool.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {tool.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {tool.description || `Fast, private online tool for ${tool.name.toLowerCase()}.`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Real-World Professional & Academic Workflows */}
      <section className="py-10 sm:py-20 px-2.5 sm:px-4 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-14 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-3 border border-emerald-200/80 dark:border-emerald-800">
              REAL-WORLD USE CASES
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
              Engineered for High-Stakes Demands
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg leading-relaxed">
              From academic thesis submissions to corporate legal disclosures, see how diverse professionals streamline their digital pipeline with InstantTool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-7">
            {/* Persona 1 */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Students &amp; Academic Researchers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Combine research chapters, split multi-page journal articles, and compress large dissertation PDFs to meet university portal size caps without breaking vector graphs or mathematical typography.
              </p>
              <div className="pt-2 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 flex-wrap">
                <span>Key Tools:</span>
                <Link href="/pdf-tools/merge-pdf" className="underline hover:text-blue-800">Merge PDF</Link>
                <span>&bull;</span>
                <Link href="/pdf-tools/compress-pdf" className="underline hover:text-blue-800">Compress PDF</Link>
                <span>&bull;</span>
                <Link href="/tutorials" className="underline hover:text-blue-800">Student Guides</Link>
              </div>
            </div>

            {/* Persona 2 */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Legal, Compliance &amp; Finance Teams
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Protect sensitive merger agreements with AES-256 encryption, execute cryptographic digital signatures, and redact private client data locally without violating client-attorney privilege or data protection laws.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 flex-wrap">
                <span>Key Tools:</span>
                <Link href="/pdf-tools/sign-pdf" className="underline hover:text-emerald-800">Sign PDF</Link>
                <span>&bull;</span>
                <Link href="/pdf-tools/protect-pdf" className="underline hover:text-emerald-800">Protect PDF</Link>
                <span>&bull;</span>
                <Link href="/pdf-tools/split-pdf" className="underline hover:text-emerald-800">Split PDF</Link>
              </div>
            </div>

            {/* Persona 3 */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Content Creators &amp; Social Marketers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extract crystal-clear 320kbps MP3 audio from podcast video feeds, optimize WebP cover images for ultra-fast mobile loading, and generate viral short-form captions ready for multi-channel distribution.
              </p>
              <div className="pt-2 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 flex-wrap">
                <span>Key Tools:</span>
                <Link href="/audio-tools" className="underline hover:text-purple-800">Extract Audio</Link>
                <span>&bull;</span>
                <Link href="/image-tools" className="underline hover:text-purple-800">WebP Converter</Link>
                <span>&bull;</span>
                <Link href="/ai-tools" className="underline hover:text-purple-800">Viral Captions</Link>
              </div>
            </div>

            {/* Persona 4 */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                <Code className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Web Developers &amp; DevOps Engineers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Minify production CSS and JavaScript bundles, convert legacy PNGs to next-gen AVIF for Google Core Web Vitals optimization, and validate regular expressions without transmitting code outside your environment.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 flex-wrap">
                <span>Key Tools:</span>
                <Link href="/converters" className="underline hover:text-amber-800">Format Converters</Link>
                <span>&bull;</span>
                <Link href="/seo-tools" className="underline hover:text-amber-800">SEO Audit</Link>
                <span>&bull;</span>
                <Link href="/image-tools" className="underline hover:text-amber-800">Image Compress</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Technical Architecture Comparison Matrix */}
      <section className="py-10 sm:py-20 px-2.5 sm:px-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-b border-slate-200/80 dark:border-slate-800/80 font-sans">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-14">
            <span className="inline-block py-1 px-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wider uppercase mb-3">
              ARCHITECTURAL COMPARISON
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
              InstantTool vs. Legacy Cloud File Sites
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg leading-relaxed">
              Why modern engineering teams and privacy-conscious users are migrating away from traditional server-side conversion portals.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-white font-bold">
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-[11px] sm:text-xs uppercase tracking-wider">Evaluation Metric</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-[11px] sm:text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">InstantTool Architecture</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">Legacy File Sites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  <tr>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-slate-900 dark:text-white">Document Privacy &amp; Transit</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">100% In-Browser WebAssembly (Never Leaves Device)</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-500">Uploaded over public internet to remote third-party servers</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-slate-900 dark:text-white">Cloud Disk Storage Retention</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">0 MB Disk Storage (Wiped from RAM on tab close)</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-500">Stored on server disks for hours or days creating security honeypots</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-slate-900 dark:text-white">Daily File Usage Limits</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">Unlimited Free Core Tools (No daily task caps)</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-500">Strict 2-file cap before demanding aggressive monthly subscriptions</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-slate-900 dark:text-white">Output Watermarks &amp; Branding</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">Zero Watermarks (Clean files ready for commercial use)</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-500">Stamps visible watermarks on free tier downloads</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-slate-900 dark:text-white">Mandatory Registration</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">Zero Sign-Up Required (Instant anonymous access)</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-slate-500">Forces email collection and recurring card commitments</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Featured Knowledge Base Masterclasses & Guides */}
      <section className="py-10 sm:py-20 px-2.5 sm:px-4 bg-white dark:bg-slate-950 font-sans">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Editorial Knowledge Base &bull; 12+ Guides</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Engineering Masterclasses &amp; Guides
              </h2>
            </div>
            <Link 
              href="/blog" 
              className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
            >
              Explore all in-depth articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURED_ARTICLES.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.slug}`} 
                className="group flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">{article.categoryName}</span>
                  <span className="text-slate-400 font-normal">{article.readTime}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-1">
                  Read guide <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. High-Volume SEO Search & Fast Tool Hub (Mobile-Responsive Grid) */}
      <section className="py-10 sm:py-16 px-2.5 sm:px-4 bg-white dark:bg-slate-950 font-sans border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-2xs">
              <span>◆ Popular Online Searches</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">
              Top Searched Tools on InstantTool
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
              One-click access to our highest-ranked online utilities — 100% free with no watermarks or registrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Column 1: PDF Tools (iLovePDF Alternative) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>PDF Utilities (iLovePDF)</span>
                <span className="text-[10px] text-emerald-600 font-mono">Popular</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><Link href="/pdf-tools/compress-pdf" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Compress PDF Online Free</Link></li>
                <li><Link href="/pdf-tools/merge-pdf" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Merge PDF Files (Combine)</Link></li>
                <li><Link href="/pdf-tools/split-pdf" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Split PDF &amp; Extract Pages</Link></li>
                <li><Link href="/pdf-tools/pdf-to-word" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">PDF to Word Converter (.docx)</Link></li>
                <li><Link href="/pdf-tools/jpg-to-pdf" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">JPG to PDF / Image to PDF</Link></li>
                <li><Link href="/pdf-tools/word-to-pdf" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Word to PDF Converter</Link></li>
                <li><Link href="/pdf-tools/pdf-to-excel" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">PDF to Excel (.xlsx)</Link></li>
              </ul>
            </div>

            {/* Column 2: Video & Downloader Tools */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>Video &amp; Downloaders</span>
                <span className="text-[10px] text-sky-600 font-mono">Trending</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><Link href="/video-tools/youtube-downloader" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium block">Free YouTube Video Downloader</Link></li>
                <li><Link href="/video-tools/trim" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium block">Online Video Trimmer &amp; Cutter</Link></li>
                <li><Link href="/audio-tools" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium block">Video to Audio Converter Online</Link></li>
                <li><Link href="/video-tools/crop" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium block">Crop Video for Reels / TikTok</Link></li>
                <li><Link href="/video-tools/speed" className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium block">Video Speed Changer</Link></li>
              </ul>
            </div>

            {/* Column 3: Audio & Speech Tools */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>Audio Tools (Joiner)</span>
                <span className="text-[10px] text-purple-600 font-mono">Hi-Fi</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><Link href="/audio-tools/joiner" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium block">Audio Joiner &amp; Track Merger</Link></li>
                <li><Link href="/audio-tools/trim" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium block">MP3 Cutter &amp; Audio Trimmer</Link></li>
                <li><Link href="/audio-tools/volume" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium block">Volume Booster (200% Gain)</Link></li>
                <li><Link href="/audio-tools/speed" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium block">Change Audio Speed / BPM</Link></li>
                <li><Link href="/audio-tools/reverse" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium block">Reverse Audio Player</Link></li>
              </ul>
            </div>

            {/* Column 4: AI & Creator Tools */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>AI &amp; Design Suite</span>
                <span className="text-[10px] text-emerald-600 font-mono">AI Pro</span>
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><Link href="/ai-tools/ai-video-caption-generator" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Caption Generator Free (AI Hooks)</Link></li>
                <li><Link href="/color-tools/color-palette" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Color Picker Online &amp; Palette</Link></li>
                <li><Link href="/ai-tools/ai-youtube-keyword-generator" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">AI YouTube Keyword Generator</Link></li>
                <li><Link href="/seo-tools/ai-detector" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">AI Content Detector (Copyleaks)</Link></li>
                <li><Link href="/ai-tools/remove-background" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block">Remove Image Background HD</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions (FAQ) */}
      <section className="py-10 sm:py-20 px-2.5 sm:px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 font-sans">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-14">
            <span className="inline-block py-1 px-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wider uppercase mb-3">
              COMMON QUESTIONS
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base md:text-lg">
              Everything you need to know about our privacy architecture, performance guarantees, and free core utilities.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Are InstantTool tools truly free with no hidden charges?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes, completely free. All core utilities—such as PDF splitting, merging, compression, image conversion, video trimming, and QR code generation—require no credit card, no sign-up, and no software installation.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                How does client-side WebAssembly file processing protect my privacy?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional converter sites require uploading your files across the internet to their servers. InstantTool executes modern WebAssembly binaries directly within your local browser sandbox. Your confidential documents are converted inside your computer's RAM and are never transmitted to our servers.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Do you add watermarks or compromise file quality?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Never. We never stamp watermarks, banner ads, or promotional logos onto your exported documents. Your PDFs, videos, and images maintain original vector clarity and high-bitrate resolution.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                What file formats and sizes are supported?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We support all major industry standards: PDF (1.4 through 2.0 and PDF/A), images (JPEG, PNG, WebP, SVG, AVIF, HEIC), media formats (MP4, MKV, MOV, WebM, MP3, WAV, AAC, FLAC), and developer formats (JSON, CSS, HTML, JS). Standard file sizes up to 100MB for documents and 500MB for media are supported directly in-browser.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Does InstantTool work on mobile phones and tablets?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. InstantTool is built with a responsive mobile-first architecture. It functions smoothly on Safari on iOS (iPhones and iPads) and Google Chrome on Android devices without requiring app store installations.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Are my documents retained or used for artificial intelligence training?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Absolutely not. We do not inspect, log, store, or feed user documents into machine learning datasets. When your session ends or you download your file, the browser garbage collector automatically purges the memory allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Section */}
      <section className="py-12 sm:py-20 px-2.5 sm:px-4 text-center bg-white dark:bg-slate-950 font-sans relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>◆ 100% Free &bull; Zero Registration</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            We make file tools fast, private &amp; effortless.
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students, creators, developers, and businesses who process their files securely in their browser without watermarks or paywalls.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/tools" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-xs sm:text-base tracking-tight transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border border-black/10 cursor-pointer"
            >
              <span>Explore All 100+ Tools</span>
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </Link>
            <Link 
              href="/blog" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-base tracking-tight transition-all shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Knowledge Base</span>
            </Link>
          </div>

          <div className="absolute right-0 top-0 -z-10 opacity-20 pointer-events-none">
            <div className="w-72 h-72 bg-emerald-300 dark:bg-emerald-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute left-0 bottom-0 -z-10 opacity-20 pointer-events-none">
            <div className="w-72 h-72 bg-[#D7FB8E] dark:bg-emerald-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
