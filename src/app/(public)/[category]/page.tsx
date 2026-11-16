import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"
import { DEFAULT_LEGAL_PAGES, LEGAL_ALIASES } from "@/lib/legal-pages-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams.category
  const canonicalSlug = LEGAL_ALIASES[rawSlug] || rawSlug

  // 1. Check DB first
  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({
      where: { slug: canonicalSlug },
    }),
    null
  )

  const fallback = DEFAULT_LEGAL_PAGES[canonicalSlug]
  const title = dbPage?.title || fallback?.title

  if (!title) {
    return { title: "InstantTool - Free Web Tools" }
  }

  const canonicalUrl = `https://devigo.cloud/legal/${canonicalSlug}`

  return {
    title: `${title} | InstantTool Legal & Compliance`,
    description: `Read the official ${title} for InstantTool. Learn about our data protection standards, client-side zero file retention, and AdSense compliance.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function LegalOrCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.category
  const canonicalSlug = LEGAL_ALIASES[rawSlug] || rawSlug

  // 1. Query DB
  const dbPage = await safeDbQuery(
    () => prisma.legalPage.findUnique({
      where: { slug: canonicalSlug },
    }),
    null
  )

  // 2. Fallback to rich builtin legal document
  const fallback = DEFAULT_LEGAL_PAGES[canonicalSlug]

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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans text-slate-900 dark:text-slate-100">
      <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
        
        <Link href="/">
          <Button variant="ghost" className="mb-8 -ml-3 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-slate-200/90 dark:border-slate-800">
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Legal &amp; Compliance</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Updated: {pageUpdatedAt}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
            {pageTitle}
          </h1>

          <div 
            className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-bold hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>InstantTool • devigo.cloud</span>
            <div className="flex items-center gap-4">
              <Link href="/legal/privacy-policy" className="hover:text-emerald-500 underline">Privacy Policy</Link>
              <Link href="/legal/terms-of-service" className="hover:text-emerald-500 underline">Terms of Service</Link>
              <Link href="/contact" className="hover:text-emerald-500 underline">Contact Support</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
