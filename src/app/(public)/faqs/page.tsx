import Link from "next/link"
import { HelpCircle } from "lucide-react"
import prisma from "@/lib/prisma/client"

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | InstantTool",
  description: "Got questions? Find answers about InstantTool's features, pricing, security, and how to use our suite of file tools.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/faqs"
  }
};

export default async function FaqsPage() {
  // Fetch active FAQs from the database, ordered by their 'order' field
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  // Group by category if needed, but for now we'll just show them in order 
  // as the previous static page did.

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Find answers to common questions about our platform and tools.
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400">No FAQs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{faq.question}</h3>
                <div 
                  className="text-slate-600 dark:text-slate-400 leading-relaxed prose prose-slate dark:prose-invert max-w-none prose-p:my-1" 
                  dangerouslySetInnerHTML={{ __html: faq.answer }} 
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Our support team is always here to help.</p>
          <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
