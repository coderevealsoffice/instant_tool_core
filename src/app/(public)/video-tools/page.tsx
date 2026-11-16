import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"
import { AdSlot } from "@/components/common/AdSlot"
import { Video, CheckCircle2, Shield, Zap, Sparkles, ArrowRight, Laptop, Film, Scissors } from "lucide-react"

export const metadata = {
  title: "Free Online Video Editor & Downloader Tools | InstantTool",
  description: "Professional video editing tools in your browser. Trim, crop, merge, compress, and convert videos easily without watermarks or software installation.",
  alternates: {
    canonical: "https://devigo.cloud/video-tools"
  },
  keywords: [
    "free video tools", "video editor online", "trim video", "merge video", "crop video",
    "youtube downloader free", "download video", "screen recorder", "video to audio", "InstantTool"
  ],
  openGraph: {
    title: "Free Online Video Editor & Downloader Tools | InstantTool",
    description: "Professional video editing tools in your browser. Trim, crop, merge, compress, and convert videos easily without watermarks or software installation.",
    url: "https://devigo.cloud/video-tools",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Video Editor & Downloader Tools | InstantTool",
    description: "Professional video editing tools in your browser. Trim, crop, merge, compress, and convert videos easily without watermarks or software installation.",
  }
};

export default function VideoToolsCategoryPage() {
  const videoCategory = TOOL_CATEGORIES.find(c => c.title === "Video Tools");
  const tools = videoCategory?.tools || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Video Editor & Tools - InstantTool",
    "url": "https://devigo.cloud/video-tools",
    "description": "Comprehensive suite of client-side browser video editing tools for trimming, cropping, merging, and converting multimedia clips.",
    "hasPart": tools.map(tool => ({
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "url": `https://devigo.cloud${tool.href}`,
      "applicationCategory": "MultimediaApplication",
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
            Professional Browser Video Suite
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Edit, Trim &amp; Convert Videos <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Without Watermarks
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Perform precision trimming, video splicing, aspect ratio cropping, speed adjustment, and audio replacement directly in your browser. Fast, private, and zero downloads required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full 4K Video Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Server Uploads</span>
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
              Explore All Video Tools
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Select any specialized video editing utility below to start producing social clips and presentations instantly.
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
                  <span>Open Video Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <AdSlot slotId="video-category-middle-slot" />
      </div>

      {/* Authoritative Editorial Content & EEAT Guide */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              High-Performance In-Browser Video Production for Creators
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-4">
              Modern content creation moves quickly. Whether you are generating short-form vertical videos for TikTok, YouTube Shorts, and Instagram Reels, or preparing a product demonstration recording for your team, waiting for bulky desktop editing suites to launch and export can grind productivity to a halt.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              InstantTool brings hardware-accelerated video editing directly into modern browsers using FFmpeg compiled to WebAssembly (Wasm). Clips are decoded, trimmed, filtered, and rendered locally utilizing your computer&apos;s GPU and multi-core CPU. This delivers near-instant export speeds without ever consuming your internet bandwidth to upload multi-gigabyte video files to remote servers.
            </p>
          </div>

          {/* Three Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Film className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Lossless Export</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stream copy mode enables millisecond-precision cuts and trims without re-encoding, preserving 100% of the original video bitrate and frame rate.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Shield className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Absolute Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Personal family footage, internal confidential company presentations, and client screen recordings stay exclusively on your hardware.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Zap className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">No Export Watermarks</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enjoy complete freedom. Every video exported from InstantTool is 100% free of branding, stamps, or subscription watermarks.
              </p>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="pt-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How to Edit and Export Your Videos Online
            </h3>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed text-sm">
              <li>
                <strong className="text-slate-900 dark:text-white">Choose Your Workflow:</strong> Pick from specialized tools such as <em>Trim Video</em>, <em>Merge Videos</em>, <em>Crop Video</em>, or <em>Screen Recorder</em>.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Load Your Footage:</strong> Drag and drop your MP4, MOV, MKV, or WebM files into the video canvas. Preview with smooth timeline scrubbing.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Adjust &amp; Save:</strong> Fine-tune in/out points, choose resolution or aspect ratio (16:9, 9:16, 1:1), and click Save to download your processed video file directly.
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
                  What video formats are supported?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our WebAssembly multimedia pipeline supports all major modern video codecs and containers including MP4 (H.264, H.265/HEVC), WebM (VP8, VP9, AV1), MOV, AVI, and MKV.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Is there a file size limit for video processing?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Because video processing runs locally inside your browser via WebAssembly, file size limits depend on your computer&apos;s available system RAM rather than network bandwidth limits. Most users comfortably edit files up to 2GB with zero slowdowns.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Are exported videos free of watermarks?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, 100%. We believe everyday creators should have access to clean, professional output. Your exported video is yours to distribute on YouTube, Instagram, or commercial projects without any logos attached.
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
