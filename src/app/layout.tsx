import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://devigo.cloud"),
  title: "InstantTool - Free Online Tools (PDF Alternative, Compress PDF, Video & AI Tools)",
  description: "Free online tools to compress PDF, merge & split documents, convert video to audio, and download YouTube media. 100% private in-browser WebAssembly.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "pdf converter",
    "pdf compressor",
    "pdf to word",
    "jpg to pdf",
    "word to pdf",
    "compress pdf",
    "merge pdf",
    "split pdf",
    "pdf to excel",
    "pdf editor online",
    "caption generator free",
    "youtube downloader",
    "color picker online",
    "video to audio converter online free",
    "image compressor",
    "audio joiner",
    "joiner",
    "ai content detector",
    "free online tools",
    "no watermark pdf tools",
    "InstantTool"
  ],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "InstantTool - Free Online Tools (PDF, Video & AI)",
    description: "Free online tools to compress PDF, merge & split documents, convert video to audio, and download YouTube media. 100% private in-browser WebAssembly.",
    url: "/",
    siteName: "InstantTool",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "InstantTool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool - Free Online Tools (PDF, Video & AI)",
    description: "Free online tools to compress PDF, merge & split documents, convert video to audio, and download YouTube media. 100% private in-browser WebAssembly.",
    images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
  },
  verification: {
    google: "google15fe68b4ac2831d1",
  },
  alternates: {
    canonical: "https://devigo.cloud",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        {/* Resource Hints for Optimal LCP & FCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Agentic Resource Discovery (ARD) Specification for AI Agents */}
        <link rel="ard" type="application/json" href="/.well-known/ard.json" />

        {/* Google AdSense Primary Script Tag - Static in <head> for AdSense Crawler Verification */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1199452179361457"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>

        {/* Global Organization Schema for AEO/GEO/SEO */}
        <script
          id="organization-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "InstantTool",
              "url": "https://devigo.cloud",
              "logo": "https://devigo.cloud/favicon.png",
              "description": "Your all-in-one platform for powerful, fast, and free online PDF, image, video, audio, and AI tools.",
              "sameAs": [
                "https://twitter.com/instanttool",
                "https://www.linkedin.com/company/instanttool"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info.techyfe@gmail.com",
                "contactType": "customer support"
              }
            }).replace(/</g, '\\u003c')
          }}
        />

        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
