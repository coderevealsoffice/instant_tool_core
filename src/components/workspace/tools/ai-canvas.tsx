import { useWorkspaceStore } from "@/store/workspace-store"
import { Sparkles, Type, AlignLeft, Search } from "lucide-react"

export function AiCanvas() {
  const { toolParams, setToolParam } = useWorkspaceStore()
  
  const content = toolParams.aiContent || ""
  const aiMode = toolParams.aiMode || "summary"
  
  return (
    <div className="flex h-full flex-col items-center justify-center w-full">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Content Studio</h2>
            <p className="text-sm text-slate-500">Generate summaries and SEO content instantly</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              Select AI Task
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => setToolParam("aiMode", "summary")}
                className={`flex-1 py-3 px-4 rounded-xl border font-semibold flex items-center justify-center gap-2 transition ${aiMode === "summary" ? "bg-purple-50 border-purple-600 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <AlignLeft className="w-4 h-4" /> Summarize Text
              </button>
              <button 
                onClick={() => setToolParam("aiMode", "seo")}
                className={`flex-1 py-3 px-4 rounded-xl border font-semibold flex items-center justify-center gap-2 transition ${aiMode === "seo" ? "bg-purple-50 border-purple-600 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Search className="w-4 h-4" /> Generate SEO Metadata
              </button>
              <button 
                onClick={() => setToolParam("aiMode", "grammar")}
                className={`flex-1 py-3 px-4 rounded-xl border font-semibold flex items-center justify-center gap-2 transition ${aiMode === "grammar" ? "bg-purple-50 border-purple-600 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Type className="w-4 h-4" /> Fix Grammar
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
              Input Content
            </label>
            <textarea 
              value={content}
              onChange={(e) => setToolParam("aiContent", e.target.value)}
              placeholder="Paste your text here (up to 5,000 words)..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white transition resize-none"
            />
          </div>
          
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-purple-800 text-sm">
            <p className="font-semibold mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Powered by Google Gemini AI</p>
            <p>Processing text requires 3 credits. Your content will be securely processed by our AI engine. Click <strong>Process Tool</strong> above to generate your result!</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
