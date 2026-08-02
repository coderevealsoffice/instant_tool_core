import Link from "next/link"
import { Image as ImageIcon, Crop, RotateCw, Maximize, Eraser, Sliders, ArrowRightLeft, Layers } from "lucide-react"

export const metadata = {
  title: "Free Online Image Tools - Resize, Compress & Convert | InstantTool",
  description: "Powerful online image editing tools. Resize, compress, convert formats, and apply effects to your photos instantly.",
  alternates: {
    canonical: "https://devigo.cloud/image-tools"
  }
};

const imageTools = [
  { slug: "crop",       title: "Crop Image",        icon: <Crop className="w-6 h-6" />,            description: "Crop your images to the perfect size online." },
  { slug: "resize",     title: "Resize Image",       icon: <Maximize className="w-6 h-6" />,        description: "Resize your images to any resolution or aspect ratio." },
  { slug: "rotate",     title: "Rotate Image",       icon: <RotateCw className="w-6 h-6" />,        description: "Rotate your images 90, 180, or 270 degrees." },
  { slug: "compress",   title: "Compress Image",     icon: <Layers className="w-6 h-6" />,          description: "Reduce image file size without losing quality." },
  { slug: "remove-bg",  title: "Remove Background", icon: <Eraser className="w-6 h-6" />,          description: "Automatically remove the background from your images." },
  { slug: "convert",    title: "Image Converter",    icon: <ArrowRightLeft className="w-6 h-6" />,  description: "Convert images between JPG, PNG, WebP, GIF and more." },
  { slug: "enhance",    title: "Enhance Image",      icon: <Sliders className="w-6 h-6" />,         description: "Improve brightness, contrast, and sharpness online." },
  { slug: "watermark",  title: "Add Watermark",      icon: <ImageIcon className="w-6 h-6" />,       description: "Add a text or image watermark to your photos." },
]

export default function ImageToolsCategoryPage() {
  return (
    <div className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/40 rounded-2xl mb-6">
            <ImageIcon className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Image Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful free online image tools — crop, resize, rotate, compress, and convert your images instantly.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/image-tools/${tool.slug}`}
              className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
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
          <h2>Everything You Need for Image Editing</h2>
          <p>
            Our free online image tools let you edit, optimize, and convert images without installing any software.
            Whether you need to compress a photo for a website, remove a background, or convert formats — we have you covered.
          </p>
          <h3>How It Works</h3>
          <p>
            Select the tool you need, upload your image, adjust your settings, and download the result.
            Most tools process images directly in your browser for maximum speed and privacy.
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
