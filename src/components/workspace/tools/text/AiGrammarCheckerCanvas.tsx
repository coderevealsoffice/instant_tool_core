"use client"

import { useState } from "react"
import { Check, Copy, Loader2, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AiGrammarCheckerCanvas() {
  const [text, setText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [tone, setTone] = useState("Professional")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFixGrammar = async () => {
    if (!text.trim()) return

    setIsProcessing(true)
    
    try {
      const res = await fetch("/api/ai-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fix grammar")
      }
      
      setCorrectedText(data.corrected)
    } catch (err: any) {
      console.error(err)
      alert(err.message || "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!correctedText) return
    navigator.clipboard.writeText(correctedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Side */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              Original Text
            </label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-fuchsia-500 font-medium"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Academic">Academic</option>
              <option value="Casual">Casual</option>
              <option value="Persuasive">Persuasive</option>
            </select>
          </div>
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="flex-1 w-full resize-none bg-transparent border-none focus:ring-0 outline-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed"
          />

          <div className="mt-4 pt-4 border-t dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">
              {text.trim() ? text.trim().split(/\s+/).length : 0} words
            </span>
            <Button 
              onClick={handleFixGrammar}
              disabled={isProcessing || !text.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl shadow-md disabled:opacity-70"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fixing...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> Fix Grammar</>
              )}
            </Button>
          </div>
        </div>

        {/* Output Side */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 shadow-inner border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-500" />
              Corrected Text
            </label>
            {correctedText && (
              <button 
                onClick={handleCopy}
                className="text-slate-500 hover:text-fuchsia-600 transition-colors p-1"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          
          <div className="flex-1 w-full overflow-y-auto text-slate-800 dark:text-slate-200 text-lg leading-relaxed relative">
            {!correctedText && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Wand2 className="w-12 h-12 opacity-20 mb-4" />
                <p>Your polished text will appear here</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-fuchsia-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="font-medium animate-pulse">Polishing your writing...</p>
              </div>
            )}

            {!isProcessing && correctedText && (
              <div className="whitespace-pre-wrap">{correctedText}</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
