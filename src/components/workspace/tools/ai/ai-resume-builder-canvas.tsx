"use client"

import { useState, useRef } from "react"
import { Sparkles, Loader2, Download, FileText, Briefcase, FileBadge2 } from "lucide-react"
import { toast } from "sonner"


type ResumeData = {
  name: string
  contact: string
  title: string
  summary: string
  skills: string[]
  experience: { company: string; role: string; duration: string; bullets: string[] }[]
  education: { institution: string; degree: string; year: string }[]
}

export function AiResumeBuilderCanvas() {
  const [jobTitle, setJobTitle] = useState("")
  const [rawDetails, setRawDetails] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  
  const resumeRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!rawDetails.trim()) {
      toast.error("Please enter your details first.")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawDetails, jobTitle })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate resume")
      
      setResumeData(data.resume)
      toast.success("Resume generated successfully!")
    } catch (err: Error | unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async () => {
    if (!resumeRef.current) return
    
    toast.info("Preparing PDF download...")
    
    // Dynamic import to prevent SSR window reference error
    const html2pdf = (await import("html2pdf.js")).default

    const element = resumeRef.current
    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     `${resumeData?.name?.replace(/\s+/g, '_') || 'My'}_Resume.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    html2pdf().set(opt as any).from(element).save().then(() => {
        toast.success("PDF Downloaded!")
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[580px] w-full rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3.5 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center shrink-0 border border-black/10 shadow-2xs">
              <FileBadge2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">AI Resume</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">ATS-Optimized Builder</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 dark:text-white text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Your Experience & History</label>
            <p className="text-xs text-slate-500 mb-2">Paste your LinkedIn text, old resume, or a rough list of skills and achievements. AI will structure and polish it into ATS-winning bullet points.</p>
            <textarea
              value={rawDetails}
              onChange={(e) => setRawDetails(e.target.value)}
              placeholder="E.g. My name is Alex. I worked at Google for 3 years as a dev using React and Node. Before that I was at a startup..."
              className="w-full h-56 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none text-slate-900 dark:text-white text-sm font-medium leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !rawDetails.trim()}
            className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] disabled:opacity-50 text-slate-950 font-semibold text-sm sm:text-base rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all border border-black/10 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            <span>{isGenerating ? 'Structuring Resume...' : 'Generate Resume'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4 md:p-8 flex flex-col items-center min-h-[440px]">
        
        {!resumeData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md py-12">
             <div className="w-16 h-16 bg-[#D7FB8E] text-slate-950 border border-black/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
               <FileText className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Preview Your Resume</h3>
             <p className="text-sm text-slate-500">Provide your details and click generate. AI will build a professional, ATS-optimized resume right here.</p>
          </div>
        ) : (
          <div className="w-full max-w-[210mm] flex flex-col">
            <div className="flex justify-end mb-4">
               <button 
                 onClick={downloadPDF}
                 className="bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 px-5 py-2.5 rounded-xl border border-black/10 shadow-sm font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
               >
                 <Download className="w-4 h-4" />
                 Download PDF
               </button>
            </div>
            
            {/* A4 Paper Container for Resume */}
            <div className="w-full bg-white shadow-xl min-h-[297mm] mx-auto p-12 text-slate-900" style={{ fontFamily: "Arial, sans-serif" }}>
              <div ref={resumeRef} className="w-full h-full text-[11pt] leading-[1.5]">
                 
                 {/* Header */}
                 <div className="text-center mb-6 border-b-2 border-slate-800 pb-4">
                    <h1 contentEditable suppressContentEditableWarning className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-1 outline-none focus:bg-blue-50/50 rounded">{resumeData.name}</h1>
                    <h2 contentEditable suppressContentEditableWarning className="text-xl font-medium text-slate-600 mb-2 outline-none focus:bg-blue-50/50 rounded">{resumeData.title}</h2>
                    <p contentEditable suppressContentEditableWarning className="text-sm text-slate-500 font-medium outline-none focus:bg-blue-50/50 rounded">{resumeData.contact}</p>
                 </div>

                 {/* Summary */}
                 {resumeData.summary && (
                   <div className="mb-5">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Professional Summary</h3>
                      <p contentEditable suppressContentEditableWarning className="text-justify text-slate-700 outline-none focus:bg-blue-50/50 rounded">{resumeData.summary}</p>
                   </div>
                 )}

                 {/* Skills */}
                 {resumeData.skills && resumeData.skills.length > 0 && (
                   <div className="mb-5">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Core Competencies</h3>
                      <p contentEditable suppressContentEditableWarning className="text-slate-700 outline-none focus:bg-blue-50/50 rounded">{resumeData.skills.join(" • ")}</p>
                   </div>
                 )}

                 {/* Experience */}
                 {resumeData.experience && resumeData.experience.length > 0 && (
                   <div className="mb-5">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Professional Experience</h3>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp, i) => (
                          <div key={i}>
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 text-[12pt] outline-none focus:bg-blue-50/50 rounded">{exp.role}</h4>
                                <span contentEditable suppressContentEditableWarning className="text-sm font-semibold text-slate-600 outline-none focus:bg-blue-50/50 rounded">{exp.duration}</span>
                             </div>
                             <div contentEditable suppressContentEditableWarning className="text-slate-700 font-medium italic mb-2 outline-none focus:bg-blue-50/50 rounded">{exp.company}</div>
                             <ul className="list-disc pl-5 space-y-1 text-slate-700 marker:text-slate-400">
                               {exp.bullets.map((bullet, bIdx) => (
                                 <li key={bIdx} contentEditable suppressContentEditableWarning className="outline-none focus:bg-blue-50/50 rounded">{bullet}</li>
                               ))}
                             </ul>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}

                 {/* Education */}
                 {resumeData.education && resumeData.education.length > 0 && (
                   <div className="mb-5">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Education</h3>
                      <div className="space-y-2">
                        {resumeData.education.map((edu, i) => (
                          <div key={i} className="flex justify-between items-baseline">
                             <div>
                                <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 outline-none focus:bg-blue-50/50 rounded">{edu.degree}</h4>
                                <div contentEditable suppressContentEditableWarning className="text-slate-700 outline-none focus:bg-blue-50/50 rounded">{edu.institution}</div>
                             </div>
                             <span contentEditable suppressContentEditableWarning className="text-sm font-semibold text-slate-600 outline-none focus:bg-blue-50/50 rounded">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
