import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { AdSlot } from "@/components/common/AdSlot"
import { FileText, CheckCircle2, Shield, Zap, Sparkles, ArrowRight, Lock, Laptop } from "lucide-react"

export const metadata = {
  title: "Free Online PDF Tools - Merge, Split, Compress & Edit | InstantTool",
  description: "The ultimate suite of 18+ free online PDF tools. Merge, split, compress, sign, unlock, and convert PDFs directly in your browser with zero file retention.",
  alternates: {
    canonical: "https://devigo.cloud/pdf-tools"
  },
  keywords: [
    "free PDF tools", "merge PDF", "split PDF", "compress PDF", "sign PDF online",
    "convert PDF to Word", "protect PDF", "PDF to Excel", "WebAssembly PDF editor", "InstantTool"
  ]
};

export default function PDFToolsCategoryPage() {
  const pdfCategory = TOOL_CATEGORIES.find(c => c.title === "PDF Tools");
  const tools = pdfCategory?.tools || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online PDF Tools - InstantTool",
    "url": "https://devigo.cloud/pdf-tools",
    "description": "Comprehensive suite of 18+ client-side WebAssembly PDF tools for merging, splitting, compressing, and editing PDF documents.",
    "hasPart": tools.map(tool => ({
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "url": `https://devigo.cloud${tool.href}`,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Free &amp; Client-Side Secure
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Every PDF Tool You Need, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Directly in Your Browser
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Compress, merge, split, sign, convert, and protect your digital documents without software downloads or file size paywalls. Powered by client-side WebAssembly for unmatched privacy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Server Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>WebAssembly Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Watermarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Explore All 18+ Free PDF Tools
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Select a specialized tool below to manipulate, convert, and optimize your PDF files in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="group relative flex flex-col justify-between p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D7FB8E] group-hover:text-slate-950 transition-all shadow-2xs">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-slate-900 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <AdSlot slotId="pdf-category-middle-slot" />
      </div>

      {/* Authoritative Editorial Content & EEAT Guide */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              Comprehensive PDF Document Processing for Modern Teams
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-4">
              Portable Document Format (PDF) files are the universal standard for business contracts, legal affidavits, financial statements, and academic research papers. However, traditional desktop PDF editors often demand costly recurring subscriptions, intrusive software installations, or upload your sensitive documents to remote third-party cloud servers.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              InstantTool eliminates these barriers by bringing enterprise-grade PDF operations directly into your modern web browser. Leveraging high-performance WebAssembly (Wasm) and sandboxed memory processing, our tools allow you to split chapters, compress file sizes, sign agreements, and convert documents in real time without leaving your device.
            </p>
          </div>

          {/* Three Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Shield className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Zero File Retention</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Client-side tools execute directly inside your browser sandbox. Your confidential business numbers and signatures never touch an external database.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Zap className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Instant Execution</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                By bypassing slow server uploads, operations like compression and splitting take milliseconds rather than minutes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Laptop className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Universal Compatibility</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimized across Chrome, Safari, Edge, and mobile browsers on iOS and Android with identical desktop-class performance.
              </p>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="pt-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How to Process Your PDF Files in 3 Simple Steps
            </h3>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed text-sm">
              <li>
                <strong className="text-slate-900 dark:text-white">Choose Your Tool:</strong> Select the exact task needed—such as <em>Compress PDF</em> to reduce email attachments or <em>Merge PDF</em> to unify multiple chapters.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Select or Drag Your Files:</strong> Drop your PDF files into the secure canvas. All file rendering is handled with sub-second responsiveness.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Process &amp; Download:</strong> Configure custom parameters (compression level, page numbers, signature placement) and click Download to save your final document immediately.
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
                  Are these PDF tools completely free with no hidden charges?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, every PDF tool in this category is 100% free for daily document processing. There are no watermarks placed on your exported files and no credit card is required.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Does InstantTool store or read my sensitive uploaded documents?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. We operate on a strict Zero-Knowledge and Zero-Retention privacy policy. WebAssembly-powered tools execute computations exclusively within your browser’s local memory sandbox, ensuring your files never travel across the internet.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Will compressing my PDF reduce text readability or vector quality?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our compression engine uses lossless font subsetting and smart image re-sampling. Vector graphics and text remain crisp and searchable while unnecessary metadata and uncompressed image bytes are discarded.
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-900 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-medium text-base tracking-tight transition-all shadow-2xs hover:border-black dark:hover:border-white"
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
