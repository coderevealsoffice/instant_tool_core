"use client"

import { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ArchiveX, File as FileIcon, Download, Loader2, CheckCircle, FolderDown } from "lucide-react"
import JSZip from "jszip"
import { toast } from "sonner"
import { Archive } from "libarchive.js"

// Initialize libarchive worker
Archive.init({
  workerUrl: "/libarchive/worker-bundle.js",
})

export function ArchiveExtractorCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [extractedFiles, setExtractedFiles] = useState<{ name: string; blob: Blob; size: number }[]>([])
  const [isZipping, setIsZipping] = useState(false)

  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    if (activeFile) {
      handleProcess(activeFile)
    }
  }, [activeFile?.name])

  const flattenFiles = (obj: any, currentPath = ""): { name: string; blob: Blob; size: number }[] => {
    let result: { name: string; blob: Blob; size: number }[] = []
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof File || value instanceof Blob) {
        result.push({ name: currentPath + key, blob: value, size: value.size })
      } else if (typeof value === "object" && value !== null) {
        result = result.concat(flattenFiles(value, currentPath + key + "/"))
      }
    }
    return result
  }

  const handleProcess = async (file: File) => {
    setIsProcessing(true)
    setExtractedFiles([])
    setIsDone(false)
    try {
      let fileList: { name: string; blob: Blob; size: number }[] = []

      // Check if it's a standard zip (fallback to JSZip for speed if preferred, but let's try libarchive for all)
      try {
        const archive = await Archive.open(file)
        const extractedObj = await archive.extractFiles()
        fileList = flattenFiles(extractedObj)
      } catch (e) {
        console.warn("libarchive failed, trying JSZip fallback", e)
        const zip = new JSZip()
        const loadedZip = await zip.loadAsync(file)
        const promises: Promise<void>[] = []
        loadedZip.forEach((relativePath, zipFile) => {
          if (!zipFile.dir) {
            promises.push(
              zipFile.async("blob").then(blob => {
                fileList.push({ name: relativePath, blob, size: blob.size })
              })
            )
          }
        })
        await Promise.all(promises)
      }

      fileList.sort((a, b) => a.name.localeCompare(b.name))
      setExtractedFiles(fileList)
      setIsDone(true)
      toast.success(`Extracted ${fileList.length} files successfully!`)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to read the archive. Please ensure it is a valid supported format (ZIP, RAR, 7Z, TAR, etc).")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadFile = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name.split("/").pop() || name
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAsZipFolder = async () => {
    if (extractedFiles.length === 0) return
    setIsZipping(true)
    try {
      const zip = new JSZip()
      extractedFiles.forEach(f => {
        zip.file(f.name, f.blob)
      })
      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      const originalName = activeFile?.name.replace(/\.[^/.]+$/, "") || "ExtractedFolder"
      a.download = `${originalName}.zip`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Folder downloaded successfully!")
    } catch (e) {
      console.error("Zipping failed", e)
      toast.error("Failed to create the folder ZIP.")
    } finally {
      setIsZipping(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!activeFile) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full text-slate-400 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('archive-upload')?.click()}
      >
        <input 
          id="archive-upload" 
          type="file" 
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              useWorkspaceStore.getState().addFiles([file])
            }
          }}
        />
        <ArchiveX className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">No archive selected</p>
        <p className="text-sm">Click here to upload an archive (RAR, ZIP, 7Z, TAR) to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-8 gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center shadow-lg shrink-0">
          <ArchiveX className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Archive Extractor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Extract files from RAR, ZIP, 7Z, TAR in your browser.</p>
        </div>
      </div>

      {/* File info bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-5 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <ArchiveX className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">{activeFile.name}</p>
            <p className="text-xs text-slate-400">{formatSize(activeFile.size)}</p>
          </div>
        </div>
        {isDone && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600">{extractedFiles.length} files</span>
          </div>
        )}
      </div>

      {/* Processing state */}
      {isProcessing && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Extracting archive (this might take a moment)...</p>
        </div>
      )}

      {/* File list */}
      {isDone && !isProcessing && (
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {/* List header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 gap-4">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{extractedFiles.length} files found</span>
            
            <button
              onClick={downloadAsZipFolder}
              disabled={isZipping}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />}
              {isZipping ? "Creating Folder..." : "Download as Folder (ZIP)"}
            </button>
          </div>

          {/* Scrollable file list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {extractedFiles.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileIcon className="w-4 h-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{f.name.split("/").pop()}</p>
                    {f.name.includes("/") && (
                      <p className="text-xs text-slate-400 truncate">{f.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <span className="text-xs text-slate-400">{formatSize(f.size)}</span>
                  <button
                    onClick={() => downloadFile(f.name, f.blob)}
                    title="Download File"
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
