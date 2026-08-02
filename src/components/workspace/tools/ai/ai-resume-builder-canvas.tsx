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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileBadge2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Resume</h2>
              <p className="text-sm text-slate-500">ATS-Friendly Builder</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-700 dark:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Your Details (Dump Everything)</label>
            <p className="text-xs text-slate-500 mb-2">Paste your LinkedIn profile text, old resume, or just a messy list of your skills and work history. AI will structure and rewrite it professionally.</p>
            <textarea
              value={rawDetails}
              onChange={(e) => setRawDetails(e.target.value)}
              placeholder="E.g. My name is Alex. I worked at Google for 3 years as a dev using React and Node. Before that I was at a startup..."
              className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !rawDetails.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-4 flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {isGenerating ? 'Structuring Resume...' : 'Generate Resume'}
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
        
        {!resumeData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md">
             <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-6">
               <FileText className="w-12 h-12" />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Preview Your Resume</h3>
             <p className="text-slate-500">Provide your details and click generate. AI will build a professional, ATS-optimized resume right here.</p>
          </div>
        ) : (
          <div className="w-full max-w-[210mm] flex flex-col">
            <div className="flex justify-end mb-4">
               <button 
                 onClick={downloadPDF}
                 className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm font-semibold flex items-center transition-colors"
               >
                 <Download className="w-4 h-4 mr-2" />
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
