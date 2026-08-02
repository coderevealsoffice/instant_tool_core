"use client"

import { useState } from "react"
import { Sparkles, Copy, Loader2, RefreshCw, Code2, Eye } from "lucide-react"
import { toast } from "sonner"

export function AiContentWriterCanvas() {
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [generatedHtml, setGeneratedHtml] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGeneratedHtml("")
    
    try {
      const res = await fetch("/api/ai-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, length })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate content")
      }
      
      setGeneratedHtml(data.content)
      toast.success("Content generated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml)
    toast.success("HTML Code copied to clipboard!")
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 mix-blend-overlay"></div>
          <Sparkles className="w-8 h-8 text-white relative z-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            AI Content Writer <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text text-sm px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">Pro</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Generate rich HTML blog posts and articles ready for your CMS.</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6">
        
        {/* Controls Section */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-6">
            
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">What do you want to write about?</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Write a comprehensive guide on SEO best practices for Next.js applications in 2024..."
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm dark:bg-slate-700 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Tone of Voice</label>
              <select 
                value={tone} 
                onChange={e => setTone(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
                <option value="humorous">Humorous</option>
                <option value="informative">Informative</option>
                <option value="authoritative">Authoritative</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Length</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                  onClick={() => setLength("short")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${length === "short" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >Short (~200w)</button>
                <button 
                  onClick={() => setLength("medium")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${length === "medium" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >Medium (~400w)</button>
                <button 
                  onClick={() => setLength("long")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${length === "long" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >Long (~700w)</button>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 h-[600px] flex flex-col relative">
            
            {/* Header Tabs */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode("preview")}
                  disabled={!generatedHtml && !isGenerating}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === "preview" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} disabled:opacity-50`}
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={() => setViewMode("code")}
                  disabled={!generatedHtml && !isGenerating}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === "code" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} disabled:opacity-50`}
                >
                  <Code2 className="w-4 h-4" /> HTML Code
                </button>
              </div>

              <div className="flex gap-2">
                {generatedHtml && (
                  <button 
                    onClick={handleCopy} 
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy HTML
                  </button>
                )}
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                  <p className="font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text animate-pulse">Writing magical content...</p>
                </div>
              ) : generatedHtml ? (
                viewMode === "preview" ? (
                  <div 
                    className="p-6 prose dark:prose-invert prose-indigo max-w-none focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: generatedHtml }}
                  />
                ) : (
                  <textarea 
                    readOnly
                    value={generatedHtml}
                    className="w-full h-full p-6 bg-transparent text-slate-700 dark:text-slate-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-center gap-3">
                  <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  <p>Your rich HTML content will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
