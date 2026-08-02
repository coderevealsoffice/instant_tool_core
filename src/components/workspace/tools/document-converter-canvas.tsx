"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileText, Loader2, CheckCircle, Play, ArrowRight, FileWarning } from "lucide-react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { toast } from "sonner"

type OutputFormat = "pdf" | "txt" | "html" | "md"

const SUPPORTED_INPUTS: Record<string, string> = {
  pdf: "PDF Document",
  doc: "Word Document",
  docx: "Word Document",
  odt: "OpenDocument Text",
  rtf: "Rich Text Format",
  txt: "Plain Text",
  html: "HTML File",
  htm: "HTML File",
  md: "Markdown File",
}

const OUTPUT_FORMATS: { id: OutputFormat; label: string; desc: string; color: string }[] = [
  { id: "pdf",  label: "PDF",  desc: "Portable Document", color: "bg-red-600" },
  { id: "txt",  label: "TXT",  desc: "Plain Text",        color: "bg-slate-600" },
  { id: "html", label: "HTML", desc: "Web Page",          color: "bg-orange-600" },
  { id: "md",   label: "MD",   desc: "Markdown",          color: "bg-blue-600" },
]

export function DocumentConverterCanvas() {
  const { files } = useWorkspaceStore()
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("pdf")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null
  const inputExt = activeFile?.name.split(".").pop()?.toLowerCase() || "unknown"
  const inputLabel = SUPPORTED_INPUTS[inputExt] || "Document File"

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <FileText className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload a document to convert it.</p>
        <p className="text-sm text-center max-w-xs">Supports: {Object.keys(SUPPORTED_INPUTS).join(", ").toUpperCase()}</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      let extractedText = ""
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      setProgress(10)

      if (inputExt === "pdf") {
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        const arrayBuffer = await activeFile.arrayBuffer()
        const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
        const total = pdfDoc.numPages
        for (let i = 1; i <= total; i++) {
          const page = await pdfDoc.getPage(i)
          const content = await page.getTextContent()
          extractedText += content.items.map((item: any) => item.str).join(" ") + "\n\n"
          setProgress(10 + Math.round((i / total) * 40))
        }
      } else if (["html", "htm"].includes(inputExt)) {
        const raw = await activeFile.text()
        extractedText = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                          .replace(/<[^>]*>/g, " ")
                          .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
                          .replace(/\s+/g, " ").trim()
        setProgress(50)
      } else {
        const raw = await activeFile.text()
        extractedText = raw.replace(/<[^>]*>/g, " ")
                          .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
                          .replace(/\s+/g, " ").trim()
        setProgress(50)
      }

      if (!extractedText.trim()) throw new Error("No text content could be extracted from this file.")
      setProgress(60)

      let outputBlob: Blob

      if (targetFormat === "pdf") {
        const pdfDoc = await PDFDocument.create()
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontSize = 11
        const margin = 50
        const lineHeight = fontSize * 1.5
        const A4_W = 595.28
        const A4_H = 841.89
        const maxWidth = A4_W - margin * 2

        const words = extractedText.split(" ").filter(Boolean)
        const lines: string[] = []
        let currentLine = ""
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        }
        if (currentLine) lines.push(currentLine)

        let lineIndex = 0
        while (lineIndex < lines.length) {
          const page = pdfDoc.addPage([A4_W, A4_H])
          let y = A4_H - margin
          while (lineIndex < lines.length && y > margin) {
            page.drawText(lines[lineIndex], { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
            y -= lineHeight
            lineIndex++
          }
        }

        setProgress(90)
        const pdfBytes = await pdfDoc.save()
        outputBlob = new Blob([pdfBytes as any], { type: "application/pdf" })

      } else if (targetFormat === "txt") {
        outputBlob = new Blob([extractedText], { type: "text/plain" })
        setProgress(90)

      } else if (targetFormat === "html") {
        const paragraphs = extractedText.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${baseName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; line-height: 1.7; color: #374151; }
    p { margin-bottom: 1em; }
    h1 { color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>${baseName}</h1>
  ${paragraphs.map(p => `<p>${p}</p>`).join("\n  ")}
</body>
</html>`
        outputBlob = new Blob([html], { type: "text/html" })
        setProgress(90)

      } else {
        const paragraphs = extractedText.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
        const md = `# ${baseName}\n\n${paragraphs.join("\n\n")}`
        outputBlob = new Blob([md], { type: "text/markdown" })
        setProgress(90)
      }

      const url = URL.createObjectURL(outputBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${baseName}.${targetFormat}`
      a.click()
      URL.revokeObjectURL(url)

      setProgress(100)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const outputInfo = OUTPUT_FORMATS.find(f => f.id === targetFormat)!

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shrink-0">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Document Converter</h2>
          <p className="text-sm text-slate-500">Convert between document formats seamlessly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0">
        
        {/* Left Side: Preview area */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center overflow-hidden relative shadow-inner aspect-square lg:aspect-auto lg:h-[400px] border border-slate-200 dark:border-slate-800 p-8 text-center">
           <FileText className="w-24 h-24 text-indigo-200 dark:text-indigo-900 mb-6" />
           <div className="max-w-[80%]">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 truncate mb-1" title={activeFile.name}>{activeFile.name}</h3>
              <p className="text-sm text-slate-500 uppercase">{inputExt} File</p>
           </div>
           
           <div className="mt-8 flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
             <span className="font-bold text-slate-500 uppercase">{inputExt}</span>
             <ArrowRight className="w-4 h-4 text-slate-300" />
             <span className={`font-bold uppercase ${outputInfo.color.replace('bg-', 'text-')}`}>{targetFormat}</span>
           </div>
        </div>

        {/* Right Side: Options & Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{inputLabel}</label>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 rounded-lg">
              <FileText className="w-4 h-4 shrink-0 text-indigo-500" />
              <span className="truncate">{activeFile.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Convert To</label>
            <div className="grid grid-cols-2 gap-2">
              {OUTPUT_FORMATS.map(f => (
                <button key={f.id} onClick={() => setTargetFormat(f.id)}
                  disabled={f.id === inputExt}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all ${
                    targetFormat === f.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : f.id === inputExt
                      ? "border-transparent bg-slate-50 dark:bg-slate-700/40 text-slate-400 cursor-not-allowed"
                      : "border-transparent bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 cursor-pointer"
                  }`}>
                  <span className="font-bold text-lg uppercase">{f.label}</span>
                  <span className="text-xs opacity-70 mt-1">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2 text-amber-700 dark:text-amber-400 text-xs">
            <FileWarning className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Text content is extracted and reformatted. Images, charts, and complex layouts may not transfer. Works best with text-heavy documents.</span>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500"><span>Converting...</span><span>{progress}%</span></div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {isDone && (
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <CheckCircle className="w-5 h-5" /> Converted & downloaded!
            </div>
          )}

          <button onClick={handleProcess} disabled={isProcessing || targetFormat === inputExt}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            <span>{isProcessing ? "Converting..." : `Convert to ${targetFormat.toUpperCase()} & Download`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
