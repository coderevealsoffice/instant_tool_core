"use client"

import { useState, useRef } from "react"
import { FileText, Copy, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Tesseract from "tesseract.js"

export function TextExtractorCanvas() {
  const [image, setImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file")
      return
    }

    const url = URL.createObjectURL(file)
    setImage(url)
    setExtractedText("")
  }

  const extractText = async () => {
    if (!image) return
    
    setIsExtracting(true)
    setProgress(0)
    setExtractedText("")

    try {
      const result = await Tesseract.recognize(
        image,
        'eng',
        { logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }}
      )
      
      setExtractedText(result.data.text)
      toast.success("Text extracted successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to extract text from image")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText)
    toast.success("Text copied to clipboard")
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-2xl">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image to Text (OCR)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Extract text from any image instantly using AI</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6">
        
        {/* Upload & Preview Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Upload Image</label>
            
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm mt-1">PNG, JPG, JPEG up to 10MB</p>
              </div>
            ) : (
              <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <img src={image} alt="Upload preview" className="max-h-[300px] object-contain" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-800/90 rounded-lg text-sm font-semibold text-red-600 shadow-sm"
                >
                  Remove
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden" 
            />

            <button 
              onClick={extractText}
              disabled={!image || isExtracting}
              className="mt-6 w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting... {progress}%
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Extract Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Extracted Text</label>
              <button 
                onClick={handleCopy} 
                disabled={!extractedText}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              {isExtracting ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
                  <p>Analyzing image and extracting text...</p>
                </div>
              ) : extractedText ? (
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full h-full bg-transparent resize-none outline-none text-slate-800 dark:text-slate-200"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-center">
                  <p>Extracted text will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
