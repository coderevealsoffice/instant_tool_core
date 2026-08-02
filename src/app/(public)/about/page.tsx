import { Users, Target, Rocket, Heart, Shield, Zap, Globe, Award } from "lucide-react"

export const metadata = {
  title: "About InstantTool - Our Mission for Free Powerful File Tools",
  description: "Learn about InstantTool's mission to provide fast, secure, and intuitive file and AI tools for everyone directly in the browser.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/about"
  }
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About InstantTool",
    "description": "Learn about InstantTool's mission to provide fast, secure, and intuitive file and AI tools for everyone directly in the browser.",
    "publisher": {
      "@type": "Organization",
      "name": "InstantTool"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">About InstantTool</h1>
        <p className="text-xl text-green-100 max-w-2xl mx-auto">
          We believe powerful file and AI tools should be fast, intuitive, and accessible to everyone — directly in your browser.
        </p>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                InstantTool was born out of frustration with clunky, expensive desktop software and overly complex AI wrappers. We set out to build
                a platform where anyone — students, professionals, and creators — can work with PDFs, videos, audio, images, and AI directly in their browser.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our tools are designed to be fast, secure, and intuitive. By leveraging cutting-edge browser technologies
                like WebAssembly and robust cloud processing, we ensure your files are handled securely and processed lightning fast.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Target className="w-7 h-7" />, title: "Goal-Oriented", desc: "Every tool is built to solve a real problem efficiently.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
                { icon: <Rocket className="w-7 h-7" />, title: "Lightning Fast", desc: "Optimized processing right in your browser.", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" },
                { icon: <Heart className="w-7 h-7" />, title: "User First", desc: "Designed with simplicity and user experience in mind.", color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" },
                { icon: <Users className="w-7 h-7" />, title: "Community Driven", desc: "Built for creators, students, and professionals worldwide.", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              These are the principles that guide every feature we build and every decision we make.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy & Security</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your data is yours. We employ robust encryption and automatic file deletion policies to ensure your sensitive documents never fall into the wrong hands.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Simplicity</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Powerful tools shouldn't require a manual. We obsess over intuitive interfaces so you can get your work done with zero friction.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Accessibility</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Whether you're on a high-end Mac or a low-end Chromebook, our cloud and WebAssembly architecture ensures InstantTool works perfectly for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Origin */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Award className="w-4 h-4" /> The Origin Story
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Built in India, for the World</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            InstantTool is proudly built by the team at <strong>CodeReveals</strong>, based in Noida, India. 
            We started this journey when we realized how much time our own team was wasting switching between different 
            apps for PDF editing, image conversions, and AI text generation. 
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            What started as an internal toolset quickly grew into a comprehensive platform. Today, we are a passionate team 
            of developers, designers, and problem solvers dedicated to making the web a more productive place for everyone.
          </p>
        </div>
      </section>
    </div>
  )
}
