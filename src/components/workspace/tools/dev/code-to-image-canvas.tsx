"use client"

import { useState, useRef } from "react"
import { Code2, Download, Image as ImageIcon, Settings2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import * as htmlToImage from 'html-to-image'

const THEMES = [
  { id: 'vscDarkPlus', name: 'VS Code Dark', style: vscDarkPlus },
  // Adding more themes would require importing them, keeping it simple for now
]

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'html', 'css', 'sql', 'json', 'bash'
]

const BACKGROUNDS = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-br from-cyan-400 to-blue-600',
  'bg-gradient-to-br from-emerald-400 to-cyan-400',
  'bg-gradient-to-br from-orange-400 to-rose-400',
  'bg-gradient-to-br from-slate-800 to-slate-900',
  'bg-white'
]

export function CodeToImageCanvas() {
  const [code, setCode] = useState(`function helloWorld() {\n  console.log("Hello, World!");\n  return true;\n}`)
  const [language, setLanguage] = useState('javascript')
  const [background, setBackground] = useState(BACKGROUNDS[0])
  const [padding, setPadding] = useState(64)
  const [isExporting, setIsExporting] = useState(false)
  
  const exportRef = useRef<HTMLDivElement>(null)

  const handleExport = async (format: 'png' | 'svg') => {
    if (!exportRef.current) return
    
    try {
      setIsExporting(true)
      const dataUrl = format === 'png' 
        ? await htmlToImage.toPng(exportRef.current, { pixelRatio: 2, cacheBust: true })
        : await htmlToImage.toSvg(exportRef.current, { cacheBust: true })
        
      const link = document.createElement('a')
      link.download = `code-snippet.${format}`
      link.href = dataUrl
      link.click()
      toast.success(`Exported as ${format.toUpperCase()} successfully!`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to export image')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Code to Image</h2>
            <p className="text-sm text-slate-500">Create beautiful, shareable screenshots of your source code instantly.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-4 border-b border-slate-100">
            <Settings2 className="w-5 h-5" /> Settings & Input
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Your Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-48 text-xs font-mono border-slate-200 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 shadow-inner resize-y"
                spellCheck="false"
                placeholder="Paste your code here..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Background</label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUNDS.map((bg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBackground(bg)}
                    className={`h-10 rounded-lg border-2 transition-all ${bg} ${background === bg ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Padding ({padding}px)</label>
              <input 
                type="range" 
                min="16" 
                max="128" 
                step="16"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" /> Export PNG
              </button>
              <button
                onClick={() => handleExport('svg')}
                disabled={isExporting}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Export SVG
              </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex items-center justify-center min-h-[500px] overflow-hidden">
            {/* The actual exportable div */}
            <div 
              ref={exportRef}
              className={`transition-all duration-300 w-full max-w-3xl flex items-center justify-center ${background} rounded-2xl shadow-xl`}
              style={{ padding: `${padding}px` }}
            >
              <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-[#1e1e1e]">
                {/* Mac window controls */}
                <div className="h-12 flex items-center px-4 gap-2 bg-[#2d2d2d] border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-auto flex items-center px-2 py-1 bg-black/20 rounded-md">
                    <span className="text-xs text-slate-400 font-medium">snippet.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language}</span>
                  </div>
                </div>
                
                {/* Editable Code Area */}
                <div className="relative">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      minHeight: '200px'
                    }}
                    showLineNumbers={true}
                  >
                    {code || ' '}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
