"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ArrowUpRight } from "lucide-react"
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

  // Dynamic noun for headline: document / video / audio / search
  const headlineWord = title.toLowerCase().includes("pdf") || title.toLowerCase().includes("document")
    ? "document"
    : title.toLowerCase().includes("video")
    ? "video"
    : title.toLowerCase().includes("audio")
    ? "audio"
    : "workforce"

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Sona.ai Exact Hero Section (Clean rounded card with overlapping floating cards) */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] bg-[#FAFAFA] dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#D7FB8E]/15 dark:bg-[#D7FB8E]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
              
              {/* Left Column: Sona.ai Typography & Dual Action Buttons */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black tracking-wider uppercase mb-6 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ◆ 100% Free &amp; Private Tools
                </div>

                {/* Giant Headline (Sona.ai Exact Style) */}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
                  Start making better {headlineWord} decisions
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
                  {description || `See how InstantTool helps large organisations improve efficiency, protect service quality, and perform better at scale.`}
                </p>

                {/* Dual Sona.ai Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
                  <button
                    onClick={handleChooseFilesClick}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-medium text-[15px] sm:text-base tracking-tight transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border border-black/10 cursor-pointer text-center"
                  >
                    <span>Choose {title} Files</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <a
                    href="#how-to-steps"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-900 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-medium text-[15px] sm:text-base tracking-tight transition-all shadow-2xs hover:border-black dark:hover:border-white text-center cursor-pointer"
                  >
                    <span>Take a tour</span>
                    <ArrowRight className="w-4 h-4 text-slate-900 dark:text-white" />
                  </a>
                </div>

                {/* Trust Marks */}
                <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span>4.9 / 5 rating from 40,000+ creators</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Zero file retention</span>
                </div>

              </div>

              {/* Right Column: Sona.ai Overlapping Interactive Cards */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] w-full py-6">
                
                {/* 1. Sona.ai Back Lime Card (HR / AI WORKFLOW) */}
                <div className="w-[270px] sm:w-[310px] rounded-3xl bg-[#D7FB8E] p-6 text-slate-950 shadow-md border border-black/5 flex flex-col justify-between absolute right-0 sm:right-4 top-0 transform translate-x-1 sm:translate-x-0">
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700 mb-1.5">
                      HR
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> AI WORKFLOW
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                      Onboarding auto-completed
                    </h4>

                    {/* 6 Checkmark boxes in 3x2 grid (Exact match to Sona.ai screenshot 2) */}
                    <div className="grid grid-cols-3 gap-2 my-3.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-[#cbf777] border border-black/5 flex items-center justify-center text-slate-950 font-black text-sm shadow-2xs">
                          ✓
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between pt-1">
                    <span>Review onboarding steps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Sona.ai Front Sky Blue Card (SCHEDULING / AI SHIFT ALERT) */}
                <div
                  onClick={handleChooseFilesClick}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFiles(Array.from(e.dataTransfer.files));
                    }
                  }}
                  className={`w-[270px] sm:w-[310px] rounded-3xl bg-[#BAE6FD] dark:bg-sky-950 p-6 shadow-2xl border transition-all cursor-pointer relative z-20 ${
                    isDragging 
                      ? "border-emerald-500 scale-105 ring-4 ring-emerald-500/20" 
                      : "border-sky-300 dark:border-sky-800 hover:scale-[1.02]"
                  } transform -translate-x-6 sm:-translate-x-12 translate-y-16 sm:translate-y-20`}
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-sky-900 dark:text-sky-300 mb-1.5">
                      SCHEDULING
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200/80 dark:bg-sky-900/80 text-sky-950 dark:text-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> AI SHIFT ALERT
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {isDragging ? "Drop your files here!" : "Coverage gap detected"}
                    </h4>

                    {/* Sona.ai Mountain Area Chart Wave Visual */}
                    <div className="my-3.5 p-2 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-sky-200/80 dark:border-sky-800 flex items-center justify-center h-20 sm:h-24 overflow-hidden relative shadow-2xs">
                      <svg className="w-full h-full text-teal-600 dark:text-teal-400" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0,35 Q20,10 40,25 T80,15 T100,28 L100,40 L0,40 Z" fill="currentColor" opacity="0.75" />
                        <path d="M40,25 Q60,5 80,15" stroke="currentColor" strokeWidth="2" strokeDasharray="2,2" fill="none" />
                      </svg>
                    </div>
                  </div>

                  {/* Sona.ai Cyan Action Button */}
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Auto-fill shift gaps</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Enterprise Trust Logos matching Sona.ai */}
            <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                <span>HAWKSMOOR</span>
                <span>kisimul</span>
                <span>THE BEAUMONT</span>
                <span>Achieve</span>
                <span>LOUNGERS</span>
                <span>Community</span>
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

      {/* 2. Zig-Zag Content Features */}
      {zigZagFeatures.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="container mx-auto max-w-5xl space-y-24">
            {zigZagFeatures.map((feature, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-16 items-center">
                <div className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{feature.description}</p>
                </div>
                <div className={`relative ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className={`absolute inset-0 ${feature.color} dark:opacity-80 rounded-3xl transform ${idx % 2 === 0 ? '-rotate-3' : 'rotate-3'} scale-105`}></div>
                  {/* Decorative CSS Art replacing broken images */}
                  <div className="relative rounded-2xl shadow-xl w-full border dark:border-slate-800 aspect-video overflow-hidden bg-slate-900 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    <div className={`absolute inset-0 ${feature.color} opacity-40 mix-blend-overlay`}></div>
                    <div className="relative z-10 w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                       <div className="w-32 h-32 rounded-full border-4 border-white/20 border-dashed flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
                          <div className={`w-16 h-16 rounded-xl ${feature.color} shadow-2xl rotate-12`}></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. How-To Block */}
      {howToSteps.length > 0 && (
        <section className="py-16 px-4" id="how-to-steps">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-emerald-100 dark:border-emerald-900/30">
              <div className="w-full md:w-1/3 flex justify-center">
                 {/* Decorative CSS Art replacing broken images */}
                 <div className="relative rounded-2xl shadow-lg aspect-square w-full max-w-sm overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10 w-full h-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col items-center justify-center p-6 space-y-6 shadow-2xl">
                       <div className="flex gap-3">
                         <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-emerald-600 font-black text-xl">1</div>
                         <div className="w-12 h-12 rounded-xl bg-white/70 shadow flex items-center justify-center text-emerald-900 font-black text-xl">2</div>
                         <div className="w-12 h-12 rounded-xl bg-white/40 shadow flex items-center justify-center text-emerald-100 font-black text-xl">3</div>
                       </div>
                       <div className="w-full space-y-3">
                         <div className="w-3/4 h-3 bg-white/40 rounded-full mx-auto"></div>
                         <div className="w-1/2 h-3 bg-white/20 rounded-full mx-auto"></div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{howToTitle}</h2>
                <ol className="space-y-4">
                  {howToSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-lg">{step}</p>
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
        <section className="py-20 px-4 bg-white dark:bg-slate-950">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">{gridTitle}</h2>
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
              {gridFeatures.map((feat, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm text-blue-600 border border-slate-100 dark:border-slate-800">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feat.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
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
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{tut.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{tut.description}</p>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-4 inline-block">Read article →</span>
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
