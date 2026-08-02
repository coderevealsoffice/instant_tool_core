"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Image as ImageIcon, UploadCloud, FileImage, Loader2, Download, Trash2, CheckCircle, Settings2 } from "lucide-react"
import { toast } from "sonner"
import imageCompression from "browser-image-compression"

interface CompFile {
  file: File;
  previewUrl: string;
  id: string;
  status: "idle" | "compressing" | "done" | "error";
  compressedBlob?: File;
  compressedUrl?: string;
  errorMsg?: string;
  originalSize: number;
  newSize?: number;
}

export function BulkImageCompressorCanvas() {
  const [files, setFiles] = useState<CompFile[]>([])
  const [isCompressingAll, setIsCompressingAll] = useState(false)
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
      status: "idle" as const,
      originalSize: file.size
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    }
  })

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRem = prev.find(f => f.id === id);
      if (fileToRem) {
         if (fileToRem.previewUrl) URL.revokeObjectURL(fileToRem.previewUrl);
         if (fileToRem.compressedUrl) URL.revokeObjectURL(fileToRem.compressedUrl);
      }
      return prev.filter(f => f.id !== id);
    })
  }

  const compressFile = async (id: string) => {
    const targetFile = files.find(f => f.id === id)
    if (!targetFile || targetFile.status === "done") return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "compressing" } : f))

    const options = {
      maxSizeMB: 5, // A generous upper limit
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      initialQuality: quality,
      alwaysKeepResolution: false
    }

    try {
      const compressedFile = await imageCompression(targetFile.file, options)
      const compressedUrl = URL.createObjectURL(compressedFile)

      setFiles(prev => prev.map(f => 
        f.id === id ? { 
            ...f, 
            status: "done", 
            compressedBlob: compressedFile, 
            compressedUrl,
            newSize: compressedFile.size
        } : f
      ))
    } catch (error: any) {
      console.error(error)
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: "error", errorMsg: error.message || "Compression failed" } : f
      ))
      toast.error(`Failed to compress ${targetFile.file.name}`)
    }
  }

  const compressAll = async () => {
    setIsCompressingAll(true)
    const pendingFiles = files.filter(f => f.status === "idle" || f.status === "error")
    
    // Process sequentially to not overload browser memory
    for (const file of pendingFiles) {
       await compressFile(file.id);
    }
    
    setIsCompressingAll(false)
    toast.success("All images compressed!")
  }

  const downloadFile = (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file || !file.compressedUrl || !file.compressedBlob) return;

    const a = document.createElement("a");
    a.href = file.compressedUrl;
    // Prefix original name to avoid overwrites
    a.download = `min_${file.compressedBlob.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const formatSize = (bytes: number) => {
      return (bytes / 1024 / 1024).toFixed(2) + " MB"
  }

  const calculateSavings = (oldS: number, newS: number) => {
      const saving = ((oldS - newS) / oldS) * 100
      return saving > 0 ? saving.toFixed(0) : "0"
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <FileImage className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bulk Image Compressor</h2>
            <p className="text-sm text-slate-500">Compress JPG, PNG, and WebP images locally without losing quality.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Sidebar */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
               <Settings2 className="w-4 h-4 text-slate-500" /> Compression Settings
            </h3>
            
            <div className="space-y-5">
                <div>
                    <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        Quality <span className="text-slate-500">{Math.round(quality * 100)}%</span>
                    </label>
                    <input 
                        type="range" min="0.1" max="1" step="0.1" 
                        value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Lower quality = smaller file size</p>
                </div>
                
                <div>
                    <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        Max Width/Height <span className="text-slate-500">{maxWidth}px</span>
                    </label>
                    <input 
                        type="range" min="800" max="3840" step="100" 
                        value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                        className="w-full accent-emerald-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Resize large images to fit this dimension</p>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
            <div 
                {...getRootProps()} 
                className={`bg-white p-10 rounded-2xl shadow-sm border-2 border-dashed transition-all cursor-pointer text-center
                ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <p className="text-slate-600 font-medium mb-1">
                {isDragActive ? "Drop images here..." : "Drag & drop images here"}
                </p>
                <p className="text-sm text-slate-400">JPG, PNG, WebP allowed</p>
            </div>

            {files.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Files to Compress ({files.length})</h3>
                        
                        {files.some(f => f.status === "idle" || f.status === "error") && (
                            <button
                                onClick={compressAll}
                                disabled={isCompressingAll}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                            >
                                {isCompressingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
                                Compress All
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {files.map((file) => (
                            <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 max-w-[200px] truncate" title={file.file.name}>{file.file.name}</p>
                                        <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
                                            <span className="text-slate-500">{formatSize(file.originalSize)}</span>
                                            {file.newSize && (
                                                <>
                                                    <span className="text-slate-300">→</span>
                                                    <span className="text-emerald-600">{formatSize(file.newSize)}</span>
                                                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">
                                                        -{calculateSavings(file.originalSize, file.newSize)}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                    {file.status === "idle" && (
                                        <button onClick={() => compressFile(file.id)} className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50">
                                            Compress
                                        </button>
                                    )}
                                    {file.status === "compressing" && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 px-2">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Compressing
                                        </span>
                                    )}
                                    {file.status === "error" && (
                                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">Failed</span>
                                    )}
                                    {file.status === "done" && (
                                        <button onClick={() => downloadFile(file.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors">
                                            <Download className="w-3 h-3" /> Save
                                        </button>
                                    )}
                                    
                                    <button onClick={() => removeFile(file.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
