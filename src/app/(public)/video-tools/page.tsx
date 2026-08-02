import Link from "next/link"
import {
  Video, Scissors, MonitorPlay, MessageSquare, PlusSquare, Image as ImageIcon,
  Type, Eraser, Crop, RotateCw, FlipHorizontal, Maximize, Repeat,
  Volume2, FastForward, Activity, Mic, Music
} from "lucide-react"

export const metadata = {
  title: "Free Online Video Editor & Tools - Trim, Compress, Convert | InstantTool",
  description: "Professional video editing tools in your browser. Trim, crop, compress, and convert videos easily without watermarks.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/video-tools"
  }
};

const videoTools = [
  { slug: "editor",        title: "Video Editor",             icon: <MonitorPlay className="w-6 h-6" />,    description: "Edit your videos online quickly and easily." },
  { slug: "screen-recorder", title: "Screen Recorder",        icon: <Activity className="w-6 h-6" />,       description: "Record your screen directly in the browser." },
  { slug: "text-to-speech", title: "Text to Speech",          icon: <MessageSquare className="w-6 h-6" />,  description: "Convert text to realistic speech online." },
  { slug: "merge",          title: "Merge Videos",            icon: <PlusSquare className="w-6 h-6" />,     description: "Combine multiple video files into one." },
  { slug: "trim",           title: "Trim Video",              icon: <Scissors className="w-6 h-6" />,       description: "Cut and trim your video files online." },
  { slug: "add-audio",      title: "Add Audio to Video",      icon: <Music className="w-6 h-6" />,          description: "Overlay or replace the audio track of your video." },
  { slug: "add-image",      title: "Add Image to Video",      icon: <ImageIcon className="w-6 h-6" />,      description: "Overlay an image on top of your video." },
  { slug: "add-text",       title: "Add Text to Video",       icon: <Type className="w-6 h-6" />,           description: "Add subtitles or text overlays to your video." },
  { slug: "remove-logo",    title: "Remove Logo from Video",  icon: <Eraser className="w-6 h-6" />,         description: "Remove watermarks and logos from video files." },
  { slug: "crop",           title: "Crop Video",              icon: <Crop className="w-6 h-6" />,           description: "Crop your videos to different aspect ratios." },
  { slug: "rotate",         title: "Rotate Video",            icon: <RotateCw className="w-6 h-6" />,       description: "Rotate your videos online." },
  { slug: "flip",           title: "Flip Video",              icon: <FlipHorizontal className="w-6 h-6" />, description: "Flip your videos horizontally or vertically." },
  { slug: "resize",         title: "Resize Video",            icon: <Maximize className="w-6 h-6" />,       description: "Change the resolution or aspect ratio of your video." },
  { slug: "loop",           title: "Loop Video",              icon: <Repeat className="w-6 h-6" />,         description: "Create a seamlessly looping version of your video." },
  { slug: "volume",         title: "Change Video Volume",     icon: <Volume2 className="w-6 h-6" />,        description: "Increase or decrease the volume of your video file." },
  { slug: "speed",          title: "Change Video Speed",      icon: <FastForward className="w-6 h-6" />,    description: "Speed up or slow down your video file." },
  { slug: "stabilize",      title: "Stabilize Video",         icon: <Activity className="w-6 h-6" />,       description: "Remove shakiness and stabilize your video footage." },
  { slug: "recorder",       title: "Video Recorder",          icon: <Video className="w-6 h-6" />,          description: "Record video directly from your webcam." },
]

export default function VideoToolsCategoryPage() {
  return (
    <div className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-6">
            <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Video Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful, free online video tools — trim, crop, merge, rotate, and more. No software install needed.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/video-tools/${tool.slug}`}
              className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
          <h2>Everything You Need for Video Editing</h2>
          <p>
            Our free online video tools let you edit, convert, and enhance your videos without installing any software.
            Whether you need to trim a clip, add music, rotate a recording, or change the speed — we have you covered.
          </p>
          <h3>How It Works</h3>
          <p>
            Select the tool you need, upload your video file, adjust your settings, and download the result. Most tools
            process your file directly in your browser using WebAssembly for maximum speed and privacy.
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
