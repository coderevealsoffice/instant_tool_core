import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"
import { DEFAULT_LEGAL_PAGES, LEGAL_ALIASES } from "@/lib/legal-pages-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FileText, ChevronRight, Clock, ShieldCheck, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const LEGAL_SLUGS = ["privacy-policy", "terms-of-service", "refund-policy", "cookie-policy", "disclaimer"]

export async function generateStaticParams() {
  return LEGAL_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = LEGAL_ALIASES[slug] || slug

  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({ where: { slug: canonicalSlug } }),
    null
  )

  const fallback = DEFAULT_LEGAL_PAGES[canonicalSlug]
  const title = dbPage?.title || fallback?.title || "Legal Document"

  return {
    title: `${title} | InstantTool Legal & Compliance`,
    description: `Read our ${title} - InstantTool's commitment to your privacy, security, transparency, and data protection.`,
    alternates: { canonical: `https://devigo.cloud/legal/${canonicalSlug}` },
  }
}

const LEGAL_NAV = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
  { slug: "refund-policy", label: "Refund Policy" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "disclaimer", label: "Disclaimer" },
]

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const canonicalSlug = LEGAL_ALIASES[slug] || slug
  const fallback = DEFAULT_LEGAL_PAGES[canonicalSlug]

  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({ where: { slug: canonicalSlug } }),
    null
  )

  const pageTitle = dbPage?.title || fallback?.title
  const pageContent = dbPage?.content || fallback?.content
  const rawUpdatedAt = dbPage?.updatedAt || fallback?.updatedAt || "2026-11-15"
  const pageUpdatedAt = rawUpdatedAt instanceof Date
    ? rawUpdatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : String(rawUpdatedAt)

  if (!pageTitle || !pageContent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="container mx-auto max-w-5xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white font-medium">{pageTitle}</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 sticky top-24 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">
                Legal &amp; Policies
              </h2>
              <nav className="space-y-1">
                {LEGAL_NAV.map((item) => {
                  const isActive = item.slug === canonicalSlug
                  return (
                    <Link
                      key={item.slug}
                      href={`/legal/${item.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 px-3">
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Have compliance or GDPR inquiries?
                </p>
                <a
                  href="mailto:info.techyfe@gmail.com"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  info.techyfe@gmail.com →
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Compliance Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last revised: {pageUpdatedAt}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
                {pageTitle}
              </h1>

              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-bold hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />

              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>InstantTool • Official Legal Registry</span>
                <Link href="/contact" className="hover:text-emerald-500 font-bold underline">
                  Contact Legal Support
                </Link>
              </div>
            </div>
          </main>
        </div>

      </div>
    </div>
  )
}
