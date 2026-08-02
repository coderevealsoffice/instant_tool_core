"use client"

import { useState } from "react"
import { ALargeSmall, Copy, Trash2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function TextCapitalizerCanvas() {
  const [text, setText] = useState("")

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast.success("Text copied to clipboard")
  }

  const handleClear = () => {
    setText("")
  }

  const toUpperCase = () => setText(text.toUpperCase())
  const toLowerCase = () => setText(text.toLowerCase())
  const toTitleCase = () => {
    setText(
      text.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    )
  }
  const toSentenceCase = () => {
    setText(
      text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
    )
  }
  const toAlternatingCase = () => {
    setText(
      text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
    )
  }
  const toInverseCase = () => {
    setText(
      text.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('')
    )
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-fuchsia-600 flex items-center justify-center shadow-2xl">
          <ALargeSmall className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Text Capitalizer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Easily change the case of your text</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-2">
        <button onClick={toSentenceCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">Sentence case</button>
        <button onClick={toLowerCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">lower case</button>
        <button onClick={toUpperCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">UPPER CASE</button>
        <button onClick={toTitleCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">Title Case</button>
        <button onClick={toAlternatingCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">aLtErNaTiNg cAsE</button>
        <button onClick={toInverseCase} className="py-2 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">InVeRsE CaSe</button>
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
          placeholder="Type or paste your text here to convert its case..."
          className="w-full bg-transparent resize-none outline-none text-slate-800 dark:text-slate-200 pt-12 text-lg"
        />
      </div>
    </div>
  )
}
