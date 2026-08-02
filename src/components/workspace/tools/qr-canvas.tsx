import { useWorkspaceStore } from "@/store/workspace-store"
import { QrCode, Type, Link as LinkIcon, Palette } from "lucide-react"
import { useState, useEffect } from "react"
import QRCode from "qrcode"

export function QrCanvas() {
  const { toolParams, setToolParam } = useWorkspaceStore()
  
  const content = toolParams.qrContent || "https://example.com"
  const qrType = toolParams.qrType || "url"
  const fgColor = toolParams.qrFgColor || "#000000"
  const bgColor = toolParams.qrBgColor || "#ffffff"
  
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Generate a live preview
  useEffect(() => {
    const generatePreview = async () => {
      try {
        const url = await QRCode.toDataURL(content, {
          color: {
            dark: fgColor,
            light: bgColor
          },
          margin: 2,
          width: 300
        })
        setPreviewUrl(url)
      } catch (err) {
        console.error("Failed to generate QR preview", err)
      }
    }
    generatePreview()
  }, [content, fgColor, bgColor])

  return (
    <div className="flex h-full flex-col lg:flex-row items-start justify-center w-full gap-6">
      
      {/* Editor Side */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full lg:w-1/2">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <QrCode className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">QR Code Generator</h2>
            <p className="text-sm text-slate-500">Create beautiful, custom QR codes</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              Content Type
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => setToolParam("qrType", "url")}
                className={`flex-1 py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition ${qrType === "url" ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <LinkIcon className="w-4 h-4" /> URL
              </button>
              <button 
                onClick={() => setToolParam("qrType", "text")}
                className={`flex-1 py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition ${qrType === "text" ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
              Enter {qrType === 'url' ? 'Link URL' : 'Text Content'}
            </label>
            {qrType === 'url' ? (
              <input 
                type="url" 
                value={content}
                onChange={(e) => setToolParam("qrContent", e.target.value)}
                placeholder="https://your-website.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition"
              />
            ) : (
              <textarea 
                value={content}
                onChange={(e) => setToolParam("qrContent", e.target.value)}
                placeholder="Enter any text you want to encode..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition resize-none"
              />
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-slate-400" /> Custom Colors
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Foreground Color</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={fgColor}
                    onChange={(e) => setToolParam("qrFgColor", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={fgColor}
                    onChange={(e) => setToolParam("qrFgColor", e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Background Color</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setToolParam("qrBgColor", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={bgColor}
                    onChange={(e) => setToolParam("qrBgColor", e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Live Preview</h3>
        
        {previewUrl ? (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
            <img src={previewUrl} alt="QR Code Preview" className="w-64 h-64 object-contain rounded-lg" />
          </div>
        ) : (
          <div className="w-64 h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
            <QrCode className="w-12 h-12 text-slate-300" />
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm w-full text-center">
          <p>Click <strong>Process Tool</strong> in the top right to finalize and download your high-resolution QR code!</p>
        </div>
      </div>
      
    </div>
  )
}
