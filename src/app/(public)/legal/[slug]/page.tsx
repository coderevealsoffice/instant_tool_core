import prisma from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FileText, ChevronRight, Clock } from "lucide-react"
import type { Metadata } from "next"

const LEGAL_SLUGS = ["privacy-policy", "terms-of-service", "refund-policy", "cookie-policy", "disclaimer"]

// Generate static slugs for known legal pages
export async function generateStaticParams() {
  return LEGAL_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await prisma.legalPage.findUnique({ where: { slug } })
  if (!page) return { title: "Page Not Found" }
  return {
    title: `${page.title} | InstantTool`,
    description: `Read our ${page.title} - InstantTool's commitment to your privacy, security, and rights.`,
    alternates: { canonical: `/legal/${slug}` },
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
  const page = await prisma.legalPage.findUnique({ where: { slug } })

  if (!page) notFound()

  const formattedDate = new Date(page.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-semibold">{page!.title}</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{page!.title}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex gap-10 items-start">

          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Legal Documents</p>
            <nav className="space-y-1">
              {LEGAL_NAV.map(item => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.slug === slug
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Need Help?</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mb-3">If you have questions about our policies, contact us.</p>
              <Link href="/contact" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Contact Us →
              </Link>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 lg:p-12">
              <div
                className="prose prose-slate dark:prose-invert max-w-none
                  prose-h2:text-2xl prose-h2:font-black prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-800 dark:prose-h3:text-slate-200
                  prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                  prose-li:text-slate-600 dark:prose-li:text-slate-400
                  prose-a:text-blue-600 hover:prose-a:text-blue-700
                  prose-strong:text-slate-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: page!.content }}
              />
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Other Legal Documents</p>
              <div className="grid grid-cols-2 gap-3">
                {LEGAL_NAV.filter(n => n.slug !== slug).map(item => (
                  <Link
                    key={item.slug}
                    href={`/legal/${item.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
