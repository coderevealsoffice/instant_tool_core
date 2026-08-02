import Link from "next/link"
import { GraduationCap, BookOpen, Users, Percent } from "lucide-react"

export const metadata = {
  title: "InstantTool for Education - Tools for Students & Teachers",
  description: "Free tools to help students and educators manage PDFs, create presentations, and enhance learning materials.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/education"
  }
};

export default function EducationPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">InstantTool for Education</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-10">
            We support learning. Get special discounts for students, educators, and academic institutions.
          </p>
          <Link href="/contact" className="bg-white text-emerald-800 font-bold py-4 px-8 rounded-full hover:bg-emerald-50 transition-colors">
            Apply for Education Discount
          </Link>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Percent className="w-8 h-8" />, title: "50% Off Pro Plans", desc: "Students and teachers get our Pro features at half the price." },
              { icon: <BookOpen className="w-8 h-8" />, title: "Perfect for Assignments", desc: "Merge research papers, compress lecture videos, and convert formats easily." },
              { icon: <Users className="w-8 h-8" />, title: "Campus-wide Licensing", desc: "Provide InstantTool access to your entire university or school district." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-emerald-600 dark:text-emerald-400 mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
