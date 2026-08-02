"use client"

import { useEffect, useState, useRef } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { useSearchParams } from "next/navigation"
import { FileVideo, FileAudio, FileImage, File, CheckCircle, Loader2 } from "lucide-react"

const TOOL_META: Record<string, { icon: any, label: string, color: string, accept: string[] }> = {
  "merge":       { icon: FileVideo, label: "Merge Videos", color: "bg-violet-600", accept: ["video"] },
  "add-audio":   { icon: FileVideo, label: "Add Audio to Video", color: "bg-blue-600", accept: ["video"] },
  "add-image":   { icon: FileVideo, label: "Add Image to Video", color: "bg-blue-600", accept: ["video"] },
  "add-text":    { icon: FileVideo, label: "Add Text to Video", color: "bg-blue-600", accept: ["video"] },
  "remove-logo": { icon: FileVideo, label: "Remove Logo from Video", color: "bg-slate-700", accept: ["video"] },
  "resize":      { icon: FileVideo, label: "Resize Video", color: "bg-amber-600", accept: ["video"] },
  "loop":        { icon: FileVideo, label: "Loop Video", color: "bg-cyan-600", accept: ["video"] },
  "volume":      { icon: FileVideo, label: "Change Volume", color: "bg-indigo-600", accept: ["video"] },
  "speed":       { icon: FileVideo, label: "Change Speed", color: "bg-green-600", accept: ["video", "audio"] },
  "stabilize":   { icon: FileVideo, label: "Stabilize Video", color: "bg-rose-600", accept: ["video"] },
  "recorder":    { icon: FileVideo, label: "Recorder", color: "bg-red-600", accept: [] },
  "screen-recorder": { icon: FileVideo, label: "Screen Recorder", color: "bg-slate-700", accept: [] },
  "text-to-speech":  { icon: FileAudio, label: "Text to Speech", color: "bg-purple-600", accept: [] },
  "pitch":       { icon: FileAudio, label: "Change Pitch", color: "bg-teal-600", accept: ["audio"] },
  "equalizer":   { icon: FileAudio, label: "Audio Equalizer", color: "bg-emerald-600", accept: ["audio"] },
  "reverse":     { icon: FileAudio, label: "Reverse Audio", color: "bg-orange-600", accept: ["audio"] },
  "joiner":      { icon: FileAudio, label: "Audio Joiner", color: "bg-blue-500", accept: ["audio"] },
  "unlock-pdf":  { icon: File, label: "Unlock PDF", color: "bg-red-600", accept: ["application/pdf"] },
  "protect-pdf": { icon: File, label: "Protect PDF", color: "bg-red-600", accept: ["application/pdf"] },
  "add-page-numbers": { icon: File, label: "Add Page Numbers", color: "bg-red-600", accept: ["application/pdf"] },
  "pdf-to-word": { icon: File, label: "PDF to Word", color: "bg-red-600", accept: ["application/pdf"] },
  "pdf-to-excel": { icon: File, label: "PDF to Excel", color: "bg-red-600", accept: ["application/pdf"] },
  "pdf-to-jpg":  { icon: File, label: "PDF to JPG", color: "bg-red-600", accept: ["application/pdf"] },
  "pdf-to-png":  { icon: File, label: "PDF to PNG", color: "bg-red-600", accept: ["application/pdf"] },
  "pdf-to-html": { icon: File, label: "PDF to HTML", color: "bg-red-600", accept: ["application/pdf"] },
  "word-to-pdf": { icon: File, label: "Word to PDF", color: "bg-indigo-600", accept: [".doc", ".docx"] },
  "jpg-to-pdf":  { icon: FileImage, label: "JPG to PDF", color: "bg-purple-600", accept: ["image/jpeg", "image/jpg"] },
  "excel-to-pdf": { icon: File, label: "Excel to PDF", color: "bg-green-600", accept: [".xls", ".xlsx"] },
  "ppt-to-pdf":  { icon: File, label: "PPT to PDF", color: "bg-orange-600", accept: [".ppt", ".pptx"] },
  "png-to-pdf":  { icon: FileImage, label: "PNG to PDF", color: "bg-pink-600", accept: ["image/png"] },
  "video":       { icon: FileVideo, label: "Video Converter", color: "bg-slate-700", accept: ["video"] },
  "document":    { icon: File, label: "Document Converter", color: "bg-blue-600", accept: [] },
  "font":        { icon: File, label: "Font Converter", color: "bg-violet-600", accept: [] },
  "archive":     { icon: File, label: "Archive Converter", color: "bg-amber-600", accept: [] },
  "ebook":       { icon: File, label: "Ebook Converter", color: "bg-teal-600", accept: [] },
  "extractor":   { icon: File, label: "Archive Extractor", color: "bg-slate-600", accept: [] },
}

export function GenericWorkspaceCanvas() {
  const { files } = useWorkspaceStore()
  const searchParams = useSearchParams()
  const tool = searchParams.get("tool") || ""
  const meta = TOOL_META[tool] || { icon: File, label: tool, color: "bg-slate-700", accept: [] }
  const Icon = meta.icon
  const [isReady, setIsReady] = useState(false)

  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-xl ${meta.color} flex items-center justify-center shadow-lg shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{meta.label}</h2>
          <p className="text-sm text-slate-500">Configure your file settings below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0">
        
        {/* Left Side: Preview area */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center overflow-hidden relative shadow-inner aspect-square lg:aspect-auto lg:h-[400px] border border-slate-200 dark:border-slate-800 p-8 text-center">
           <Icon className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6" />
           {activeFile ? (
             <div className="max-w-[80%]">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 truncate mb-1" title={activeFile.name}>{activeFile.name}</h3>
                <p className="text-sm text-slate-500 uppercase">{(activeFile.size / 1024 / 1024).toFixed(2)} MB</p>
             </div>
           ) : (
             <div className="max-w-[80%]">
                <h3 className="text-lg font-bold text-slate-400 dark:text-slate-600 mb-1">No file selected</h3>
                <p className="text-sm text-slate-400 dark:text-slate-600">Please go back and upload a file.</p>
             </div>
           )}
        </div>

        {/* Right Side: Options & Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-6">
          {activeFile && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Selected File</label>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 rounded-lg">
                  <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="truncate">{activeFile.name}</span>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  {isReady ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-indigo-500 shrink-0 animate-spin" />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {isReady ? "File ready for processing" : "Analyzing file..."}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-600/50">
                  <div className="flex justify-between">
                    <span>Tool</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{meta.label}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-2">
                Click <strong className="text-indigo-600 dark:text-indigo-400">Finish →</strong> in the top bar to process and download your file.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
