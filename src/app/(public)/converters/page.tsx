import Link from "next/link"
import { ArrowRightLeft, Music, FileText, Image as ImageIcon, BookOpen, FileArchive } from "lucide-react"

export const metadata = {
  title: "Free Online File Converters - Document, Image, Media | InstantTool",
  description: "Convert any file format instantly online. Fast, secure, and free converters for PDFs, images, videos, and audio.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/converters"
  }
};

const converterTools = [
  { slug: "audio",    title: "Audio Converter",    icon: <Music className="w-6 h-6" />,           description: "Convert audio files between MP3, WAV, OGG, AAC and more." },
  { slug: "video",    title: "Video Converter",    icon: <ArrowRightLeft className="w-6 h-6" />,  description: "Convert video files between different formats." },
  { slug: "image",    title: "Image Converter",    icon: <ImageIcon className="w-6 h-6" />,       description: "Convert images between JPG, PNG, WebP, GIF and more." },
  { slug: "document", title: "Document Converter", icon: <FileText className="w-6 h-6" />,        description: "Convert between document formats seamlessly." },
  { slug: "font",     title: "Font Converter",     icon: <ArrowRightLeft className="w-6 h-6" />,  description: "Convert font files between TTF, OTF, WOFF and WOFF2." },
  { slug: "archive",  title: "Archive Converter",  icon: <FileArchive className="w-6 h-6" />,     description: "Convert between archive formats like ZIP, RAR, and 7z." },
  { slug: "ebook",    title: "Ebook Converter",    icon: <BookOpen className="w-6 h-6" />,        description: "Convert ebooks between EPUB, MOBI, PDF and more." },
  { slug: "extractor",title: "Archive Extractor",  icon: <FileArchive className="w-6 h-6" />,     description: "Extract files from ZIP, RAR, 7z, and other archives." },
]

export default function ConvertersCategoryPage() {
  return (
    <div className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 dark:bg-violet-900/40 rounded-2xl mb-6">
            <ArrowRightLeft className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            File Converters
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert any file format — audio, video, images, documents, fonts, and more. Free, fast, and secure.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {converterTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/converters/${tool.slug}`}
              className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
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
          <h2>Convert Any File Format Online</h2>
          <p>
            InstantTool offers a comprehensive collection of file converters that work directly in your browser.
            No software installation, no file size limits on client-side tools, and no privacy concerns.
          </p>
          <h3>How It Works</h3>
          <p>
            Select a converter, upload your file, choose the output format, and download the result instantly.
            Audio conversions happen entirely in your browser using WebAssembly for complete privacy.
          </p>
          <h3>Why Use InstantTool Converters?</h3>
          <ul>
            <li><strong>Free to Use:</strong> All converters are free with no sign-up required.</li>
            <li><strong>Privacy First:</strong> Audio and image conversions never leave your browser.</li>
            <li><strong>High Quality:</strong> We maintain maximum quality during every conversion.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
