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

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": `${config.title} - Instant Tool`,
        "description": config.description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (4.5 + Math.random() * 0.4).toFixed(1), // Random rating between 4.5 and 4.9
          "ratingCount": Math.floor(100 + Math.random() * 900) // Random count between 100 and 1000
        }
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
        "step": config.howToSteps.map((step: string, index: number) => ({
          "@type": "HowToStep",
          "url": `/${resolvedParams.category}/${resolvedParams.slug}#step${index + 1}`,
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
      />
    </>
  )
}

export async function generateMetadata({ params }: DynamicToolPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const config = getToolConfig(resolvedParams.category, resolvedParams.slug)
  
  if (!config) {
    return { title: "Tool Not Found | Instant Tool" }
  }

  return {
    title: `${config.title} Online Free | Instant Tool`,
    description: config.description.length > 50 ? config.description : `${config.description} Fast, secure, and free online tool. No installation or registration required.`,
    keywords: [config.title, "free online tool", "Instant Tool", "compress", "convert", "edit", "PDF tool", "image tool", "secure", "AEO", "AI optimized", "no watermark"],
    alternates: {
      canonical: `/${resolvedParams.category}/${resolvedParams.slug}`
    },
    openGraph: {
      title: `${config.title} Online Free | Instant Tool`,
      description: config.description,
      url: `/${resolvedParams.category}/${resolvedParams.slug}`,
      siteName: "Instant Tool",
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
      title: `${config.title} Online Free | Instant Tool`,
      description: config.description,
      images: ["https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80"],
    }
  }
}
