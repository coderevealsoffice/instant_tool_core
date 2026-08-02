const fs = require('fs');

const tools = [
  { file: 'pdf-to-jpg-canvas.tsx', name: 'PdfToJpgCanvas', title: 'PDF to JPG', icon: 'FileImage', color: 'bg-orange-500', inLabel: 'PDF File', outExt: 'zip', mockData: 'mock zip' },
  { file: 'pdf-to-png-canvas.tsx', name: 'PdfToPngCanvas', title: 'PDF to PNG', icon: 'FileImage', color: 'bg-sky-500', inLabel: 'PDF File', outExt: 'zip', mockData: 'mock zip' },
  { file: 'pdf-to-word-canvas.tsx', name: 'PdfToWordCanvas', title: 'PDF to Word', icon: 'FileText', color: 'bg-blue-600', inLabel: 'PDF File', outExt: 'docx', mockData: 'mock docx' },
  { file: 'pdf-to-excel-canvas.tsx', name: 'PdfToExcelCanvas', title: 'PDF to Excel', icon: 'Table', color: 'bg-emerald-600', inLabel: 'PDF File', outExt: 'xlsx', mockData: 'mock xlsx' },
  { file: 'pdf-to-html-canvas.tsx', name: 'PdfToHtmlCanvas', title: 'PDF to HTML', icon: 'Code', color: 'bg-orange-600', inLabel: 'PDF File', outExt: 'html', mockData: '<html><body>Mock HTML</body></html>' },
  { file: 'word-to-pdf-canvas.tsx', name: 'WordToPdfCanvas', title: 'Word to PDF', icon: 'FileText', color: 'bg-blue-600', inLabel: 'Word Document', outExt: 'pdf', mockData: 'mock pdf' },
  { file: 'excel-to-pdf-canvas.tsx', name: 'ExcelToPdfCanvas', title: 'Excel to PDF', icon: 'Table', color: 'bg-emerald-600', inLabel: 'Excel Spreadsheet', outExt: 'pdf', mockData: 'mock pdf' },
  { file: 'ppt-to-pdf-canvas.tsx', name: 'PptToPdfCanvas', title: 'PPT to PDF', icon: 'Presentation', color: 'bg-orange-500', inLabel: 'PowerPoint Presentation', outExt: 'pdf', mockData: 'mock pdf' },
  { file: 'document-converter-canvas.tsx', name: 'DocumentConverterCanvas', title: 'Document Converter', icon: 'FileText', color: 'bg-indigo-600', inLabel: 'Document File', outExt: 'pdf', mockData: 'mock pdf' },
  { file: 'font-converter-canvas.tsx', name: 'FontConverterCanvas', title: 'Font Converter', icon: 'Type', color: 'bg-pink-600', inLabel: 'Font File', outExt: 'woff2', mockData: 'mock woff2' },
  { file: 'ebook-converter-canvas.tsx', name: 'EbookConverterCanvas', title: 'Ebook Converter', icon: 'Book', color: 'bg-yellow-600', inLabel: 'Ebook File', outExt: 'epub', mockData: 'mock epub' },
  { file: 'archive-converter-canvas.tsx', name: 'ArchiveConverterCanvas', title: 'Archive Converter', icon: 'Archive', color: 'bg-slate-700', inLabel: 'Archive File', outExt: 'zip', mockData: 'mock zip' },
  { file: 'archive-extractor-canvas.tsx', name: 'ArchiveExtractorCanvas', title: 'Archive Extractor', icon: 'ArchiveX', color: 'bg-slate-800', inLabel: 'Archive File', outExt: 'zip', mockData: 'mock zip' },
  { file: 'protect-pdf-canvas.tsx', name: 'ProtectPdfCanvas', title: 'Protect PDF', icon: 'Lock', color: 'bg-red-600', inLabel: 'PDF File', outExt: 'pdf', mockData: 'mock protected pdf' },
  { file: 'unlock-pdf-canvas.tsx', name: 'UnlockPdfCanvas', title: 'Unlock PDF', icon: 'Unlock', color: 'bg-green-600', inLabel: 'PDF File', outExt: 'pdf', mockData: 'mock unlocked pdf' },
  { file: 'compress-pdf-canvas.tsx', name: 'CompressPdfCanvas', title: 'Compress PDF', icon: 'Minimize', color: 'bg-rose-500', inLabel: 'PDF File', outExt: 'pdf', mockData: 'mock compressed pdf' },
];

tools.forEach(t => {
  const content = `"use client"

import { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ${t.icon}, Loader2, CheckCircle, Play } from "lucide-react"

export function ${t.name}() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isProcessing) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            finishProcessing()
            return 100
          }
          return p + 5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isProcessing])

  const finishProcessing = () => {
    setIsProcessing(false)
    setIsDone(true)
    
    // Create a mock downloaded file
    const blob = new Blob(["${t.mockData}"], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const baseName = activeFile?.name.replace(/\\.[^/.]+$/, "") || "file"
    a.download = \`\${baseName}-${t.title.replace(/\\s+/g, '-').toLowerCase()}.${t.outExt}\`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <${t.icon} className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a file to get started.</p>
      </div>
    )
  }

  const handleProcess = () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full space-y-6">
      <div className="w-20 h-20 rounded-2xl ${t.color} flex items-center justify-center shadow-2xl">
        <${t.icon} className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">${t.title}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">${t.inLabel}</label>
          <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg truncate">{activeFile.name}</div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-xs text-center">
          Note: This is a simulated frontend mock. Real file conversion requires a backend engine.
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500"><span>Processing...</span><span>{progress}%</span></div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="${t.color.replace('bg-', 'bg-')} h-2 rounded-full transition-all" style={{ width: \`\${progress}%\` }} />
            </div>
          </div>
        )}
        {isDone && <div className="flex items-center space-x-2 text-emerald-600"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Done! Mock file downloaded.</span></div>}

        <button onClick={handleProcess} disabled={isProcessing}
          className="w-full ${t.color} hover:opacity-90 disabled:opacity-50 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all">
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          <span>{isProcessing ? "Processing..." : "Process & Download"}</span>
        </button>
      </div>
    </div>
  )
}
`;
  fs.writeFileSync(`src/components/workspace/tools/${t.file}`, content);
});
console.log('Mocks generated!');
