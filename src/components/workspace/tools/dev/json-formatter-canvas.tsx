"use client"

import { useState } from "react"
import { Braces, Copy, CheckCircle, Play, FileJson, AlertCircle, Minimize2 } from "lucide-react"
import { toast } from "sonner"

export function JsonFormatterCanvas() {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleFormat = () => {
    if (!inputJson.trim()) {
      toast.error("Please enter some JSON.")
      return
    }
    
    setError(null)
    try {
      const parsed = JSON.parse(inputJson)
      setOutputJson(JSON.stringify(parsed, null, 2))
      toast.success("JSON Validated and Formatted!")
    } catch (err: any) {
      setError(err.message)
      setOutputJson("")
      toast.error("Invalid JSON")
    }
  }

  const handleMinify = () => {
    if (!inputJson.trim()) {
      toast.error("Please enter some JSON.")
      return
    }
    
    setError(null)
    try {
      const parsed = JSON.parse(inputJson)
      setOutputJson(JSON.stringify(parsed))
      toast.success("JSON Minified!")
    } catch (err: any) {
      setError(err.message)
      setOutputJson("")
      toast.error("Invalid JSON")
    }
  }

  const handleCopy = () => {
    if (!outputJson) return
    navigator.clipboard.writeText(outputJson)
    setIsCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[350px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col shrink-0">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Braces className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">JSON Formatter</h2>
            <p className="text-sm text-slate-500">Validate & Beautify</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Paste your raw, unformatted, or minified JSON code. Click Format to validate and beautify it.
          </p>
          
          <button
            onClick={handleFormat}
            disabled={!inputJson.trim()}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 flex items-center justify-center transition-transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 mr-2" />
            Format JSON
          </button>

          <button
            onClick={handleMinify}
            disabled={!inputJson.trim()}
            className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 flex items-center justify-center transition-transform active:scale-[0.98]"
          >
            <Minimize2 className="w-4 h-4 mr-2" />
            Minify JSON
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col md:flex-row gap-4 lg:gap-6 min-h-0 overflow-hidden">
        
        {/* Input Pane */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              <FileJson className="w-4 h-4 mr-2" />
              Raw JSON
            </span>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{"key": "value"}'
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-sm font-mono leading-relaxed whitespace-pre"
            spellCheck="false"
          />
        </div>

        {/* Output Pane */}
        <div className={`flex-1 bg-white dark:bg-slate-950 rounded-2xl border ${error ? 'border-red-300 dark:border-red-900' : 'border-slate-200 dark:border-slate-800'} shadow-sm flex flex-col overflow-hidden relative`}>
          <div className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center ${error ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
            <span className={`font-semibold flex items-center ${error ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-500'}`}>
              {error ? <AlertCircle className="w-4 h-4 mr-2" /> : <Braces className="w-4 h-4 mr-2" />}
              {error ? 'Validation Error' : 'Formatted Output'}
            </span>
            {!error && outputJson && (
              <button 
                onClick={handleCopy}
                className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative">
            {error ? (
              <div className="p-6 text-red-600 dark:text-red-400 font-mono text-sm whitespace-pre-wrap">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={outputJson}
                placeholder="Beautified JSON will appear here..."
                className="w-full h-full p-4 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 text-sm font-mono leading-relaxed whitespace-pre"
                spellCheck="false"
              />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
