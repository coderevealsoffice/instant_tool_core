import Link from "next/link"
import { LifeBuoy, FileText, MessageSquare, BookOpen } from "lucide-react"

export const metadata = {
  title: "Help Center & Support | InstantTool",
  description: "Need help? Browse our help center for guides, troubleshooting, and support to get the most out of InstantTool.",
  alternates: {
    canonical: "https://devigo.cloud/help"
  }
};

export default function HelpCenterPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-6">
            <LifeBuoy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Help Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            How can we help you today?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/faqs" className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group text-center">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">FAQs</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Quick answers to common questions about our platform.</p>
          </Link>
          <Link href="/tutorials" className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group text-center">
            <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tutorials</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Step-by-step guides on how to use our tools.</p>
          </Link>
          <Link href="/contact" className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group text-center">
            <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Contact Support</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Get in touch with our team for personalized help.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
