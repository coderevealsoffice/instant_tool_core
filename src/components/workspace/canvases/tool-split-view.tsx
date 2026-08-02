"use client"

import { ReactNode, useEffect, useState } from "react"
import { Download, Loader2, Play, FileIcon, FileText, FileAudio, FileVideo, FileImage } from "lucide-react"

interface ToolSplitViewProps {
  title: string
  description: string
  icon?: ReactNode
  originalFile: File | null
  isProcessing: boolean
  progress: number
  isDone: boolean
  onProcess: () => void
  processButtonText: string
  resultUrl?: string
  resultFilename?: string
  onDownload?: () => void
  customSettings?: ReactNode
  customResultPreview?: ReactNode
}

function FilePreview({ file, url, isResult = false }: { file: File | null, url?: string, isResult?: boolean }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) {
      setPreviewUrl(url)
      return
    }
    
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
    
    setPreviewUrl(null)
  }, [file, url])

  if (!file && !url) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileIcon className="w-12 h-12 mb-4 opacity-50" />
        <p>{isResult ? "Result will appear here" : "No file selected"}</p>
      </div>
    )
  }

  const mimeType = file?.type || ""
  const fileName = file?.name || "Result File"

  // Quick helper to render icons for unknown types
  const renderGenericIcon = () => {
    let Icon = FileText
    if (mimeType.startsWith("audio/")) Icon = FileAudio
    else if (mimeType.startsWith("video/")) Icon = FileVideo
    else if (mimeType.startsWith("image/")) Icon = FileImage
    else if (fileName.endsWith(".zip") || fileName.endsWith(".rar")) Icon = FileIcon

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Icon className="w-16 h-16 mb-4 text-slate-400" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName}</span>
        <span className="text-xs text-slate-400 mt-2">Preview not available for this format</span>
      </div>
    )
  }

  if (!previewUrl) return renderGenericIcon()

  if (mimeType.startsWith("image/") || (url && url.includes("image"))) {
    return <img src={previewUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
  }

  if (mimeType.startsWith("video/") || (url && url.includes("video"))) {
    return <video src={previewUrl} controls className="max-w-full max-h-full" />
  }

  if (mimeType.startsWith("audio/") || (url && url.includes("audio"))) {
    return <audio src={previewUrl} controls className="w-full px-6" />
  }

  if (mimeType === "application/pdf" || (url && url.includes("application/pdf"))) {
    return <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-full border-0" title={fileName} />
  }

  return renderGenericIcon()
}

export function ToolSplitView({
  title,
  description,
  icon,
  originalFile,
  isProcessing,
  progress,
  isDone,
  onProcess,
  processButtonText,
  resultUrl,
  resultFilename,
  onDownload,
  customSettings,
  customResultPreview,
}: ToolSplitViewProps) {

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
      return
    }
    if (resultUrl) {
      const a = document.createElement("a")
      a.href = resultUrl
      a.download = resultFilename || "download"
      a.click()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Left Panel: Original File */}
      <div className="flex-1 border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-col min-h-[40vh] lg:min-h-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex-shrink-0">Original File</h3>
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-sm relative">
          <FilePreview file={originalFile} />
        </div>
      </div>

      {/* Right Panel: Settings & Result */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-[60vh] lg:min-h-0 bg-white dark:bg-slate-900 relative">
        <div className="flex-shrink-0 mb-6 flex items-start gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Custom Settings / Middle section */}
        {customSettings && !isDone && (
          <div className="flex-shrink-0 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            {customSettings}
          </div>
        )}

        {/* Result Preview (if done) */}
        {isDone && (resultUrl || customResultPreview) && (
          <div className="flex-1 min-h-0 mb-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner relative">
             {customResultPreview ? customResultPreview : <FilePreview file={null} url={resultUrl} isResult={true} />}
             <div className="absolute top-3 left-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm backdrop-blur-sm z-10">
                Generated Result
             </div>
          </div>
        )}

        {/* Action Button Area */}
        <div className="mt-auto pt-4 flex-shrink-0">
          {isProcessing && (
            <div className="space-y-2 mb-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Processing...</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {isDone ? (
            <button 
              onClick={handleDownload}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span className="text-lg">Download Result</span>
            </button>
          ) : (
            <button 
              onClick={onProcess} 
              disabled={isProcessing || !originalFile}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:hover:shadow-none text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              <span className="text-lg">{isProcessing ? "Processing..." : processButtonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
