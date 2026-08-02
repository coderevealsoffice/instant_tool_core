import { Briefcase, MapPin, Clock } from "lucide-react"

export const metadata = {
  title: "Careers at InstantTool - Join Our Mission",
  description: "We are hiring! Join the team at InstantTool and help us build the future of web-based productivity tools.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/careers"
  }
};

const openings = [
  { title: "Frontend Developer (React/Next.js)", type: "Full-time", location: "Noida, India / Remote", dept: "Engineering" },
  { title: "UI/UX Designer", type: "Full-time", location: "Remote", dept: "Design" },
  { title: "Backend Developer (Node.js)", type: "Full-time", location: "Noida, India / Remote", dept: "Engineering" },
  { title: "Content Writer (Tech)", type: "Part-time", location: "Remote", dept: "Marketing" },
]

export default function CareersPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Join Our Team</h1>
        <p className="text-xl text-slate-300 max-w-xl mx-auto">
          We're building the future of browser-based file tools. Come work with us.
        </p>
      </section>

      {/* Culture */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Work at InstantTool?</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            We're a small, high-impact team where your work ships to thousands of users every day. 
            We value autonomy, curiosity, and craftsmanship.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Flexible & Remote", desc: "Work from anywhere. We're remote-first and results-oriented.", icon: "🌍" },
              { title: "Impactful Work", desc: "Every line of code and design decision reaches millions of users.", icon: "🚀" },
              { title: "Grow Fast", desc: "Small team means big opportunity. Own entire features end-to-end.", icon: "📈" },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">{job.dept}</p>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  </div>
                </div>
                <a href={`mailto:info.codereveals@gmail.com?subject=Application: ${job.title}`}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Apply Now
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
            Don't see a suitable role? Email us at{" "}
            <a href="mailto:info.codereveals@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              info.codereveals@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
