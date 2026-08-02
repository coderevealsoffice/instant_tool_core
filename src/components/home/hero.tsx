import Link from "next/link"
import { Sparkles, ArrowRight, Check, FileText, Image as ImageIcon, Video, QrCode, Music, Scissors, Lock, Settings } from "lucide-react"

const FLOATING_TOOLS = [
  { icon: FileText, color: "text-blue-500", size: 48, delay: "0s", duration: "20s", initialX: 10, initialY: 20 },
  { icon: ImageIcon, color: "text-purple-500", size: 56, delay: "2s", duration: "25s", initialX: 85, initialY: 15 },
  { icon: Video, color: "text-red-500", size: 40, delay: "1s", duration: "22s", initialX: 75, initialY: 75 },
  { icon: QrCode, color: "text-emerald-500", size: 64, delay: "3s", duration: "28s", initialX: 15, initialY: 80 },
  { icon: Music, color: "text-yellow-500", size: 48, delay: "4s", duration: "24s", initialX: 25, initialY: 50 },
  { icon: Scissors, color: "text-orange-500", size: 36, delay: "1.5s", duration: "18s", initialX: 90, initialY: 45 },
  { icon: Lock, color: "text-slate-500", size: 42, delay: "2.5s", duration: "21s", initialX: 5, initialY: 40 },
  { icon: Settings, color: "text-indigo-500", size: 50, delay: "0.5s", duration: "26s", initialX: 85, initialY: 90 },
]

export function HeroSection() {
  return (
    <section
      className="relative pt-24 pb-32 px-4 w-full bg-[#F8F9FA] dark:bg-slate-950 overflow-hidden min-h-[90vh] flex items-center justify-center font-sans transition-colors duration-300"
    >
      {/* Subtle Blue Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 blur-[150px] rounded-full mix-blend-multiply pointer-events-none"></div>

      {/* Floating Tools Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {FLOATING_TOOLS.map((tool, i) => {
          const Icon = tool.icon
          return (
            <div
              key={i}
              className={`absolute animate-float ${tool.color} opacity-10 dark:opacity-20`}
              style={{
                left: `${tool.initialX}%`,
                top: `${tool.initialY}%`,
                "--float-duration": tool.duration,
                "--float-delay": tool.delay,
              } as React.CSSProperties}
            >
              <Icon size={tool.size} />
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center">

          {/* Top Badge */}
          <div className="mb-8 animate-fade-in-up">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Try InstantTool 2.0 and get 500 credits free!</span>
              <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Main Headline */}
          <div className="mb-6 animate-fade-in-up animation-delay-150">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.1]">
              <span className="text-slate-900 dark:text-white">Every tool you need</span><br />
              <span className="text-slate-500 dark:text-slate-400">in one place.</span>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="mb-10 animate-fade-in-up animation-delay-300">
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Effortlessly merge, split, compress, and convert your PDFs, Videos, Audio, and Images—perfectly formatted and ready in seconds.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-12 animate-fade-in-up animation-delay-500">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#111827] dark:bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-black dark:hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20 dark:shadow-blue-900/20"
            >
              Explore All Tools
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Marks */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm font-medium text-slate-500 animate-fade-in-up animation-delay-700">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-slate-400" />
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-slate-400" />
              No sign up required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-slate-400" />
              Secure processing
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
