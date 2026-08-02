import prisma from "@/lib/prisma/client"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const page = await prisma.legalPage.findUnique({
    where: { slug: resolvedParams.category },
  })

  if (!page) {
    return { title: "Page Not Found | Instant Tool" }
  }

  return {
    title: `${page.title} | Instant Tool`,
  }
}

export default async function LegalPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const page = await prisma.legalPage.findUnique({
    where: { slug: resolvedParams.category },
  })

  if (!page) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto max-w-4xl py-24 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">
            {page.title}
          </h1>
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  )
}
