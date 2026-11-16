import { Users, Target, Rocket, Heart, Shield, Zap, Globe, Award, CheckCircle2, Lock, FileCheck, Mail } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About InstantTool - Our Mission, Editorial Standards & Security Architecture",
  description: "Learn about InstantTool's mission to provide fast, secure, and client-side WebAssembly file and AI tools for everyone with zero server data retention.",
  alternates: {
    canonical: "https://devigo.cloud/about"
  }
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About InstantTool",
    "description": "Learn about InstantTool's mission to provide fast, secure, and intuitive file and AI tools for everyone directly in the browser.",
    "publisher": {
      "@type": "Organization",
      "name": "InstantTool",
      "url": "https://devigo.cloud",
      "logo": "https://devigo.cloud/favicon.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@codereveals.com",
        "contactType": "customer service"
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-20 md:py-28 px-4 text-center border-b border-slate-100 dark:border-slate-800/60">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200 dark:border-emerald-800">
            <span>◆ About Us &amp; Transparency</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            Empowering Millions with Free, Private Browser Tools
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We believe powerful multimedia, PDF, and AI utilities should be fast, private, and accessible to everyone worldwide — without software downloads or paywalls.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
                <span>Our Core Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Eliminating Bloat &amp; Respecting User Privacy
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-base">
                InstantTool was built to solve a pervasive problem on the modern web: intrusive file converters filled with misleading download buttons, mandatory email registrations, and servers that covertly store your confidential files.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                By leveraging cutting-edge <strong>client-side WebAssembly</strong> and browser memory streams, we process files directly on your own device. When you compress a PDF or convert an image, your sensitive data never leaves your computer.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, title: "Zero Data Retention", desc: "Files process in local RAM and are purged immediately." },
                { icon: <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />, title: "High-Speed Execution", desc: "No queue delays or slow cloud upload bottlenecks." },
                { icon: <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />, title: "100% Free Access", desc: "Core utilities remain freely available without paywalls." },
                { icon: <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Universal Compatibility", desc: "Runs on Mac, Windows, Chromebooks, iOS & Android." },
              ].map((item, i) => (
                <div key={i} className="bg-[#FAFAFA] dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Fact-Checking */}
      <section className="py-20 px-4 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Editorial Guidelines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Our Commitment to Editorial Integrity &amp; Accuracy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Every guide, tutorial, and technical article published on the InstantTool Knowledge Base adheres to rigorous editorial review standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D7FB8E] text-slate-950 font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hands-On Verification</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We test every software workflow, compression ratio, and codec benchmark internally before publishing tutorials to ensure advice is accurate and actionable.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D7FB8E] text-slate-950 font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Continuous Updates</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                As browser specifications (like WebAssembly, WebCodecs, and HTML5 Canvas) evolve, our engineering team regularly revises guides to reflect current industry standards.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D7FB8E] text-slate-950 font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Independence &amp; Objectivity</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our educational content is authored to solve user problems. We do not accept sponsored placements that compromise reader trust or privacy ethics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team, Headquarters & Transparency */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4 text-emerald-600" /> Engineering &amp; Ownership
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Built by CodeReveals for Users Worldwide
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            InstantTool is engineered and operated by <strong>CodeReveals</strong>, headquartered in Noida, India, under the leadership of <strong>Pradeep Yadav</strong> (Product Engineering @ Techyfe &amp; CodeReveals).
          </p>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
            We are passionate about open web standards and empowering creators, students, and businesses with lightweight, privacy-respecting browser utilities. Have questions or want to partner? Email our engineering desk directly at <a href="mailto:info@codereveals.com" className="font-bold text-emerald-600 dark:text-emerald-400 underline">info@codereveals.com</a>.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D7FB8E] hover:bg-[#cbf576] text-slate-950 font-black text-sm tracking-tight transition-all shadow-sm border border-black/10"
            >
              <span>Explore All 100+ Free Tools →</span>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm tracking-tight transition-all shadow-2xs"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
