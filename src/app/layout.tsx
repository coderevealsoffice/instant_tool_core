import type { Metadata } from "next";
import { Inter, Playfair_Display, Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://instant-tool.vercel.app"),
  title: "Instant Tool | Free PDF, Image & QR Code Tools",
  description: "Free online tools to compress, merge, split, and rotate PDFs, compress and convert images, and generate QR codes quickly and securely.",
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
    "PDF tools",
    "compress PDF",
    "merge PDF",
    "split PDF",
    "rotate PDF",
    "image compressor",
    "image converter",
    "QR code generator",
    "free online tools",
    "Instant Tool"
  ],
  openGraph: {
    title: "Instant Tool | Free PDF, Image & QR Code Tools",
    description: "Free online tools to compress, merge, split, and rotate PDFs, compress and convert images, and generate QR codes quickly and securely.",
    url: "/",
    siteName: "Instant Tool",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Instant Tool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instant Tool | Free PDF, Image & QR Code Tools",
    description: "Free online tools to compress, merge, split, and rotate PDFs, compress and convert images, and generate QR codes quickly and securely.",
    images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
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
      className={`${inter.variable} ${playfair.variable} ${urbanist.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Global Organization Schema for AEO/GEO/SEO */}
        <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "InstantTool",
            "url": "https://instant-tool.vercel.app",
            "logo": "https://instant-tool.vercel.app/logo.png",
            "description": "Your all-in-one platform for powerful, fast, and free online tools.",
            "sameAs": [
              "https://twitter.com/instanttool",
              "https://www.linkedin.com/company/instanttool"
            ]
          })
        }} />

        {/* Google AdSense Global Script */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000" 
          crossOrigin="anonymous" 
          strategy="lazyOnload" 
        />

        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
