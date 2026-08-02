import Link from "next/link"
import { Building2, ShieldCheck, Zap, Users } from "lucide-react"

export const metadata = {
  title: "InstantTool for Business - Enterprise File Management",
  description: "Discover how InstantTool can streamline your company's document, media, and AI workflows with secure, fast processing.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/business"
  }
};

export default function BusinessPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">InstantTool for Business</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
            Empower your team with secure, unlimited access to our entire suite of file processing tools.
          </p>
          <Link href="/contact" className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-full hover:bg-indigo-50 transition-colors">
            Contact Sales
          </Link>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Enterprise Security", desc: "Bank-grade encryption and strict data deletion policies." },
              { icon: <Zap className="w-8 h-8" />, title: "Priority Processing", desc: "Skip the queue. Your files process on dedicated high-speed servers." },
              { icon: <Users className="w-8 h-8" />, title: "Team Management", desc: "Manage seats, billing, and usage from a single dashboard." },
              { icon: <Building2 className="w-8 h-8" />, title: "API Access", desc: "Integrate our tools directly into your own applications." }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
