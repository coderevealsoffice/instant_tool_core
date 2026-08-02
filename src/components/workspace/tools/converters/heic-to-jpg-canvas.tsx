"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Image as ImageIcon, UploadCloud, FileType2, Loader2, Download, Trash2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import heic2any from "heic2any"

interface HeicFile {
  file: File;
  previewUrl: string;
  id: string;
  status: "idle" | "converting" | "done" | "error";
  jpgBlob?: Blob;
  jpgUrl?: string;
  errorMsg?: string;
}

export function HeicToJpgCanvas() {
  const [files, setFiles] = useState<HeicFile[]>([])
  const [isConvertingAll, setIsConvertingAll] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file), // Note: browsers can't natively render HEIC, but we store it just in case
      id: Math.random().toString(36).substring(7),
      status: "idle" as const,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/heic': ['.heic'],
      'image/heif': ['.heif']
    }
  })

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRem = prev.find(f => f.id === id);
      if (fileToRem) {
         if (fileToRem.previewUrl) URL.revokeObjectURL(fileToRem.previewUrl);
         if (fileToRem.jpgUrl) URL.revokeObjectURL(fileToRem.jpgUrl);
      }
      return prev.filter(f => f.id !== id);
    })
  }

  const convertFile = async (id: string) => {
    const targetFile = files.find(f => f.id === id)
    if (!targetFile || targetFile.status === "done") return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "converting" } : f))

    try {
      const resultBlob = await heic2any({
        blob: targetFile.file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      
      const finalBlob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
      const jpgUrl = URL.createObjectURL(finalBlob);

      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: "done", jpgBlob: finalBlob, jpgUrl } : f
      ))
      toast.success(`${targetFile.file.name} converted!`)
    } catch (error: any) {
      console.error(error)
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: "error", errorMsg: error.message || "Failed to convert" } : f
      ))
      toast.error(`Failed to convert ${targetFile.file.name}`)
    }
  }

  const convertAll = async () => {
    setIsConvertingAll(true)
    const pendingFiles = files.filter(f => f.status === "idle" || f.status === "error")
    
    for (const file of pendingFiles) {
       await convertFile(file.id);
    }
    
    setIsConvertingAll(false)
  }

  const downloadFile = (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file || !file.jpgUrl) return;

    const a = document.createElement("a");
    a.href = file.jpgUrl;
    a.download = file.file.name.replace(/\.heic|\.heif/i, ".jpg");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FileType2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">HEIC to JPG Converter</h2>
            <p className="text-sm text-slate-500">Convert iPhone HEIC photos to standard JPG format. 100% Client-side, no uploads.</p>
          </div>
        </div>
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`bg-white p-10 rounded-2xl shadow-sm border-2 border-dashed transition-all cursor-pointer text-center
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
        <p className="text-slate-600 font-medium mb-1">
          {isDragActive ? "Drop the HEIC files here..." : "Drag & drop HEIC files here, or click to select"}
        </p>
        <p className="text-sm text-slate-400">Supported formats: .heic, .heif</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800">Files ({files.length})</h3>
              
              {files.some(f => f.status === "idle" || f.status === "error") && (
                <button
                  onClick={convertAll}
                  disabled={isConvertingAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {isConvertingAll && <Loader2 className="w-4 h-4 animate-spin" />}
                  Convert All
                </button>
              )}
           </div>

           <div className="space-y-3">
             {files.map((file) => (
               <div key={file.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 overflow-hidden relative">
                       {file.jpgUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={file.jpgUrl} alt="preview" className="w-full h-full object-cover" />
                       ) : (
                         <ImageIcon className="w-5 h-5" />
                       )}
                    </div>
                    <div>
                       <p className="text-sm font-semibold text-slate-800 max-w-[200px] sm:max-w-[300px] truncate">{file.file.name}</p>
                       <p className="text-xs text-slate-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    {file.status === "idle" && (
                       <button onClick={() => convertFile(file.id)} className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50">
                         Convert
                       </button>
                    )}
                    {file.status === "converting" && (
                       <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
                         <Loader2 className="w-3 h-3 animate-spin" /> Converting...
                       </span>
                    )}
                    {file.status === "error" && (
                       <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">Error</span>
                    )}
                    {file.status === "done" && (
                       <>
                         <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                           <CheckCircle className="w-3 h-3" /> Done
                         </span>
                         <button onClick={() => downloadFile(file.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Download JPG">
                           <Download className="w-4 h-4" />
                         </button>
                       </>
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
  )
}
