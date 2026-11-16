import Link from "next/link"
import { 
  LifeBuoy, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  Mail, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"

export const metadata = {
  title: "Help Center & Troubleshooting Guide | InstantTool",
  description: "Browse the InstantTool Help Center for quick troubleshooting, WebAssembly guides, file conversion tips, and official customer support contacts.",
  alternates: {
    canonical: "https://devigo.cloud/help"
  },
  keywords: [
    "InstantTool help", "file tools support", "webassembly troubleshooting", "file conversion help",
    "pdf tools guide", "contact instant tool", "support center"
  ],
  openGraph: {
    title: "Help Center & Troubleshooting Guide | InstantTool",
    description: "Browse the InstantTool Help Center for quick troubleshooting, WebAssembly guides, file conversion tips, and official customer support contacts.",
    url: "https://devigo.cloud/help",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center & Troubleshooting Guide | InstantTool",
    description: "Browse the InstantTool Help Center for quick troubleshooting, WebAssembly guides, file conversion tips, and official customer support contacts.",
  }
};

export default function HelpCenterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why do tools run directly in the browser?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InstantTool utilizes modern WebAssembly (WASM) to process multimedia and PDF files directly on your computer's CPU and GPU, ensuring your files never travel across the internet to third-party server disks."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do if a large file stalls during processing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because processing runs locally inside your browser, ensure you have sufficient available system RAM. Closing inactive browser tabs or restarting your browser often frees memory for large 4K videos or 100+ page PDFs."
        }
      }
    ]
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-16 sm:py-24 px-4 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-6 shadow-2xs border border-emerald-200/60 dark:border-emerald-800/60">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Troubleshooting guides, platform answers, and direct engineering support for all InstantTool browser utilities.
          </p>
        </div>

        {/* Quick Help Portals */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link 
            href="/faqs" 
            className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Platform FAQs</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Detailed answers about file security, browser compatibility, zero watermarks, and free utility access.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:underline">
              Read FAQs →
            </span>
          </Link>

          <Link 
            href="/tutorials" 
            className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Step-by-Step Guides</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Learn how to compress documents without losing resolution, transcode audio, and extract OCR text.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 mt-4 group-hover:underline">
              View Tutorials →
            </span>
          </Link>

          <Link 
            href="/contact" 
            className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Engineering Support</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Report bugs, submit tool suggestions, or inquire about enterprise deployments with 24-hour response SLA.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-4 group-hover:underline">
              Contact Desk →
            </span>
          </Link>
        </div>

        {/* AdSense Placement */}
        <div className="my-10">
          <AdSlot slotId="help-center-banner" />
        </div>

        {/* Top Troubleshooting Topics */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Common Troubleshooting &amp; Tips
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Quick solutions to the most frequent browser file processing questions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                1. Why do tools load an engine on the first run?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                To guarantee 100% privacy and eliminate server data harvesting, our utilities download lightweight WebAssembly (WASM) modules directly into your browser's local sandbox on your first visit. Once loaded, the engine is cached locally for instant future execution.
              </p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                2. What if a file processing task freezes?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Because WebAssembly computations run within your computer's RAM, very large 4K video files or 200+ page scans may encounter browser memory limits if multiple applications are open. Try closing background tabs, reloading the page, or testing in Google Chrome / Apple Safari.
              </p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                3. How do I verify my files aren't being stored?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                You can open your browser's Developer Tools (F12) and inspect the Network tab while running tools like PDF Compressor, Image Crop, or Audio Trim. You will observe that zero payload bytes are transmitted to any remote server disk. Everything executes strictly within client memory.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                4. Can I request a new tool or report an edge case?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Yes! We love hearing from our community. Email our lead engineering desk directly at <a href="mailto:info.techyfe@gmail.com" className="text-emerald-600 dark:text-emerald-400 font-bold underline">info.techyfe@gmail.com</a>. We typically reply within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
