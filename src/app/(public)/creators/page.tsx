import Link from "next/link"
import { 
  Video, 
  Sparkles, 
  Scissors, 
  Mic, 
  CheckCircle2, 
  ImageIcon, 
  Smartphone, 
  Film, 
  ArrowRight 
} from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"

export const metadata = {
  title: "InstantTool for Creators - Free Video & Audio Suite",
  description: "Free browser tools for creators: trim 4K footage without re-encoding, crop 9:16 vertical shorts, create thumbnails, and master audio with zero watermarks.",
  alternates: {
    canonical: "https://devigo.cloud/creators"
  },
  keywords: [
    "tools for creators", "youtube shorts cropper", "trim 4k video online", "audio mastering free",
    "thumbnail generator free", "video tools for youtubers", "InstantTool creators"
  ],
  openGraph: {
    title: "InstantTool for Creators - Free Video & Audio Suite",
    description: "Free browser tools for creators: trim 4K footage without re-encoding, crop 9:16 vertical shorts, create thumbnails, and master audio with zero watermarks.",
    url: "https://devigo.cloud/creators",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool for Creators - Free Video & Audio Suite",
    description: "Free browser tools for creators: trim 4K footage without re-encoding, crop 9:16 vertical shorts, create thumbnails, and master audio with zero watermarks.",
  }
};

export default function CreatorsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "InstantTool for Creators",
    "url": "https://devigo.cloud/creators",
    "description": "High-speed browser video, audio, and graphic editing utilities tailored for digital creators and social channels.",
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-rose-50/60 via-white to-white dark:from-rose-950/20 dark:via-slate-950 dark:to-slate-950 py-20 md:py-28 px-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-200 dark:border-rose-800 shadow-2xs">
            <Film className="w-4 h-4 text-rose-600" />
            <span>Built for YouTubers, Podcasters &amp; Social Creators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
            Fast, Free Multimedia Tools <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">
              With 100% Zero Export Watermarks
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Produce scroll-stopping social content without opening heavy desktop editing suites. Trim 4K B-roll, convert video to crystal-clear 320kbps MP3s, remove photo backgrounds for CTR-boosting thumbnails, and splice audio reels in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-500" />
              <span>Full 4K Video Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-500" />
              <span>Zero Logos or Branding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-500" />
              <span>Instant Local Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Workflows */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Built for Every Stage of Your Production
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
              Everything you need to turn raw media clips into published content.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-rose-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lossless 4K Video Trimming</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cut out dead air and mistakes with millisecond accuracy. Stream copy mode extracts your clips instantly without re-compressing or degrading your original camera bitrate.
              </p>
              <Link href="/video-tools/trim" className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline pt-2">
                Trim Video Now →
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-rose-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thumbnail Background Remover</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Isolate yourself or product subjects in one click with AI edge detection. Export transparent PNGs ready to drop into Photoshop, Canva, or Figma for high-CTR thumbnails.
              </p>
              <Link href="/ai-tools/remove-background" className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline pt-2">
                Remove Background →
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-rose-400 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Podcast Audio Master &amp; Joiner</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extract clean voice tracks from video interviews, normalize volume levels, and merge intros, sponsorships, and guest interviews into a seamless master track.
              </p>
              <Link href="/audio-tools/joiner" className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline pt-2">
                Join Audio Tracks →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Slot */}
      <div className="max-w-4xl mx-auto px-4 my-8">
        <AdSlot slotId="creators-page-banner" />
      </div>

      {/* Watermark-Free Commitment */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-800">
            <span>Our Creator Pledge</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Content Stays Yours. Forever.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We know how frustrating it is to spend hours editing a video only to be held hostage by a giant watermark demanding a $20/month subscription. InstantTool will never place watermarks on your files.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/video-tools" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-sm border border-black/10"
            >
              <span>Explore All Video Tools</span>
              <span>→</span>
            </Link>
            <Link 
              href="/audio-tools" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm tracking-tight transition-all shadow-2xs"
            >
              <span>Explore Audio Tools</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Creator FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10 tracking-tight">
            Frequently Asked Questions for Creators
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Can I monetize videos edited with InstantTool on YouTube?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes, absolutely. You retain 100% intellectual property ownership of all output files. There are no restrictions on commercialization, brand sponsorships, or YouTube AdSense monetization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Does trimming videos reduce the visual quality or frame rate?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. Our WebAssembly engine operates with stream-level copy mode whenever possible, preserving the exact bitrates, color profiles, and 60fps smoothness of your original footage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Is there a limit on how many videos I can download per day?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No daily caps. You can edit, trim, and transcode as many video and audio clips as your workflow requires.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
