"use client"

import { useState } from "react"
import { Hash, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function WordCounterCanvas() {
  const [text, setText] = useState("")

  const charCount = text.length
  const charCountNoSpaces = text.replace(/\s+/g, "").length
  const words = text.trim() ? text.trim().split(/\s+/) : []
  const wordCount = words.length
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0
  
  // Approximate reading time (200 words per minute)
  const readingTime = Math.ceil(wordCount / 200)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast.success("Text copied to clipboard")
  }

  const handleClear = () => {
    setText("")
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl">
          <Hash className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Word Counter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time word and character statistics</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{wordCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Words</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{charCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Characters</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{charCountNoSpaces}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">No Spaces</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{paragraphCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Paragraphs</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{readingTime}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Min Read</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 w-full relative">
        <div className="flex justify-end gap-2 mb-2 absolute right-6 top-6">
          <button onClick={handleCopy} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleClear} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full bg-transparent resize-none outline-none text-slate-800 dark:text-slate-200 pt-12 text-lg"
        />
      </div>
    </div>
  )
}
