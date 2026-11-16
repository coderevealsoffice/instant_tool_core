import Link from "next/link"
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  Users, 
  CheckCircle2, 
  Lock, 
  FileCheck, 
  FileSpreadsheet, 
  Briefcase 
} from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"

export const metadata = {
  title: "InstantTool for Business - Corporate File & Media Suite",
  description: "Enterprise digital utilities for corporate workflows: sign PDF contracts, compress financial records, and convert media client-side with zero data retention.",
  alternates: {
    canonical: "https://devigo.cloud/business"
  },
  keywords: [
    "business pdf tools", "enterprise document security", "sign pdf contracts",
    "private corporate converters", "client side media tools", "InstantTool business"
  ],
  openGraph: {
    title: "InstantTool for Business - Corporate File & Media Suite",
    description: "Enterprise digital utilities for corporate workflows: sign PDF contracts, compress financial records, and convert media client-side with zero data retention.",
    url: "https://devigo.cloud/business",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool for Business - Corporate File & Media Suite",
    description: "Enterprise digital utilities for corporate workflows: sign PDF contracts, compress financial records, and convert media client-side with zero data retention.",
  }
};

export default function BusinessPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "InstantTool for Business",
    "url": "https://devigo.cloud/business",
    "description": "Secure in-browser document processing and multimedia utilities for business teams and operations.",
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-20 md:py-28 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider mb-6 border border-slate-700 shadow-2xs">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Security &amp; Workflow Optimization</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Streamline Document &amp; Media Tasks <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Without Compromising Data Security
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Empower your team with client-side document encryption, PDF contract signing, batch media conversion, and presentation optimization. Zero software installations, zero IT friction, and guaranteed zero third-party file storage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero File Upload Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>256-Bit AES Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No IT Software Approvals Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security Architecture */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Why Corporate Teams Choose Client-Side Processing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
              Traditional cloud converter portals create severe cybersecurity liabilities by caching confidential contracts, pitch decks, and employee PII on foreign servers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confidentiality Guarantee</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Vendor NDAs, M&amp;A term sheets, and internal financial models never leave your computer's local memory. Computations run locally via WebAssembly with zero network data egress.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Browser Deployment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No corporate laptop administration privileges required. Employees can immediately split PDF legal binders, compress pitch decks, or transcode MP4 clips right in their standard browser.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">100% Watermark-Free</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Exported proposals, client reports, and brand graphics are completely clean of logos or third-party advertising watermarks, ready for board presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 my-8">
        <AdSlot slotId="business-page-banner" />
      </div>

      {/* Recommended Business Utilities */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              Popular Business Productivity Utilities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Save hours across administrative, marketing, legal, and operational workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Sign PDF Contracts", desc: "Add valid digital signatures to vendor agreements without printing.", href: "/pdf-tools/sign-pdf" },
              { title: "Compress Pitch Decks", desc: "Shrink heavy PDF presentations to attach smoothly via corporate email.", href: "/pdf-tools/compress-pdf" },
              { title: "Protect Confidential PDFs", desc: "Apply 256-bit AES passwords to payroll and financial spreadsheets.", href: "/pdf-tools/protect-pdf" },
              { title: "Bulk Image Compressor", desc: "Optimize hundreds of marketing and e-commerce product photos.", href: "/image-tools/bulk-compressor" },
            ].map((tool, i) => (
              <Link 
                key={i} 
                href={tool.href}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">{tool.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{tool.desc}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Launch Tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Business FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 tracking-tight">
            Frequently Asked Questions by Corporate Teams
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Can our company process GDPR or CCPA sensitive documents here?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. Because our client-side WebAssembly architecture executes algorithms directly in your browser memory without transmitting file contents to our server disks, your documents never cross internet boundaries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Are there subscription seats or team fees?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. All core file manipulation tools on InstantTool are free to use across your entire organization without seat limits or recurring per-user licensing fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Do we need to install any Chrome extensions or software?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero installations. Everything works out-of-the-box in Google Chrome, Microsoft Edge, Safari, and Firefox on Windows and macOS.
              </p>
            </div>
          </div>

          <div className="pt-12 text-center">
            <Link 
              href="/tools" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-sm border border-black/10"
            >
              <span>Explore All Enterprise Tools</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
