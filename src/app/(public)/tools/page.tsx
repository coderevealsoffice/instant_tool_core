import Link from "next/link"
import { 
  Video, Scissors, MonitorPlay, MessageSquare, PlusSquare, Image as ImageIcon, 
  Type, Eraser, Crop, RotateCw, FlipHorizontal, Maximize, Repeat, 
  Volume2, FastForward, Activity, Mic, Merge, MoveRight, Music, Sliders, AudioLines,
  FileText, Unlock, Lock, FilePlus2, FileDigit, ImageDown, ArrowRightLeft, FileArchive, BookOpen, Key,
  Hash, ALargeSmall, Link2, Pipette, Palette
} from "lucide-react"

import { TOOL_CATEGORIES } from "@/config/menu"

export const metadata = {
  title: "All Online File Tools - PDF, Video, Image & AI | InstantTool",
  description: "Explore our complete collection of free online tools for PDFs, Videos, Images, Audio, and AI generation. Fast, secure, and in your browser.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/tools"
  }
};

export default function AllToolsPage() {
  return (
    <div className="relative py-20 px-4 bg-white dark:bg-slate-950 min-h-screen font-sans overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background glowing meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-100 dark:bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative container mx-auto max-w-6xl z-10">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="flex -space-x-1.5 drop-shadow-xl">
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-950"></div>
                <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-white dark:border-slate-950"></div>
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></div>
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
               InstantTool
             </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
            Your premium suite of online tools for Video, Audio, PDF, and File Conversion. Fast, secure, and right in your browser.
          </p>
        </div>

        <div className="space-y-20">
          {TOOL_CATEGORIES.map((category, idx) => {
            let iconColor = "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
            if (category.title === "Audio Tools") iconColor = "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
            else if (category.title === "PDF Tools") iconColor = "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400";
            else if (category.title === "Converters") iconColor = "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
            else if (category.title === "Text Tools") iconColor = "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400";
            else if (category.title === "Color Tools") iconColor = "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400";
            else if (category.title === "AI Tools") iconColor = "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400";

            return (
              <section key={idx} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{category.title}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/20 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIdx) => (
                    <Link 
                      key={toolIdx} 
                      href={tool.href}
                      className="group flex flex-col items-start p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${iconColor}`}>
                        {tool.icon}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
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
