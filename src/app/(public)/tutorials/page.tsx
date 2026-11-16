import Link from "next/link"
import { BookOpen, Video, FileText, ArrowRight, Sparkles, Shield, Cpu, QrCode, Music } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tutorials & Step-by-Step Guides | InstantTool",
  description: "Explore free, step-by-step masterclasses on PDF compression, client-side WebAssembly conversion, video audio extraction, and YouTube SEO optimization.",
  alternates: {
    canonical: "https://devigo.cloud/tutorials"
  },
  keywords: [
    "InstantTool tutorials", "pdf guides", "how to compress pdf", "how to extract audio from video",
    "webassembly tutorials", "how to merge pdfs", "step by step guides"
  ],
  openGraph: {
    title: "Tutorials & Step-by-Step Guides | InstantTool",
    description: "Explore free, step-by-step masterclasses on PDF compression, client-side WebAssembly conversion, video audio extraction, and YouTube SEO optimization.",
    url: "https://devigo.cloud/tutorials",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tutorials & Step-by-Step Guides | InstantTool",
    description: "Explore free, step-by-step masterclasses on PDF compression, client-side WebAssembly conversion, video audio extraction, and YouTube SEO optimization.",
  }
};

const tutorials = [
  {
    title: "How to Compress a PDF Without Losing Quality",
    description: "Learn how to optimize DPI, subset embedded fonts, and reduce document size by up to 85% for email and portal submissions.",
    category: "PDF Tools",
    icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    href: "/blog/how-to-compress-pdf",
    readTime: "8 min read"
  },
  {
    title: "Extracting Audio from Video Files (MP4 to MP3/WAV)",
    description: "Step-by-step tutorial on ripping lossless soundtrack audio from video lectures, interviews, and reels in your browser.",
    category: "Video Tools",
    icon: <Video className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    href: "/blog/extract-audio-from-video",
    readTime: "6 min read"
  },
  {
    title: "Converting Website Images to Next-Gen WebP",
    description: "Drastically reduce page load times and pass Google Core Web Vitals by converting heavy PNG and JPG photos to WebP.",
    category: "Image Tools",
    icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    href: "/blog/convert-images-webp",
    readTime: "7 min read"
  },
  {
    title: "Merging Multiple PDFs into One Clean Document",
    description: "Consolidate invoices, academic papers, and portfolios into a single sequentially numbered PDF on desktop and mobile.",
    category: "PDF Tools",
    icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    href: "/blog/merge-multiple-pdfs",
    readTime: "5 min read"
  },
  {
    title: "Client-Side Privacy: Why WebAssembly Beats Cloud Converters",
    description: "Understand why in-browser WebAssembly processing protects legal contracts, financial audits, and personal media from data leaks.",
    category: "Security & Architecture",
    icon: <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    href: "/blog/client-side-privacy-why-webassembly-beats-cloud-file-converters",
    readTime: "9 min read"
  },
  {
    title: "Mastering YouTube SEO: Keyword Generation & Thumbnails",
    description: "Learn how to discover high-ranking video keywords, write search-optimized descriptions, and craft click-worthy thumbnails.",
    category: "Creators",
    icon: <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    href: "/blog/youtube-seo-and-tag-optimization-handbook",
    readTime: "8 min read"
  },
  {
    title: "Static vs. Dynamic QR Codes: Business Best Practices",
    description: "How to choose between static and dynamic QR codes, configure Reed-Solomon error correction, and ensure print reliability.",
    category: "Business",
    icon: <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    href: "/blog/qr-code-security-best-practices",
    readTime: "6 min read"
  },
  {
    title: "Demystifying Video Compression: H.264, HEVC & Bitrates",
    description: "Understand intra-frame and inter-frame compression, keyframe intervals, and how to shrink video files efficiently.",
    category: "Technology",
    icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    href: "/blog/lossless-video-compression-codecs-guide",
    readTime: "9 min read"
  }
]

export default function TutorialsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-16 md:py-24 px-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
            <span>◆ Knowledge Base & Tutorials</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Master Every Tool with Practical Guides
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Step-by-step masterclasses on digital document security, media compression, WebAssembly architecture, and creative workflows.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {tutorials.map((tutorial, i) => (
            <Link 
              key={i} 
              href={tutorial.href} 
              className="p-8 rounded-3xl bg-[#FAFAFA] dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs">
                      {tutorial.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {tutorial.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{tutorial.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {tutorial.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {tutorial.description}
                </p>
              </div>

              <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 group-hover:translate-x-1 transition-transform">
                Read complete guide <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Help Banner */}
        <div className="mt-16 text-center rounded-3xl p-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Need direct help or have a question?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Browse our Frequently Asked Questions or reach out to our dedicated support engineering team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/faqs" className="inline-flex items-center gap-2 bg-[#D7FB8E] text-slate-950 px-6 py-3 rounded-full font-black hover:bg-[#cbf576] transition-colors shadow-xs">
              View All FAQs →
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
