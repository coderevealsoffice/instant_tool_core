"use client"

import { useState } from "react"
import { Link2, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function SlugGeneratorCanvas() {
  const [text, setText] = useState("")

  const handleCopy = () => {
    navigator.clipboard.writeText(slug)
    toast.success("Slug copied to clipboard")
  }

  const handleClear = () => {
    setText("")
  }

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const slug = generateSlug(text)

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-2xl">
          <Link2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">URL Slug Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Convert any text or title into an SEO-friendly URL slug</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="flex justify-between items-center mb-2 absolute right-6 top-6">
            <button onClick={handleClear} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Enter Title or Text</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. How to Build a Next.js App in 2026!"
            className="w-full bg-transparent resize-none outline-none text-slate-800 dark:text-slate-200 pt-8 text-lg"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative flex-1 flex flex-col justify-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 block">Generated Slug</label>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 font-mono text-lg text-slate-800 dark:text-slate-200 break-all min-h-[100px] border border-slate-200 dark:border-slate-700">
              {slug || <span className="text-slate-400">your-seo-friendly-url-slug</span>}
            </div>
            
            <button 
              onClick={handleCopy} 
              disabled={!slug}
              className="mt-6 w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Copy className="w-5 h-5" /> Copy Slug
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
