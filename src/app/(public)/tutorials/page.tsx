import Link from "next/link"
import { BookOpen, Video, FileText, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Tutorials & Guides - Learn How to Use InstantTool",
  description: "Step-by-step tutorials on how to compress PDFs, edit videos, generate AI content, and master all InstantTool features.",
  alternates: {
    canonical: "https://devigo.cloud/tutorials"
  }
};

const tutorials = [
  { title: "How to compress a PDF without losing quality", category: "PDF Tools", icon: <FileText className="w-5 h-5" />, href: "/blog/how-to-compress-pdf" },
  { title: "Extracting audio from a video file", category: "Video Tools", icon: <Video className="w-5 h-5" />, href: "/blog/extract-audio-from-video" },
  { title: "Converting images to WebP format", category: "Image Tools", icon: <BookOpen className="w-5 h-5" />, href: "/blog/convert-images-webp" },
  { title: "Merging multiple PDFs into one document", category: "PDF Tools", icon: <FileText className="w-5 h-5" />, href: "/blog/merge-multiple-pdfs" },
]

export default function TutorialsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Tutorials</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn how to make the most of our free tools with step-by-step guides.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, i) => (
            <Link key={i} href={tutorial.href} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors group">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                {tutorial.icon}
                {tutorial.category}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tutorial.title}
              </h3>
              <div className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Read guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Can't find what you're looking for?</p>
          <Link href="/help" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            Visit Help Center
          </Link>
        </div>
      </div>
    </div>
  )
}
