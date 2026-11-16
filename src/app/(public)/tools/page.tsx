import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { TOOL_CATEGORIES } from "@/config/menu"

export const metadata = {
  title: "All Free Online Tools - PDF, Video, Audio & AI | InstantTool",
  description: "Explore our complete suite of 100% free browser tools for PDFs, Videos, Images, Audio, and AI generation. Fast, secure, and private in your browser.",
  keywords: [
    "free online tools",
    "pdf tools online",
    "video editor online",
    "audio trimmer online",
    "format converter",
    "seo tools free",
    "ai tools online",
    "no watermark tools",
    "InstantTool"
  ],
  alternates: {
    canonical: "https://devigo.cloud/tools"
  },
  openGraph: {
    title: "All Free Online Tools - PDF, Video, Audio & AI | InstantTool",
    description: "Explore our complete suite of 100% free browser tools for PDFs, Videos, Images, Audio, and AI generation. Fast, secure, and private in your browser.",
    url: "https://devigo.cloud/tools",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Free Online Tools - PDF, Video, Audio & AI | InstantTool",
    description: "Explore our complete suite of 100% free browser tools for PDFs, Videos, Images, Audio, and AI generation. Fast, secure, and private in your browser.",
  }
};

export default function AllToolsPage() {
  return (
    <div className="relative py-16 lg:py-24 px-4 bg-[#FAFAFA] dark:bg-slate-950 min-h-screen font-sans overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Background Soft Glows (Harmonized with lime / emerald button theme) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#D7FB8E]/15 dark:bg-[#D7FB8E]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl z-10">
        
        {/* Header Hero Area */}
        <div className="text-center mb-16 lg:mb-20">
          
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#D7FB8E] animate-pulse"></span>
            ◆ 100% Free &amp; Private Browser Utilities
          </div>

          {/* Main Title */}
          <div className="flex items-center justify-center gap-3.5 mb-5">
            <Image
              src="/favicon.png"
              alt="InstantTool Logo"
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain shadow-xs"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Instant<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">Tool</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Your 100% free suite of online tools for Video, Audio, PDF, SEO, and AI Creation. Fast, secure, and right in your browser.
          </p>
        </div>

        {/* Categories & Tools Grid */}
        <div className="space-y-16 lg:space-y-20">
          {TOOL_CATEGORIES.map((category, idx) => {
            // Pastel styling mapped to category
            let iconColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
            if (category.title === "Video Tools") iconColor = "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400";
            else if (category.title === "Audio Tools") iconColor = "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400";
            else if (category.title === "PDF Tools") iconColor = "bg-[#D7FB8E]/30 text-slate-900 dark:bg-[#D7FB8E]/15 dark:text-[#D7FB8E]";
            else if (category.title === "SEO Tools") iconColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
            else if (category.title === "AI Tools") iconColor = "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400";

            return (
              <section key={idx} className="relative">
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {category.title}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {category.tools?.map((tool, toolIdx) => (
                    <Link 
                      key={toolIdx} 
                      href={tool.href}
                      className="group flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between w-full mb-3.5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconColor}`}>
                          {tool.icon}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      
                      <h3 className="font-extrabold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-base tracking-tight">
                        {tool.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {tool.description || `Quickly process your ${tool.name.toLowerCase()} files.`}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  )
}
