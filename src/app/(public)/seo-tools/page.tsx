import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { ShieldCheck, Bot, Globe, Hash, Code2, FileCode, BookOpen, Sparkles, ArrowRight, CheckCircle2, Search, Cpu } from "lucide-react"

export const metadata = {
  title: "Free Professional SEO, AEO & GEO Tools | InstantTool",
  description: "Free online suite for Plagiarism Checking, AEO & GEO content auditing, Meta Tag simulation, Keyword Density analysis, and JSON-LD schema generation.",
  alternates: {
    canonical: "https://devigo.cloud/seo-tools"
  },
  keywords: [
    "SEO tools", "plagiarism checker", "AEO tools", "GEO tools", "Generative Engine Optimization",
    "meta tag generator", "keyword density analyzer", "schema generator", "robots.txt generator",
    "readability checker", "InstantTool"
  ]
};

export default function SeoToolsPage() {
  const seoCategory = TOOL_CATEGORIES.find(c => c.title === "SEO Tools");
  
  if (!seoCategory) {
    return <div className="text-center py-20">No SEO Tools found.</div>
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free SEO, AEO & GEO Tools - InstantTool",
    "url": "https://devigo.cloud/seo-tools",
    "description": "Comprehensive suite of free search engine and generative AI optimization tools.",
    "hasPart": seoCategory.tools.map(tool => ({
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "url": `https://devigo.cloud${tool.href}`,
      "applicationCategory": "SEOApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-6 border border-emerald-200 dark:border-emerald-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next-Gen Search & AI Optimization Suite
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Master Traditional <span className="text-emerald-600 dark:text-emerald-400">SEO</span> + Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">AEO & GEO</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Optimize your content for Google Search, ChatGPT, Perplexity, and Gemini. Check plagiarism, audit generative AI answerability, generate meta tags, and build error-free JSON-LD schemas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Free Client-Side Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Generative Engine (GEO) Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant Google SERP Simulator</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Explore All SEO & AI Search Tools
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Select a specialized tool below to test, validate, and optimize your web pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoCategory.tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group relative flex flex-col justify-between p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Tool Online</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section on GEO & AEO */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              What is the Difference Between SEO, AEO, and GEO?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
              Search behavior has evolved. Here is how your optimization strategy must adapt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Classic SEO</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Focuses on Google & Bing ranking algorithms, crawlability, keywords, backlinks, and meta tags to win blue links on search engine result pages (SERPs).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. AEO (Answer Engine)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimizes content for featured snippets, voice search, and knowledge panels by delivering concise, high-clarity answers to direct questions in the opening paragraph.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. GEO (Generative AI)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Prepares articles for synthesis by LLMs (ChatGPT Search, Perplexity, Gemini, Claude) through verifiable data citations, structured steps, and authoritative statistics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

