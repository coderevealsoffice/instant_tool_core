"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ArrowUpRight, UploadCloud, FileText } from "lucide-react"
import { SupportDonationCTA } from "./SupportDonationCTA"
import { AdSlot } from "@/components/common/AdSlot"

export interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

export interface ZigZagFeature {
  title: string
  description: string
  imageText: string
  color: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Tutorial {
  title: string
  description: string
  link: string
  color: string
}

interface ToolPageTemplateProps {
  title: string
  description?: string
  headerColorClass: string
  toolComponent: React.ReactNode
  category?: string
  slug?: string
  
  topCheckmarks?: string[]
  
  zigZagFeatures?: ZigZagFeature[]
  
  howToTitle?: string
  howToSteps?: string[]
  
  gridTitle?: string
  gridFeatures?: Feature[]
  
  faqTitle?: string
  faqs?: FAQ[]
  
  tutorialsTitle?: string
  tutorials?: Tutorial[]
}

export function ToolPageTemplate({
  title,
  description,
  headerColorClass,
  toolComponent,
  category = "pdf-tools",
  slug = "split-pdf",
  topCheckmarks = ["Fast and easy to use", "Secure connection", "Free to use for basic tasks"],
  zigZagFeatures = [],
  howToTitle = `How to use ${title}`,
  howToSteps = [],
  gridTitle = `Everything you need in a ${title} tool`,
  gridFeatures = [],
  faqTitle = `${title} FAQs`,
  faqs = [],
  tutorialsTitle = `Tutorials on ${title}`,
  tutorials = []
}: ToolPageTemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setContext(category, slug)
      addFiles(newFiles)
      router.push(`/workspace?tool=${slug}&category=${category}`)
    }
  }

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Dynamic category and format helpers tailored to each page
  const categoryLabel = category.replace(/-/g, ' ').toUpperCase()
  const isPdf = category === "pdf-tools" || title.toLowerCase().includes("pdf")
  const isVideo = category === "video-tools" || title.toLowerCase().includes("video")
  const isAudio = category === "audio-tools" || title.toLowerCase().includes("audio")
  const isImage = category === "image-tools" || title.toLowerCase().includes("image")

  const displayHeadline = isPdf
    ? `${title} Files Online Instantly`
    : `${title} Online Free`

  const displaySubtitle = description || (
    isPdf 
      ? `Extract pages, convert formats, or separate your PDF with high precision. 100% free, private in your browser with zero data retention.`
      : `Fast, secure, and private browser-based tool. 100% free with zero watermarks or data retention.`
  )

  const previewTiles = isPdf
    ? ["Pages 1–2", "Pages 3–4", "Pages 5–6", "Pages 7–8", "Pages 9–10", "Pages 11–12"]
    : isVideo
    ? ["0:00", "0:15", "0:30", "0:45", "1:00", "1:15"]
    : isAudio
    ? ["Track 1", "320kbps", "Hi-Fi", "Stereo", "Lossless", "Master"]
    : isImage
    ? ["PNG", "JPG", "WEBP", "SVG", "AVIF", "PDF"]
    : ["Verified", "Private", "Fast", "Lossless", "100% Free", "Secure"]

  const fileAcceptType = isPdf 
    ? ".pdf,application/pdf" 
    : isVideo 
    ? "video/*" 
    : isAudio 
    ? "audio/*" 
    : isImage 
    ? "image/*" 
    : "*"

  const formatBadgeText = isPdf 
    ? ".PDF files up to 100MB" 
    : isVideo 
    ? ".MP4, .MOV, .MKV up to 500MB" 
    : isAudio 
    ? ".MP3, .WAV, .M4A lossless" 
    : "All standard file formats"

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Sona-Style Hero Section with Full Drag-and-Drop Dropzone */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div 
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-[2.5rem] bg-[#FAFAFA] dark:bg-slate-900/60 border transition-all p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs ${
              isDragging 
                ? "border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20" 
                : "border-slate-200/90 dark:border-slate-800"
            }`}
          >
            {/* Full-Card Drag & Drop Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-[#D7FB8E]/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center border-4 border-dashed border-emerald-600 dark:border-emerald-400 rounded-[2.5rem] p-8 text-center animate-in fade-in-50 duration-150 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 animate-bounce shadow-xl">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mb-2 tracking-tight">
                  Drop your {title} files right here!
                </h3>
                <p className="text-slate-800 dark:text-slate-300 font-semibold text-base sm:text-lg">
                  Release anywhere in this card to begin processing immediately in your browser
                </p>
              </div>
            )}
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#D7FB8E]/15 dark:bg-[#D7FB8E]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
              
              {/* Left Column: Tool Specific Headline, Description & Primary Action Button */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black tracking-wider uppercase mb-6 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ◆ 100% Free &amp; Private Tools
                </div>

                {/* Giant Tool Headline (Tailored to PDF / Current Tool) */}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
                  {displayHeadline}
                </h1>

                {/* Subheadline (Tailored to PDF / Current Tool) */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
                  {displaySubtitle}
                </p>

                {/* Single Sona.ai Primary Action Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto mb-4">
                  <button
                    onClick={handleChooseFilesClick}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-base tracking-tight transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border border-black/10 cursor-pointer text-center"
                  >
                    <span>Choose {title} Files</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>

              </div>

              {/* Right Column: Sona.ai Overlapping Interactive Cards (Tailored to Current Tool) */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] w-full py-6">
                
                {/* 1. Sona.ai Back Lime Card (Dynamic per Category) */}
                <div className="w-[270px] sm:w-[310px] rounded-3xl bg-[#D7FB8E] p-6 text-slate-950 shadow-md border border-black/5 flex flex-col justify-between absolute right-0 sm:right-4 top-0 transform translate-x-1 sm:translate-x-0">
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700 mb-1.5">
                      {categoryLabel}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> INSTANT ENGINE
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                      {title} Auto-Processed
                    </h4>

                    {/* 6 Feature / Part Preview Tiles */}
                    <div className="grid grid-cols-3 gap-2 my-3.5">
                      {previewTiles.map((tile, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-[#cbf777] border border-black/5 flex flex-col items-center justify-center text-slate-950 shadow-2xs p-1">
                          <span className="text-[9px] font-mono font-bold text-slate-700 truncate max-w-full">{tile}</span>
                          <span className="text-xs font-black">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between pt-1">
                    <span>100% Quality Preserved</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Sona.ai Front Sky Blue Card (Active Dropzone) */}
                <div
                  onClick={handleChooseFilesClick}
                  className="w-[270px] sm:w-[310px] rounded-3xl bg-[#BAE6FD] dark:bg-sky-950 p-6 shadow-2xl border border-sky-300 dark:border-sky-800 hover:scale-[1.02] transition-all cursor-pointer relative z-20 transform -translate-x-6 sm:-translate-x-12 translate-y-16 sm:translate-y-20"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-sky-900 dark:text-sky-300 mb-1.5">
                      CLIENT SANDBOX
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200/80 dark:bg-sky-900/80 text-sky-950 dark:text-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> ZERO DATA RETENTION
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      Drop {title} files here
                    </h4>

                    {/* Modern Drag and Drop Graphic */}
                    <div className="my-3.5 p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-sky-200/80 dark:border-sky-800 flex flex-col items-center justify-center text-center shadow-2xs">
                      <UploadCloud className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-1 animate-pulse" />
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Drag &amp; drop files here
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {formatBadgeText}
                      </p>
                    </div>
                  </div>

                  {/* Sona.ai Cyan Action Button */}
                  <button
                    type="button"
                    onClick={handleChooseFilesClick}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Select {title} Files</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Interactive In-Page Tool Canvas (rendered for tools with interactive editors like Plagiarism Checker, AI Detector, Word Counter) */}
          {toolComponent && (
            <div className="mt-10 max-w-5xl mx-auto w-full">
              {toolComponent}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            accept={fileAcceptType}
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(Array.from(e.target.files))
              }
            }}
          />

          {/* Checkmarks under tool */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {topCheckmarks.map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {text}
              </div>
            ))}
          </div>

          {/* AdSense In-Content Placement */}
          <div className="mt-10 max-w-4xl mx-auto">
            <AdSlot slotId="tool-inline-banner" className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800" />
          </div>
        </div>
      </section>

      {/* 2. Sona-Style Zig-Zag Content Features (Clean Product Mockups replacing broken CSS art) */}
      {zigZagFeatures.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950 overflow-hidden font-sans border-t border-slate-100 dark:border-slate-800/80">
          <div className="container mx-auto max-w-6xl space-y-24">
            {zigZagFeatures.map((feature, idx) => (
              <div key={idx} className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Text Column */}
                <div className={`md:col-span-6 ${idx % 2 === 1 ? 'md:order-2 md:pl-4' : 'md:pr-4'}`}>
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7FB8E]"></span>
                    {idx === 0 ? "◆ High-Speed Engine" : idx === 1 ? "◆ Enterprise Security" : "◆ Multi-Platform"}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-snug">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                    {feature.description}
                  </p>

                  <div className="space-y-2.5 pt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#D7FB8E] text-slate-950 flex items-center justify-center text-xs font-black shadow-2xs">✓</div>
                      <span>{idx === 0 ? "Lossless quality retention with zero compression artifacts" : idx === 1 ? "Zero cloud retention: files auto-purged from server memory" : "Works on Chrome, Safari, Edge, Firefox, iOS & Android"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#D7FB8E] text-slate-950 flex items-center justify-center text-xs font-black shadow-2xs">✓</div>
                      <span>{idx === 0 ? "Unlimited daily tasks with zero watermarks or registration" : idx === 1 ? "Bank-grade 256-bit TLS client-side encryption standard" : "No desktop software or browser extension installation needed"}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Product Mockup Card (Sona.ai Clean Widget Design) */}
                <div className={`md:col-span-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="rounded-[2rem] bg-[#FAFAFA] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    
                    {/* Background Soft Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D7FB8E]/15 rounded-full blur-3xl pointer-events-none" />
                    
                    {idx === 0 ? (
                      /* Visual 1: Document Splitting / Processing Widget */
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            <span>📄</span>
                            <span>Source: Annual_Financial_Report.pdf</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7FB8E] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            12 Pages • 4.8 MB
                          </span>
                        </div>

                        {/* Splitting Branches */}
                        <div className="grid grid-cols-3 gap-2.5 pt-2">
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-2xs space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Part 1</div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">Pages 1–4</div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span>✓</span> 1.2 MB
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-2xs space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Part 2</div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">Pages 5–8</div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span>✓</span> 1.4 MB
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-2xs space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Part 3</div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">Pages 9–12</div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span>✓</span> 1.6 MB
                            </div>
                          </div>
                        </div>

                        {/* Status bar */}
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Separation complete
                          </span>
                          <span className="font-mono font-bold text-[11px]">Execution: 0.38s</span>
                        </div>
                      </div>
                    ) : idx === 1 ? (
                      /* Visual 2: Security & Privacy Status Widget */
                      <div className="space-y-3.5 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            <span>🔒</span>
                            <span>Sandbox Security Protocol</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                            ACTIVE
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">In-Transit Encryption</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">TLS 1.3 / AES-256</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Permanent Disk Storage</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0 MB (In-RAM Only)</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Automatic Purge Timer</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">2h 00m Auto-Delete</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          🛡️ Verified GDPR &amp; ISO 27001 Data Confidentiality
                        </div>
                      </div>
                    ) : (
                      /* Visual 3: Universal Browser & Device Compatibility */
                      <div className="space-y-3.5 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            <span>💻</span>
                            <span>Universal Compatibility</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7FB8E] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            WEBASSEMBLY
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="text-emerald-500 font-bold">✓</span> macOS Safari &amp; Chrome
                          </div>
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="text-emerald-500 font-bold">✓</span> Windows 11 &amp; Edge
                          </div>
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="text-emerald-500 font-bold">✓</span> iOS &amp; iPadOS Safari
                          </div>
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="text-emerald-500 font-bold">✓</span> Android Mobile Chrome
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                          Zero RAM hogging • No installer • High-efficiency client execution
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. How-To Block (Sona-Harmonized Step Timeline) */}
      {howToSteps.length > 0 && (
        <section className="py-20 px-4 font-sans bg-slate-50/60 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/80" id="how-to-steps">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-[2.5rem] p-8 md:p-14 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-12">
              
              {/* Left Timeline Card */}
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-[#FAFAFA] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Workflow Steps</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free</span>
                  </div>

                  {howToSteps.map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                      <div className="w-7 h-7 rounded-xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center font-black text-xs border border-black/10">
                        {idx + 1}
                      </div>
                      <span className="truncate">Step {idx + 1}: {idx === 0 ? "Select & upload files" : idx === 1 ? "Configure preferences" : "Download output"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Steps Text */}
              <div className="w-full md:w-3/5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>◆ Step-by-Step Guide</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                  {howToTitle}
                </h2>
                <ol className="space-y-4">
                  {howToSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-8 h-8 rounded-xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center font-black text-sm shrink-0 border border-black/10 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. Grid Features */}
      {gridFeatures.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white text-center mb-16 tracking-tight">{gridTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {gridFeatures.map((feat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#FAFAFA] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-[#D7FB8E]/30 dark:bg-[#D7FB8E]/20 text-slate-950 dark:text-[#D7FB8E] rounded-2xl shadow-2xs border border-black/5 dark:border-white/5">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQs */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">{faqTitle}</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none"
                  >
                    {faq.question}
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t dark:border-slate-800 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Tutorials */}
      {tutorials.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">{tutorialsTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tutorials.map((tut, i) => (
                <Link key={i} href={tut.link} className="group block">
                  <div className={`h-40 rounded-t-xl ${tut.color} dark:opacity-80 flex items-center justify-center p-6 transition-transform group-hover:scale-[1.02]`}>
                     {/* Placeholder icon/graphic for tutorial */}
                     <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-8 h-8 bg-white rounded-sm shadow-sm transform rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                     </div>
                  </div>
                  <div className="border dark:border-slate-800 border-t-0 rounded-b-xl p-6 bg-white dark:bg-slate-900 group-hover:shadow-lg dark:group-hover:shadow-slate-800/50 transition-all h-full">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{tut.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{tut.description}</p>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mt-4 inline-block">Read article →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/blog">
                <Button variant="outline" className="px-8 rounded-full font-semibold dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">View All Articles</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Bottom Sections */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
         <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-8">
               <span>Rate this tool</span>
               <div className="flex text-yellow-400 gap-1 text-lg">
                  ★★★★★
               </div>
               <span className="text-slate-500 ml-2">4.8 / 5</span>
            </div>
         </div>
         <SupportDonationCTA />
      </section>
    </div>
  )
}
