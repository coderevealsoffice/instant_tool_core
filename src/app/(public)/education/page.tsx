import Link from "next/link"
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  HelpCircle,
  Laptop
} from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"

export const metadata = {
  title: "InstantTool for Education - Free Student & Teacher Tools",
  description: "Free digital utilities for academic productivity: compress research PDFs, merge thesis chapters, extract textbook quotes with OCR, and format presentations.",
  alternates: {
    canonical: "https://devigo.cloud/education"
  },
  keywords: [
    "tools for students", "free academic tools", "thesis pdf merger", "research paper compressor",
    "free ocr for students", "education tools", "InstantTool education"
  ],
  openGraph: {
    title: "InstantTool for Education - Free Student & Teacher Tools",
    description: "Free digital utilities for academic productivity: compress research PDFs, merge thesis chapters, extract textbook quotes with OCR, and format presentations.",
    url: "https://devigo.cloud/education",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool for Education - Free Student & Teacher Tools",
    description: "Free digital utilities for academic productivity: compress research PDFs, merge thesis chapters, extract textbook quotes with OCR, and format presentations.",
  }
};

export default function EducationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "InstantTool for Education",
    "url": "https://devigo.cloud/education",
    "description": "Free online academic productivity tools for students, universities, and educators with strict zero-knowledge document privacy.",
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 py-20 md:py-28 px-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Academic Productivity Hub • 100% Free Forever</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            Digital Tools Built for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Students &amp; Academic Researchers
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Manage research papers, compress term assignments to beat portal upload limits, format citations, and extract lecture notes. Everything executes locally in your browser with zero subscription paywalls and 100% student data privacy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Software Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>FERPA Compliant Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Student Workflows */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Essential Tools for Modern Coursework
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
              Solve the most common assignment roadblocks in seconds with dedicated browser utilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Beat LMS File Limits</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Platforms like Canvas, Blackboard, and Moodle often reject submissions over 10MB or 25MB. Compress multi-page PDFs by up to 85% while keeping diagrams and text razor sharp.
              </p>
              <Link href="/pdf-tools/compress-pdf" className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
                Use PDF Compressor →
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thesis &amp; Report Assembly</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Combine your cover page, literature review, data appendices, and professor feedback sheets into a single, cohesive PDF document with custom page numbers.
              </p>
              <Link href="/pdf-tools/merge-pdf" className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
                Use PDF Merger →
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Textbook OCR &amp; Notes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Take a quick smartphone photo of physical textbook pages or library archives and instantly convert the image into editable text ready to cite in your bibliography.
              </p>
              <Link href="/text-tools/text-extractor" className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
                Extract Text with OCR →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 my-8">
        <AdSlot slotId="education-page-banner" />
      </div>

      {/* FERPA & Academic Data Protection */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Academic Privacy &amp; Ethics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Zero Document Retention for Student Research
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Academic integrity matters. When you process unpublished lab research, peer reviews, or personal essays on InstantTool, your files execute in client-side WebAssembly directly inside your browser. Your documents are never indexed, never fed into public AI training models, and never stored on third-party server disks.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">✓ Safe for Unpublished Research</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pre-patent laboratory results and dissertations stay private on your laptop.</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">✓ No Data Harvesting</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">We do not sell student browsing habits, course materials, or user identities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education FAQs */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 tracking-tight">
            Frequently Asked Questions for Students &amp; Educators
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Are these academic tools really 100% free?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. There is no trial period, no mandatory credit card entry, and no recurring student subscription fee. All core file manipulation tools are free for university students, educators, and researchers worldwide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Can I use InstantTool on school Chromebooks or library computers?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. Because InstantTool runs entirely within the web browser without requiring executable .exe or .dmg installer files, it works on school-administered Chromebooks, campus library PCs, iPads, and MacBooks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                How does compressing a PDF help with Canvas/Blackboard submission?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our PDF Compressor downsamples redundant image streams and strips duplicate font tables, reducing your paper from 30MB down to 3MB–5MB while keeping your equations and charts legible.
              </p>
            </div>
          </div>

          <div className="pt-12 text-center">
            <Link 
              href="/tools" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-sm border border-black/10"
            >
              <span>Explore All Academic Tools</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
