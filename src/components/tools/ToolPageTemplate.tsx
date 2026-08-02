"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { SupportDonationCTA } from "./SupportDonationCTA"

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

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* 1. Header & Interactive Tool Area */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
            {title}
          </h1>
          
          {/* Tool Box Container */}
          <div className="rounded-2xl p-2 md:p-6 shadow-sm border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20 mx-auto max-w-7xl min-h-[300px] flex items-center justify-center relative overflow-hidden">
            <div className="w-full">
              {toolComponent}
            </div>
          </div>

          {/* Checkmarks under tool */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {topCheckmarks.map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {text}
              </div>
            ))}
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
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-transparent dark:border-blue-900/30">
              <div className="w-full md:w-1/3 flex justify-center">
                 {/* Decorative CSS Art replacing broken images */}
                 <div className="relative rounded-2xl shadow-lg aspect-square w-full max-w-sm overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10 w-full h-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col items-center justify-center p-6 space-y-6 shadow-2xl">
                       <div className="flex gap-3">
                         <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-blue-600 font-black text-xl">1</div>
                         <div className="w-12 h-12 rounded-xl bg-white/60 shadow flex items-center justify-center text-blue-900 font-black text-xl">2</div>
                         <div className="w-12 h-12 rounded-xl bg-white/30 shadow flex items-center justify-center text-blue-100 font-black text-xl">3</div>
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
