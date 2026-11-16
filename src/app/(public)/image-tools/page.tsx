import Link from "next/link"
import { Image as ImageIcon, Crop, RotateCw, Maximize, Eraser, Sliders, ArrowRightLeft, Layers, Sparkles, Palette, FileText } from "lucide-react"

export const metadata = {
  title: "Free Online Image Tools - Bulk Compress, HEIC & AI Tools | InstantTool",
  description: "Powerful online image editing tools. Bulk compress images, convert HEIC to JPG, remove backgrounds with AI, and enhance photos instantly.",
  alternates: {
    canonical: "https://devigo.cloud/image-tools"
  }
};

const imageTools = [
  { href: "/image-tools/bulk-compressor",       title: "Bulk Image Compressor",  icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,          description: "Compress multiple JPG, PNG, and WebP images at once with zero quality loss." },
  { href: "/image-tools/heic-to-jpg",           title: "HEIC to JPG Converter",  icon: <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6" />,  description: "Convert Apple iPhone HEIC/HEIF photos to standard JPG format client-side." },
  { href: "/converters/image",                 title: "Universal Image Converter", icon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,     description: "Convert images between JPG, PNG, WebP, SVG, AVIF, and GIF." },
  { href: "/ai-tools/remove-background",        title: "AI Background Remover",  icon: <Eraser className="w-5 h-5 sm:w-6 sm:h-6" />,          description: "Automatically remove backgrounds from portraits, products, and graphics." },
  { href: "/ai-tools/ai-image-upscaler",        title: "AI Image Upscaler (4K)", icon: <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />,        description: "Enlarge and enhance low-resolution images up to 4x with neural networks." },
  { href: "/ai-tools/ai-image-editor",          title: "AI Photo Editor",        icon: <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />,         description: "Enhance contrast, lighting, and balance in your photos online." },
  { href: "/ai-tools/ai-face-blur",             title: "Face Blur & Anonymizer", icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,        description: "Detect and blur human faces automatically for privacy and GDPR compliance." },
  { href: "/color-tools/color-palette",         title: "Color Palette & Picker", icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,         description: "Extract color palettes from images or pick precise hex & RGB color codes." },
  { href: "/text-tools/text-extractor",         title: "Image Text Extractor (OCR)", icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,    description: "Extract editable text from screenshots, scanned documents, and photos." },
]

export default function ImageToolsCategoryPage() {
  return (
    <div className="py-10 sm:py-20 px-2.5 sm:px-4 bg-white dark:bg-slate-950 min-h-screen font-sans">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 dark:bg-pink-900/40 rounded-2xl mb-4 sm:mb-6">
            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Image Tools &amp; Converters
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Powerful free online image tools — bulk compress, convert HEIC, upscale with AI, and extract text instantly in your browser.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {imageTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3.5 sm:gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate">
                  {tool.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Block */}
        <div className="mt-12 sm:mt-20 max-w-3xl mx-auto prose prose-slate dark:prose-invert text-xs sm:text-sm leading-relaxed">
          <h2 className="text-lg sm:text-2xl font-bold">Everything You Need for Image Editing</h2>
          <p>
            Our free online image tools let you edit, optimize, and convert images without installing any software.
            Whether you need to compress a photo for a website, remove a background, or convert formats — we have you covered.
          </p>
          <h3 className="text-base sm:text-xl font-bold">How It Works</h3>
          <p>
            Select the tool you need, upload your image, adjust your settings, and download the result.
            Most tools process images directly in your browser for maximum speed and privacy.
          </p>
          <h3 className="text-base sm:text-xl font-bold">Why Use InstantTool?</h3>
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
