"use client"

import React, { useState } from "react"
import { Code2, Copy, Check, Plus, Trash2, ExternalLink, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type SchemaType = "faq" | "howto" | "article" | "product" | "webapp"

export function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("faq")
  const [isCopied, setIsCopied] = useState(false)

  // FAQ State
  const [faqs, setFaqs] = useState([
    { question: "Is this tool completely free to use?", answer: "Yes, our online tools are 100% free with generous daily usage limits." },
    { question: "Is my personal data and document secure?", answer: "Yes, files are processed directly in your browser or automatically purged within 2 hours." },
  ])

  // HowTo State
  const [howToTitle, setHowToTitle] = useState("How to Compress a PDF Online")
  const [howToSteps, setHowToSteps] = useState([
    { name: "Upload your document", text: "Select and drag your PDF into the file box." },
    { name: "Choose compression level", text: "Select extreme, recommended, or low compression." },
    { name: "Download compressed PDF", text: "Click download to save your optimized file instantly." },
  ])

  // Article State
  const [article, setArticle] = useState({
    headline: "Complete Guide to Generative Engine Optimization (GEO)",
    author: "InstantTool Research Team",
    publisher: "InstantTool",
    datePublished: "2026-01-15",
    image: "https://devigo.cloud/favicon.png",
    description: "Learn how to optimize your web pages to be cited by Perplexity AI and ChatGPT Search.",
  })

  // Product State
  const [product, setProduct] = useState({
    name: "InstantTool Pro Plan",
    description: "Unlimited document conversions, AI tasks, and priority queue.",
    image: "https://devigo.cloud/favicon.png",
    price: "19",
    currency: "INR",
    brand: "InstantTool",
  })

  // WebApp State
  const [webApp, setWebApp] = useState({
    name: "InstantTool Online Suite",
    description: "Free browser-based multimedia, PDF, and SEO optimization platform.",
    url: "https://devigo.cloud",
    operatingSystem: "All",
    price: "0",
  })

  // Compute JSON-LD
  const generateJsonLd = () => {
    let schemaObj: any = {
      "@context": "https://schema.org",
    }

    if (schemaType === "faq") {
      schemaObj["@type"] = "FAQPage"
      schemaObj["mainEntity"] = faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      }))
    } else if (schemaType === "howto") {
      schemaObj["@type"] = "HowTo"
      schemaObj["name"] = howToTitle
      schemaObj["step"] = howToSteps.map((s, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": s.name,
        "itemListElement": [
          {
            "@type": "HowToDirection",
            "text": s.text,
          },
        ],
      }))
    } else if (schemaType === "article") {
      schemaObj["@type"] = "Article"
      schemaObj["headline"] = article.headline
      schemaObj["description"] = article.description
      schemaObj["image"] = article.image
      schemaObj["datePublished"] = article.datePublished
      schemaObj["author"] = {
        "@type": "Person",
        "name": article.author,
      }
      schemaObj["publisher"] = {
        "@type": "Organization",
        "name": article.publisher,
        "logo": {
          "@type": "ImageObject",
          "url": article.image,
        },
      }
    } else if (schemaType === "product") {
      schemaObj["@type"] = "Product"
      schemaObj["name"] = product.name
      schemaObj["image"] = product.image
      schemaObj["description"] = product.description
      schemaObj["brand"] = {
        "@type": "Brand",
        "name": product.brand,
      }
      schemaObj["offers"] = {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": product.currency,
        "availability": "https://schema.org/InStock",
      }
    } else if (schemaType === "webapp") {
      schemaObj["@type"] = "WebApplication"
      schemaObj["name"] = webApp.name
      schemaObj["url"] = webApp.url
      schemaObj["description"] = webApp.description
      schemaObj["applicationCategory"] = "UtilitiesApplication"
      schemaObj["operatingSystem"] = webApp.operatingSystem
      schemaObj["offers"] = {
        "@type": "Offer",
        "price": webApp.price,
        "priceCurrency": "USD",
      }
    }

    return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`
  }

  const jsonLdString = generateJsonLd()

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonLdString)
    setIsCopied(true)
    toast.success("JSON-LD Schema copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-500" />
            JSON-LD Schema Markup Generator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build structured data for Google Rich Snippets, FAQ dropdowns, and AI Answer Engine citation graphs.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 shadow-md"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? "Copied!" : "Copy JSON-LD"}
          </Button>
        </div>
      </div>

      {/* Schema Type Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "faq", label: "FAQPage Schema" },
          { id: "howto", label: "HowTo Steps Schema" },
          { id: "article", label: "Article / Blog Schema" },
          { id: "product", label: "Product & Offer Schema" },
          { id: "webapp", label: "WebApplication Schema" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSchemaType(item.id as SchemaType)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              schemaType === item.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Input Form */}
        <div className="space-y-4">
          
          {/* FAQ Builder */}
          {schemaType === "faq" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions & Answers</span>
                <button
                  onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Question #{idx + 1}</span>
                    {faqs.length > 1 && (
                      <button
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs]
                      updated[idx].question = e.target.value
                      setFaqs(updated)
                    }}
                    placeholder="e.g., How does this tool work?"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs]
                      updated[idx].answer = e.target.value
                      setFaqs(updated)
                    }}
                    placeholder="e.g., Simply upload your document and our system automatically..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>
              ))}
            </div>
          )}

          {/* HowTo Builder */}
          {schemaType === "howto" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Process Title</label>
                <input
                  type="text"
                  value={howToTitle}
                  onChange={(e) => setHowToTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Step-by-Step Directions</span>
                <button
                  onClick={() => setHowToSteps([...howToSteps, { name: "", text: "" }])}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>

              {howToSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Step {idx + 1}</span>
                    {howToSteps.length > 1 && (
                      <button
                        onClick={() => setHowToSteps(howToSteps.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => {
                      const updated = [...howToSteps]
                      updated[idx].name = e.target.value
                      setHowToSteps(updated)
                    }}
                    placeholder="Step Name (e.g., Upload File)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={(e) => {
                      const updated = [...howToSteps]
                      updated[idx].text = e.target.value
                      setHowToSteps(updated)
                    }}
                    placeholder="Detailed step instruction..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Article Builder */}
          {schemaType === "article" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Article Headline</label>
                <input
                  type="text"
                  value={article.headline}
                  onChange={(e) => setArticle({ ...article, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={(e) => setArticle({ ...article, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={article.publisher}
                    onChange={(e) => setArticle({ ...article, publisher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Article Description</label>
                <textarea
                  rows={2}
                  value={article.description}
                  onChange={(e) => setArticle({ ...article, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs resize-y"
                />
              </div>
            </div>
          )}

          {/* Product Builder */}
          {schemaType === "product" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price</label>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Currency</label>
                  <input
                    type="text"
                    value={product.currency}
                    onChange={(e) => setProduct({ ...product, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WebApp Builder */}
          {schemaType === "webapp" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Application Name</label>
                <input
                  type="text"
                  value={webApp.name}
                  onChange={(e) => setWebApp({ ...webApp, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Application URL</label>
                <input
                  type="url"
                  value={webApp.url}
                  onChange={(e) => setWebApp({ ...webApp, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live JSON-LD Script</span>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Google Rich Results Test <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] border border-slate-800 shadow-inner leading-relaxed">
            <code>{jsonLdString}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

