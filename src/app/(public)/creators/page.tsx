import Link from "next/link"
import { Video, Sparkles, UploadCloud, MonitorPlay } from "lucide-react"

export const metadata = {
  title: "InstantTool for Creators - Streamline Your Media Workflow",
  description: "Tools built for content creators. Edit videos, compress images, and generate assets quickly for your next big project.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/creators"
  }
};

export default function CreatorsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">InstantTool for Creators</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto mb-10">
            Edit videos, clean up audio, and convert formats without slowing down your computer. 
            Built for YouTubers, podcasters, and social media managers.
          </p>
          <Link href="/pricing" className="bg-white text-pink-700 font-bold py-4 px-8 rounded-full hover:bg-pink-50 transition-colors">
            View Creator Plans
          </Link>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { icon: <Sparkles className="w-6 h-6" />, title: "Audio Enhancer", desc: "Remove background noise from your vlogs or podcasts with one click." },
                { icon: <MonitorPlay className="w-6 h-6" />, title: "Screen Recorder", desc: "Record tutorials and presentations directly in your browser." },
                { icon: <Video className="w-6 h-6" />, title: "Social Media Cropper", desc: "Quickly resize your videos for TikTok, Instagram Reels, or YouTube Shorts." },
                { icon: <UploadCloud className="w-6 h-6" />, title: "Cloud Processing", desc: "Keep your laptop running fast while our servers do the heavy rendering." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
              <blockquote className="text-lg italic text-slate-700 dark:text-slate-300 mb-6">
                "InstantTool saves me hours every week. I used to open heavy desktop software just to trim a video or boost audio. Now I do it all in my browser."
              </blockquote>
              <div className="font-bold text-slate-900 dark:text-white">— Sarah J., Tech YouTuber</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
