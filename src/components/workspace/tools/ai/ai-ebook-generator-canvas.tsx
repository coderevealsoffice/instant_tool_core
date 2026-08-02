"use client"

import { useState, useRef } from "react"
import { BookOpen, Sparkles, Loader2, CheckCircle, Download, FileText, ChevronRight } from "lucide-react"
import { toast } from "sonner"


type Chapter = {
  title: string
  description: string
  content?: string
}

export function AiEbookGeneratorCanvas() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [topic, setTopic] = useState("")
  const [bookType, setBookType] = useState("Educational / Guide")
  const [authorName, setAuthorName] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)

  const previewRef = useRef<HTMLDivElement>(null)

  const handleGenerateStructure = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your ebook.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-ebook/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, bookType, authorName })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate structure")
      
      setChapters(data.chapters || [])
      setStep(2)
      toast.success("Ebook structure generated!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    setStep(3)
    setCurrentChapterIndex(0)
    
    const updatedChapters = [...chapters]
    
    // Generate chapter by chapter to prevent timeouts
    for (let i = 0; i < updatedChapters.length; i++) {
      setCurrentChapterIndex(i)
      try {
        const res = await fetch("/api/ai-ebook/chapter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            bookType,
            authorName,
            chapterTitle: updatedChapters[i].title,
            chapterDescription: updatedChapters[i].description,
            bookContext: chapters.map(c => c.title) // Send outline context
          })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `Failed to generate chapter ${i + 1}`)
        
        updatedChapters[i].content = data.content
        setChapters([...updatedChapters]) // Update UI progressively
      } catch (err: Error | unknown) {
        console.error(err)
        toast.error(`Error generating ${updatedChapters[i].title}: ${err instanceof Error ? err.message : "An error occurred"}`)
        setIsGenerating(false)
        return // Stop on error
      }
    }
    
    setIsGenerating(false)
    setStep(4)
    toast.success("Ebook generation complete!")
  }

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return
    
    toast.info("Preparing PDF for download...")
    const html2pdf = (await import("html2pdf.js")).default
    
    const element = previewRef.current
    
    const opt = {
      margin:       15,
      filename:     `${topic.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    }
    
    // Apply temporary styles for better PDF rendering
    const originalStyles = element.getAttribute('style')
    // Remove max-height and overflow so html2pdf captures everything
    element.setAttribute('style', 'max-height: none !important; overflow: visible !important;')

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore styles
      if (originalStyles) {
        element.setAttribute('style', originalStyles)
      } else {
        element.removeAttribute('style')
      }
      toast.success("Download started!")
    })
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      {/* Main Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
              <span className={`px-2 py-1 rounded-md ${step >= 1 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}>1. Topic</span>
              <ChevronRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded-md ${step >= 2 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}>2. Structure</span>
              <ChevronRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded-md ${step >= 3 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}>3. Content</span>
              <ChevronRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded-md ${step === 4 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}`}>4. PDF</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
            {step === 1 && (
              <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mb-2">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">Design Your Ebook</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg text-center mb-4">Provide details below and AI will generate a complete, structured PDF ebook.</p>
                
                <div className="w-full space-y-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  
                  {/* Topic Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Book Topic / Title</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. A Complete Guide to Next.js 15..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  {/* Book Type & Author */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Book Type</label>
                      <input
                        type="text"
                        value={bookType}
                        onChange={(e) => setBookType(e.target.value)}
                        placeholder="e.g. Technical Guide, Fiction, Storybook"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Author Name (Optional)</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Book Cover (Optional)</label>
                     <div className="flex items-center gap-4">
                       {coverImageUrl && (
                         <img src={coverImageUrl} alt="Cover Preview" className="w-16 h-24 object-cover rounded-md border border-slate-200 dark:border-slate-700 shadow-sm" />
                       )}
                       <div className="flex-1">
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0]
                             if (file) {
                               setCoverImage(file)
                               setCoverImageUrl(URL.createObjectURL(file))
                             }
                           }}
                           className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 cursor-pointer"
                         />
                       </div>
                     </div>
                  </div>

                  <button
                    onClick={handleGenerateStructure}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isGenerating ? 'Generating Structure...' : 'Start Generating'}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Table of Contents</h2>
                  <p className="text-slate-500">Review the generated structure before we write the full content.</p>
                </div>
                
                <div className="space-y-4">
                  {chapters.map((chapter, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-4">
                      <div className="w-10 h-10 shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{chapter.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{chapter.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Back to Topic
                  </button>
                  <button
                    onClick={handleGenerateContent}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-4 flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Full Ebook</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-8">
                <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Writing your Ebook...</h2>
                  <p className="text-slate-500 mb-6">AI is generating the content chapter by chapter. Please don&apos;t close this tab.</p>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 mb-4 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-center relative overflow-hidden"
                      style={{ width: (((currentChapterIndex) / chapters.length) * 100) + '%' }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]"></div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-800 inline-block">
                    Generating Chapter {currentChapterIndex + 1} of {chapters.length}: <br/>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{chapters[currentChapterIndex]?.title}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                   <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ebook Preview</h2>
                      <p className="text-slate-500">Your ebook is ready to be downloaded.</p>
                   </div>
                   <button
                      onClick={handleDownloadPdf}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 py-3 flex items-center space-x-2 transition-transform active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                   </button>
                </div>
                
                {/* The element to be converted to PDF */}
                <div 
                   ref={previewRef}
                   className="bg-white text-slate-900 p-10 md:p-16 shadow-2xl rounded-sm mx-auto overflow-hidden prose prose-slate prose-indigo max-w-none"
                   style={{ maxWidth: '210mm', minHeight: '297mm' }} // A4 proportions
                >
                   {/* Cover Page */}
                   <div className="flex flex-col items-center justify-center h-[240mm] text-center border-b-2 border-indigo-100 mb-16" style={{ pageBreakAfter: 'always' }}>
                      {coverImageUrl ? (
                        <img src={coverImageUrl} alt="Book Cover" className="w-64 h-auto max-h-96 object-cover rounded-xl shadow-2xl mb-12" />
                      ) : (
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-8">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      
                      <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight max-w-3xl">{topic}</h1>
                      <p className="text-xl text-slate-500 font-medium tracking-widest uppercase mb-8">{bookType}</p>
                      
                      {authorName && (
                        <div className="mt-auto pb-12">
                           <p className="text-slate-400 text-lg uppercase tracking-wider mb-2">Written By</p>
                           <p className="text-3xl font-bold text-slate-800">{authorName}</p>
                        </div>
                      )}
                   </div>

                   {/* Content Pages */}
                   {chapters.map((chapter, idx) => (
                     <div key={idx} className="mb-12" style={{ pageBreakAfter: idx < chapters.length - 1 ? 'always' : 'auto' }}>
                       {chapter.content ? (
                         <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                       ) : (
                         <div className="text-red-500">Failed to generate content for this chapter.</div>
                       )}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
