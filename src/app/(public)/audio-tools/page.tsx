import Link from "next/link"
import {
  Scissors, Volume2, FastForward, AudioLines, Sliders, MoveRight, Mic, Merge, Music
} from "lucide-react"

export const metadata = {
  title: "Free Online Audio Tools - Edit, Trim & Convert MP3s | InstantTool",
  description: "Edit your audio files online for free. Trim MP3s, change volume, convert formats, and more directly in your browser.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/audio-tools"
  }
};

const audioTools = [
  { slug: "trim",           title: "Trim Audio",       icon: <Scissors className="w-6 h-6" />,     description: "Cut your audio files online for free." },
  { slug: "change-volume",  title: "Change Volume",    icon: <Volume2 className="w-6 h-6" />,      description: "Increase or decrease the volume of your audio files." },
  { slug: "change-speed",   title: "Change Speed",     icon: <FastForward className="w-6 h-6" />,  description: "Speed up or slow down an audio file." },
  { slug: "pitch",          title: "Change Pitch",     icon: <AudioLines className="w-6 h-6" />,   description: "Shift the pitch of your audio up or down." },
  { slug: "equalizer",      title: "Equalizer",        icon: <Sliders className="w-6 h-6" />,      description: "Fine-tune the frequency balance of your audio." },
  { slug: "reverse",        title: "Reverse Audio",    icon: <MoveRight className="w-6 h-6" />,    description: "Play your audio file in reverse." },
  { slug: "recorder",       title: "Voice Recorder",   icon: <Mic className="w-6 h-6" />,          description: "Record audio online directly from your microphone." },
  { slug: "joiner",         title: "Audio Joiner",     icon: <Merge className="w-6 h-6" />,        description: "Merge multiple audio tracks into a single file." },
]

export default function AudioToolsCategoryPage() {
  return (
    <div className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl mb-6">
            <Music className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Audio Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful, free online audio tools — trim, mix, convert, and enhance your audio files in seconds.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/audio-tools/${tool.slug}`}
              className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Block */}
        <div className="mt-20 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h2>Everything You Need for Audio Editing</h2>
          <p>
            Our free online audio tools let you edit, enhance, and convert audio without installing any software.
            Whether you need to trim a recording, boost the volume, or reverse a sound effect — we have you covered.
          </p>
          <h3>How It Works</h3>
          <p>
            Select the tool you need, upload your audio file, adjust your settings, and download the result. 
            Most tools process files directly in your browser for maximum speed and privacy.
          </p>
          <h3>Why Use InstantTool?</h3>
          <ul>
            <li><strong>Free to Use:</strong> All tools are free with no sign-up required.</li>
            <li><strong>Privacy First:</strong> Client-side tools never upload your files to the cloud.</li>
            <li><strong>Cross Platform:</strong> Works on Windows, Mac, Linux, iOS, and Android.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
