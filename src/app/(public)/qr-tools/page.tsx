import Link from "next/link"
import { QrCode, Link as LinkIcon, Mail, Wifi, Phone, MapPin, Text, CreditCard } from "lucide-react"

export const metadata = {
  title: "Free Custom QR Code Generator - Links, Text & WiFi | InstantTool",
  description: "Create custom QR codes for free. Generate dynamic QR codes for URLs, WiFi, VCards, and more with our easy-to-use tool.",
  alternates: {
    canonical: "https://devigo.cloud/qr-tools"
  }
};

const qrTools = [
  { slug: "url",     title: "URL QR Code",     icon: <LinkIcon className="w-6 h-6" />,    description: "Generate a QR code for any website URL." },
  { slug: "text",    title: "Text QR Code",    icon: <Text className="w-6 h-6" />,        description: "Encode plain text into a scannable QR code." },
  { slug: "email",   title: "Email QR Code",   icon: <Mail className="w-6 h-6" />,        description: "Create a QR code that opens a pre-filled email." },
  { slug: "wifi",    title: "WiFi QR Code",    icon: <Wifi className="w-6 h-6" />,        description: "Share WiFi credentials as a scannable QR code." },
  { slug: "phone",   title: "Phone QR Code",   icon: <Phone className="w-6 h-6" />,       description: "Create a QR code that dials a phone number." },
  { slug: "vcard",   title: "vCard QR Code",   icon: <CreditCard className="w-6 h-6" />,  description: "Share your contact details as a QR code." },
  { slug: "location",title: "Location QR Code",icon: <MapPin className="w-6 h-6" />,      description: "Generate a QR code that opens a map location." },
  { slug: "generator",title: "QR Generator",  icon: <QrCode className="w-6 h-6" />,      description: "Generate custom QR codes with logos and colors." },
]

export default function QrToolsCategoryPage() {
  return (
    <div className="py-20 px-4 bg-white dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl mb-6">
            <QrCode className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            QR Code Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate QR codes instantly for URLs, WiFi, contacts, email, phone numbers, and more — all for free.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/qr-tools/${tool.slug}`}
              className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
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
          <h2>Free Online QR Code Generator</h2>
          <p>
            InstantTool's QR code generator lets you create scannable QR codes for any purpose — completely free 
            and with no sign-up required. Generate, customize, and download your QR codes in seconds.
          </p>
          <h3>How It Works</h3>
          <p>
            Select the type of QR code you need, enter your data, and the QR code is generated instantly in your browser.
            Download it as a PNG image ready to use in print or digital media.
          </p>
          <h3>Why Use InstantTool QR Codes?</h3>
          <ul>
            <li><strong>100% Free:</strong> No subscription or sign-up required.</li>
            <li><strong>Instant Generation:</strong> QR codes are generated instantly in your browser.</li>
            <li><strong>High Resolution:</strong> Download crisp, print-ready PNG files.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
