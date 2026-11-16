import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"
import { DEFAULT_LEGAL_PAGES, LEGAL_ALIASES } from "@/lib/legal-pages-data"
import { TOOL_CATEGORIES } from "@/config/menu"
import { toolsRegistry } from "@/lib/tools-registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  Wrench,
  HelpCircle,
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdSlot } from "@/components/common/AdSlot"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

function resolveCategoryInfo(categorySlug: string) {
  const normalized = categorySlug.toLowerCase().trim()
  
  // Find in TOOL_CATEGORIES
  const matchedMenuCat = TOOL_CATEGORIES.find(c => {
    const slug = c.title.toLowerCase().replace(/\s+/g, "-")
    return slug === normalized || (slug.endsWith("-tools") && slug === `${normalized}-tools`) || (normalized.endsWith("-tools") && slug === normalized)
  })

  // Find in toolsRegistry
  const registryCategory = toolsRegistry[normalized]

  if (!matchedMenuCat && !registryCategory) {
    return null
  }

  const title = matchedMenuCat?.title || normalized.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  // Consolidate tools
  const tools: Array<{ name: string; description: string; href: string }> = []
  const seenHrefs = new Set<string>()

  if (matchedMenuCat) {
    matchedMenuCat.tools.forEach(t => {
      if (!seenHrefs.has(t.href)) {
        seenHrefs.add(t.href)
        tools.push({ name: t.name, description: t.description, href: t.href })
      }
    })
  }

  if (registryCategory) {
    Object.entries(registryCategory).forEach(([toolSlug, toolConfig]) => {
      const href = `/${normalized}/${toolSlug}`
      if (!seenHrefs.has(href)) {
        seenHrefs.add(href)
        tools.push({
          name: toolConfig.title,
          description: toolConfig.description,
          href,
        })
      }
    })
  }

  return { title, tools }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams.category
  const canonicalSlug = LEGAL_ALIASES[rawSlug] || rawSlug

  // 1. Check if it's a legal page
  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({
      where: { slug: canonicalSlug },
    }),
    null
  )
  const fallbackLegal = DEFAULT_LEGAL_PAGES[canonicalSlug]
  const legalTitle = dbPage?.title || fallbackLegal?.title

  if (legalTitle) {
    const fullLegalCanonical = `https://devigo.cloud/legal/${canonicalSlug}`
    return {
      title: `${legalTitle} | InstantTool Legal & Compliance`,
      description: `Read the official ${legalTitle} for InstantTool. Learn about our user privacy commitments, zero data retention, and global compliance standards.`,
      alternates: { canonical: fullLegalCanonical },
      openGraph: {
        title: `${legalTitle} | InstantTool Legal & Compliance`,
        description: `Read the official ${legalTitle} for InstantTool. Learn about our user privacy commitments, zero data retention, and global compliance standards.`,
        url: fullLegalCanonical,
        siteName: "InstantTool",
        type: "website",
      },
    }
  }

  // 2. Check if it's a Tool Category
  const catInfo = resolveCategoryInfo(rawSlug)
  if (catInfo) {
    const fullCatCanonical = `https://devigo.cloud/${rawSlug}`
    const catTitle = `Free Online ${catInfo.title} - Fast & Private | InstantTool`
    const catDesc = `Explore free online ${catInfo.title.toLowerCase()}. Fast, private client-side WebAssembly processing with zero watermarks and no registration required.`
    return {
      title: catTitle,
      description: catDesc,
      keywords: [
        catInfo.title,
        `${catInfo.title.toLowerCase()} online`,
        `free ${catInfo.title.toLowerCase()}`,
        "webassembly tools",
        "free online tools",
        "InstantTool"
      ],
      alternates: { canonical: fullCatCanonical },
      openGraph: {
        title: catTitle,
        description: catDesc,
        url: fullCatCanonical,
        siteName: "InstantTool",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: catTitle,
        description: catDesc,
      }
    }
  }

  return { 
    title: "InstantTool - Free Online File & Media Tools",
    alternates: { canonical: `https://devigo.cloud/${rawSlug}` }
  }
}

export default async function DynamicCategoryOrLegalPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.category
  const canonicalSlug = LEGAL_ALIASES[rawSlug] || rawSlug

  // ==========================================
  // CASE A: LEGAL COMPLIANCE PAGE
  // ==========================================
  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({
      where: { slug: canonicalSlug },
    }),
    null
  )
  const fallback = DEFAULT_LEGAL_PAGES[canonicalSlug]
  const pageTitle = dbPage?.title || fallback?.title
  const pageContent = dbPage?.content || fallback?.content

  if (pageTitle && pageContent) {
    const rawUpdatedAt = dbPage?.updatedAt || fallback?.updatedAt || "2026-11-15"
    const pageUpdatedAt = rawUpdatedAt instanceof Date
      ? rawUpdatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : String(rawUpdatedAt)

    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans text-slate-900 dark:text-slate-100">
        <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-8 -ml-3 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-slate-200/90 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Legal &amp; Compliance</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Updated: {pageUpdatedAt}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              {pageTitle}
            </h1>

            <div 
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-bold hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />

            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <span>InstantTool • devigo.cloud</span>
              <div className="flex items-center gap-4">
                <Link href="/legal/privacy-policy" className="hover:text-emerald-500 underline">Privacy Policy</Link>
                <Link href="/legal/terms-of-service" className="hover:text-emerald-500 underline">Terms of Service</Link>
                <Link href="/contact" className="hover:text-emerald-500 underline">Contact Support</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // CASE B: DYNAMIC TOOL CATEGORY HUB
  // ==========================================
  const catInfo = resolveCategoryInfo(rawSlug)
  if (!catInfo || catInfo.tools.length === 0) {
    notFound()
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devigo.cloud"
  const canonicalUrl = `${appUrl}/${rawSlug}`

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": `Free Online ${catInfo.title} - InstantTool`,
        "url": canonicalUrl,
        "description": `Comprehensive directory of free online ${catInfo.title.toLowerCase()} powered by in-browser client-side WebAssembly processing.`,
        "hasPart": catInfo.tools.map(tool => ({
          "@type": "WebApplication",
          "name": tool.name,
          "description": tool.description,
          "url": tool.href.startsWith("http") ? tool.href : `${appUrl}${tool.href}`,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": appUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": catInfo.title,
            "item": canonicalUrl
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-2.5 sm:px-4 py-2.5 sm:py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white font-semibold">{catInfo.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-20 px-2.5 sm:px-4 bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Free &amp; Private Browser Utilities
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-5 leading-tight">
            Free Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">{catInfo.title}</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Fast, secure, and intuitive browser utilities for all your needs. Everything runs locally inside your browser via high-speed WebAssembly — no software downloads, paywalls, or privacy compromises.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Server Storage</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Watermarks</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Unlimited Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-10 sm:py-16 px-2.5 sm:px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Available {catInfo.title}
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                Showing {catInfo.tools.length} high-performance utilities ready to use.
              </p>
            </div>
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {catInfo.tools.length} Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {catInfo.tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group relative flex flex-col justify-between p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5 sm:mb-5 group-hover:scale-110 group-hover:bg-[#D7FB8E] group-hover:text-slate-950 transition-all shadow-2xs">
                    <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 sm:mb-6 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-slate-900 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense In-Category Placement */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <AdSlot slotId="category-middle-banner" />
      </div>

      {/* Educational & Architectural Overview */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-5xl space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
              Modern WebAssembly Architecture for {catInfo.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base mb-4">
              InstantTool re-imagines how digital utilities work. Traditional online conversion portals transmit your sensitive personal files across public networks to remote cloud servers, exposing you to privacy breaches and bandwidth bottlenecks.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              With InstantTool, your calculations execute directly inside your browser using client-side WebAssembly (WASM). Your computer or mobile device handles the processing locally with bank-grade memory safety. As soon as your download completes, all working memory buffers are wiped clean.
            </p>
          </div>

          {/* Three Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <Shield className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Absolute Privacy</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Files and data are processed exclusively inside your browser sandbox. We never store, index, or inspect user content.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <Zap className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Instant In-Memory Speed</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Eliminate upload queues and slow cloud transfers. Take advantage of multi-threaded local CPU acceleration.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <Sparkles className="w-8 h-8 text-sky-500 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">100% Free &amp; Clean</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every tool produces crisp, watermark-free output without forced subscriptions, sign-ups, or hidden daily limits.
              </p>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="pt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How to Use {catInfo.title} Online
            </h3>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed text-sm">
              <li>
                <strong className="text-slate-900 dark:text-white">Choose Your Tool:</strong> Select the specific tool needed from the directory above.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Input or Drag &amp; Drop:</strong> Enter your input, text, or drop your files directly into the client canvas.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Process &amp; Save:</strong> Click process to execute the algorithm in real-time, then copy or download your result with zero watermarks.
              </li>
            </ol>
          </div>

          {/* FAQs */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Are these {catInfo.title.toLowerCase()} completely free?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, 100%. All core utilities on InstantTool are free to use without requiring an account, credit card, or recurring subscription.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Does InstantTool store or upload my files?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. We operate under a strict zero-retention guarantee. Tools run locally using browser APIs and WebAssembly. Your files remain on your own device and are never copied to remote storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Which browsers and operating systems are supported?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  InstantTool runs seamlessly across all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera on macOS, Windows, Linux, iOS, and Android.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/tools" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-sm border border-black/10"
              >
                <span>Explore All 100+ Free Tools</span>
                <span>→</span>
              </Link>
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm tracking-tight transition-all shadow-2xs"
              >
                <span>Read Knowledge Base Guides</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
