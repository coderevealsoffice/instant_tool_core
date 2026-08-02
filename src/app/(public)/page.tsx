import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { CheckCircle2, ChevronRight, Lock, Sparkles, Star, Download, Play, Smartphone, FileCheck, RefreshCw, ImageIcon, Briefcase, Mic } from "lucide-react"
import { HeroSection } from "@/components/home/hero"

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "InstantTool - Free Online PDF, Video, Image & AI Tools",
  description: "Your all-in-one platform for powerful, fast, and free online tools. Edit PDFs, videos, images, and use AI generators directly in your browser.",
  alternates: {
    canonical: "/"
  },
  keywords: ["free online tools", "PDF tools", "image converter", "AI tools", "AEO", "Generative Engine Optimization", "Instant Tool", "No watermark", "Free PDF editor", "Free image compressor", "Free video editor"],
  openGraph: {
    title: "InstantTool - Free Online PDF, Video, Image & AI Tools",
    description: "Your all-in-one platform for powerful, fast, and free online tools. Edit PDFs, videos, images, and use AI generators directly in your browser.",
    url: "/",
    siteName: "InstantTool",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630, alt: "InstantTool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool - Free Online PDF, Video, Image & AI Tools",
    description: "Your all-in-one platform for powerful, fast, and free online tools. Edit PDFs, videos, images, and use AI generators directly in your browser.",
    images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
  }
};

import prisma from "@/lib/prisma/client"

export const revalidate = 3600; // Cache page for 1 hour for ultra-fast TTFB

export default async function HomePage() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: 'asc' }
  });
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InstantTool",
    "url": "https://instant-tool.vercel.app/",
    "description": "Your all-in-one platform for powerful, fast, and free online tools.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://instant-tool.vercel.app/tools?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HeroSection />

      {/* Featured AI Tools */}
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-950">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-bold mb-4">
              NEW & TRENDING
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Supercharge Your Content with AI</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Our most popular AI tools to help you go viral, rank higher, and create faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* AI YouTube Keyword Generator */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/50 shadow-xl shadow-red-100/50 dark:shadow-none hover:border-red-400 dark:hover:border-red-500 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI YouTube Keyword Generator</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Get high-volume, SEO-optimized tags for your videos instantly. Ready to copy-paste into YouTube.
              </p>
              <Link href="/ai-tools/ai-youtube-keyword-generator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Thumbnail Generator */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all overflow-hidden">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Thumbnail Generator</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Generate high-CTR YouTube thumbnail concepts with visual descriptions and hook text.
              </p>
              <Link href="/ai-tools/ai-thumbnail-generator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI LinkedIn Post Generator */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-[#0077b5] transition-all overflow-hidden">
              <div className="w-14 h-14 bg-[#0077b5]/10 rounded-xl flex items-center justify-center mb-6 text-[#0077b5] group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI LinkedIn Post Generator</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Generate a highly engaging LinkedIn text post and 5-slide carousel plan to go viral.
              </p>
              <Link href="/ai-tools/ai-linkedin-post-generator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Podcast Notes Generator */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all overflow-hidden">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Podcast Notes Generator</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Generate professional podcast show notes with summaries, key takeaways, and timestamps.
              </p>
              <Link href="/ai-tools/ai-podcast-notes-generator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* AI Viral Video Caption Generator */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-pink-400 dark:hover:border-pink-500 transition-all overflow-hidden">
              <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-6 text-pink-500 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Viral Video Caption</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Generate viral captions and trending hashtags for Instagram Reels, TikTok, and YouTube Shorts.
              </p>
              <Link href="/ai-tools/ai-video-caption-generator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Remove Background */}
            <div className="relative group rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-emerald-400 dark:hover:border-emerald-500 transition-all overflow-hidden">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Remove Background</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Instantly remove backgrounds from images using advanced AI algorithms in seconds.
              </p>
              <Link href="/ai-tools/remove-background" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold transition-colors w-full">
                Try it now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grouped Tools Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Most Popular Tools</h2>
            <p className="text-slate-600 dark:text-slate-400">Choose from dozens of free tools to manage your files</p>
          </div>

          <div className="space-y-16">
            {TOOL_CATEGORIES.map((category, catIdx) => (
              <div key={category.title}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{category.title}</h3>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.slice(0, 6).map((tool, idx) => (
                    <Link
                      key={`${category.title}-${idx}`}
                      href={tool.href}
                      className="bg-white dark:bg-slate-800 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group border border-slate-200 dark:border-slate-700"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${catIdx === 0 ? "bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400" :
                        catIdx === 1 ? "bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400" :
                          catIdx === 2 ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400" :
                            "bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400"
                        }`}>
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                          {tool.description || `Quickly process your ${tool.name.toLowerCase()} files.`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {category.tools.length > 6 && (
                  <div className="mt-8 text-center">
                    <Link href="/tools" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      See All {category.title} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keep your simple tasks simple */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-24">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Keep your simple tasks simple</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              InstantTool makes it incredibly easy to work with files. We give you all the tools you need, right in your browser, without complicated software.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 md:pr-12 text-center md:text-left">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Work directly on your files</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  Do more than just view files. Highlight and add text, images, shapes, and freehand annotations to your documents. You can connect to 20 other tools to enhance your files further.
                </p>
                <Link href="/tools" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 justify-center md:justify-start">
                  Explore Tools <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 transform rotate-2">
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col p-4">
                    <div className="h-6 w-32 bg-slate-100 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                    <div className="h-20 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 rounded flex items-center justify-center text-blue-500 dark:text-blue-400 mt-4">
                      Text Box
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 md:pl-12 text-center md:text-left">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Digital signatures made easy</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  Fill in forms, e-sign contracts, and close deals in a few simple steps. You can also request e-signatures and track your document's progress.
                </p>
                <Link href="/pdf-tools/sign-pdf" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 justify-center md:justify-start">
                  Explore eSign <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 transform -rotate-2">
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 relative p-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg p-6 w-48 text-center z-10">
                      <div className="w-full h-12 border-b-2 border-slate-900 dark:border-slate-100 font-cursive text-2xl flex items-end justify-center pb-2 dark:text-white">
                        Sign Here
                      </div>
                      <button className="mt-4 bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded w-full">Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 md:pr-12 text-center md:text-left">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Create the perfect document</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  File too big? Compress it. Need a specific format? Convert it. Things getting chaotic? Merge and split files, or remove excess pages. InstantTool has it all.
                </p>
                <Link href="/tools" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 justify-center md:justify-start">
                  Explore Tools <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center gap-4">
                  <div className="w-32 h-40 bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 rounded relative">
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white"><RefreshCw className="w-4 h-4" /></div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  <div className="w-32 h-40 bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 rounded relative">
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 md:pl-12 text-center md:text-left">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Manage documents—all in one place</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  No more working across multiple apps! Save time by storing, managing, and sharing files across devices—straight from our web platform.
                </p>
                <Link href="/tools" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 justify-center md:justify-start">
                  Explore Tools <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 flex overflow-hidden">
                    <div className="w-1/3 border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                    <div className="flex-1 p-4 grid grid-cols-2 gap-2">
                      <div className="bg-slate-100 dark:bg-slate-700 h-16 rounded"></div>
                      <div className="bg-slate-100 dark:bg-slate-700 h-16 rounded"></div>
                      <div className="bg-slate-100 dark:bg-slate-700 h-16 rounded"></div>
                      <div className="bg-slate-100 dark:bg-slate-700 h-16 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Plans & Pricing */}
      <section className="py-24 bg-white dark:bg-slate-950" id="pricing">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Our Pricing Plan</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto text-lg">
            Our pricing plans are affordable and flexible, catering to all budgets. Choose the plan that suits your needs best.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => {
              const isPopular = plan.name.toLowerCase().includes('pro') || idx === 1; // Default to middle card if no 'pro'

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 ${isPopular
                    ? 'bg-[#1C2434] text-white shadow-xl scale-105 z-10'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                >
                  {/* Top section (Header, Price, Button) */}
                  <div className={`p-8 pb-6 border-b ${isPopular ? 'border-slate-700' : 'border-slate-100 dark:border-slate-800'}`}>
                    <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.name} Plan
                    </h3>
                    <p className={`text-sm mb-6 ${isPopular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.description || `Perfect for ${plan.name.toLowerCase()} usage.`}
                    </p>

                    <div className="mb-6 flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        ₹{plan.priceMonthly}
                      </span>
                      <span className={`text-sm ${isPopular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        /month
                      </span>
                    </div>

                    <Link
                      href="/dashboard/billing"
                      className={`block w-full py-3 px-4 rounded-lg font-bold transition-all text-center ${isPopular
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {plan.priceMonthly === 0 ? "Get Started" : "Upgrade Now"}
                    </Link>
                  </div>

                  {/* Features section */}
                  <div className={`p-8 pt-6 flex-1 flex flex-col ${isPopular ? 'bg-[#1C2434]' : 'bg-white dark:bg-slate-900'}`}>
                    <ul className="space-y-4 text-left flex-1">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPopular ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`} />
                        <span className={`text-sm ${isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                          {plan.credits} Credits included
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPopular ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`} />
                        <span className={`text-sm ${isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                          Max file size: {plan.maxFileSizeMB}MB
                        </span>
                      </li>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${isPopular ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`} />
                          <span className={`text-sm ${isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12">Why Choose InstantTool?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Easy To Use</h3>
              <p className="text-slate-600 dark:text-slate-400">Our intuitive interface makes working with files incredibly simple.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Secure & Safe</h3>
              <p className="text-slate-600 dark:text-slate-400">Files are processed securely and deleted automatically from our servers.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Business Trusted</h3>
              <p className="text-slate-600 dark:text-slate-400">Thousands of businesses rely on InstantTool for their daily document needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl relative">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            We make file tools easy.
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            All the tools you'll need to be more productive and work smarter with your files.
          </p>
          <Link href="/tools" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-colors inline-block">
            Start Free Trial
          </Link>

          <div className="absolute right-0 top-0 -z-10 opacity-20">
            <div className="w-64 h-64 bg-yellow-300 dark:bg-yellow-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute left-0 bottom-0 -z-10 opacity-20">
            <div className="w-64 h-64 bg-blue-300 dark:bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
