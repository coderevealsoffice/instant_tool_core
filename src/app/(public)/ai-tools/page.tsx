import Link from "next/link"
import { TOOL_CATEGORIES } from "@/config/menu"

export const metadata = {
  title: "Free Online AI Tools - Writers, Generators & Enhancers | InstantTool",
  description: "Supercharge your workflow with our suite of free AI tools. From AI writers to image enhancers, get things done faster.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/ai-tools"
  }
};

export default function AiToolsPage() {
  const aiCategory = TOOL_CATEGORIES.find(c => c.title === "AI Tools");
  
  if (!aiCategory) {
    return <div className="text-center py-20">No AI Tools found.</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-sm font-bold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
          </span>
          Next-Gen AI Utilities
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          Supercharge your workflow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-500">AI Tools</span>
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          From instantly summarizing YouTube videos to generating complete E-books, discover all our powerful AI utilities in one place.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {aiCategory.tools.map((tool, toolIdx) => (
              <Link 
                key={toolIdx} 
                href={tool.href}
                className="group flex flex-col items-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {tool.name}
                </h3>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
