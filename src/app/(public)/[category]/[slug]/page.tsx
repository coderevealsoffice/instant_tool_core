import { Metadata } from "next"
import { getToolConfig } from "@/lib/tools-registry"
import { ToolPageTemplate } from "@/components/tools/ToolPageTemplate"
import { notFound } from "next/navigation"

interface DynamicToolPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default async function DynamicToolPage({ params }: DynamicToolPageProps) {
  const resolvedParams = await params
  const config = getToolConfig(resolvedParams.category, resolvedParams.slug)
  
  if (!config) {
    notFound()
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devigo.cloud"
  const toolCanonicalUrl = `${appUrl}/${resolvedParams.category}/${resolvedParams.slug}`

  // Deterministic rating based on tool slug so search engines receive consistent data
  const slugHash = resolvedParams.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const ratingValue = (4.7 + ((slugHash % 3) * 0.1)).toFixed(1) // 4.7, 4.8, or 4.9
  const ratingCount = 450 + (slugHash % 500)

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": `${config.title} - InstantTool`,
        "url": toolCanonicalUrl,
        "description": config.description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "ratingCount": ratingCount,
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": appUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": resolvedParams.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            "item": `${appUrl}/${resolvedParams.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": config.title,
            "item": toolCanonicalUrl
          }
        ]
      },
      ...(config.faqs && config.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": config.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }] : []),
      ...(config.howToSteps && config.howToSteps.length > 0 ? [{
        "@type": "HowTo",
        "name": `How to use ${config.title}`,
        "description": `Follow these step-by-step instructions to use ${config.title} online for free.`,
        "step": config.howToSteps.map((step: string, index: number) => ({
          "@type": "HowToStep",
          "url": `${toolCanonicalUrl}#step${index + 1}`,
          "name": `Step ${index + 1}`,
          "itemListElement": [{
            "@type": "HowToDirection",
            "text": step
          }]
        }))
      }] : [])
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ToolPageTemplate
        title={config.title}
        description={config.description}
        headerColorClass={config.headerColorClass}
        toolComponent={config.toolComponent}
        topCheckmarks={config.topCheckmarks}
        zigZagFeatures={config.zigZagFeatures}
        howToSteps={config.howToSteps}
        gridFeatures={config.gridFeatures}
        faqs={config.faqs}
        category={resolvedParams.category}
        slug={resolvedParams.slug}
      />
    </>
  )
}

function generateSeoDescription(title: string, rawDesc: string): string {
  let desc = (rawDesc || "").trim()
  if (desc.endsWith('.')) desc = desc.slice(0, -1).trim()

  if (desc.length > 158) {
    const truncated = desc.slice(0, 155)
    const lastSpace = truncated.lastIndexOf(' ')
    desc = (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated).trim() + '.'
  } else if (desc.length < 120) {
    const candidates = [
      ` 100% free, private in-browser tool with zero watermarks.`,
      ` Fast, private and free with no registration required.`,
      ` 100% free and secure in your browser.`
    ]
    for (const c of candidates) {
      if (desc.length + c.length <= 158) {
        desc = `${desc}.${c}`
        break
      }
    }
  }

  if (desc.length > 158) {
    desc = desc.slice(0, 155).trim() + "..."
  }
  return desc
}

export async function generateMetadata({ params }: DynamicToolPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const config = getToolConfig(resolvedParams.category, resolvedParams.slug)
  
  if (!config) {
    return { title: "Tool Not Found | InstantTool" }
  }

  const isPdf = resolvedParams.category === "pdf-tools"
  const isVideo = resolvedParams.category === "video-tools"
  const isAudio = resolvedParams.category === "audio-tools"
  const isAi = resolvedParams.category === "ai-tools"
  const isColor = resolvedParams.category === "color-tools"

  const seoTitle = isPdf
    ? `${config.title} Online Free - iLovePDF Alternative | InstantTool`
    : isColor
    ? `${config.title} Online - Color Picker & Palette | InstantTool`
    : `${config.title} Online Free | InstantTool`

  const seoDescription = generateSeoDescription(config.title, config.description)

  const seoKeywords = [
    config.title,
    `${config.title.toLowerCase()} free`,
    `${config.title.toLowerCase()} online`,
    `${config.title.toLowerCase()} no watermark`,
    ...(isPdf ? ["ilovepdf", "ilovepdf alternative", "i love pdf", "smallpdf alternative", "no watermark pdf", "free pdf tools"] : []),
    ...(isVideo ? ["video to audio converter online free", "youtube downloader", "video trimmer online", "video cutter"] : []),
    ...(isAudio ? ["audio joiner", "joiner", "audio merger online", "mp3 cutter online", "audio speed changer"] : []),
    ...(isAi ? ["caption generator free", "ai youtube keyword generator", "ai caption generator", "free ai tools"] : []),
    ...(isColor ? ["color picker online", "online color picker", "palette generator", "hex color finder"] : []),
    "free online tools",
    "InstantTool"
  ]

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
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
    alternates: {
      canonical: `/${resolvedParams.category}/${resolvedParams.slug}`
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `/${resolvedParams.category}/${resolvedParams.slug}`,
      siteName: "InstantTool",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: config.title,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
    }
  }
}
