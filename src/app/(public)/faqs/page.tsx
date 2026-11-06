import Link from "next/link"
import { HelpCircle } from "lucide-react"
import prisma from "@/lib/prisma/client"

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | InstantTool",
  description: "Got questions? Find answers about InstantTool's features, pricing, security, and how to use our suite of file tools.",
  alternates: {
    canonical: "https://devigo.cloud/faqs"
  }
};

const FALLBACK_FAQS = [
  {
    id: "faq-1",
    question: "What is InstantTool and how does it work?",
    answer: "InstantTool is a high-speed, browser-first productivity suite. We provide over 100+ free utilities for PDF editing, video trimming, audio transcoding, image compression, developer formatting, and AI-powered content analysis. Most tools execute locally on your machine via WebAssembly for maximum speed and data privacy."
  },
  {
    id: "faq-2",
    question: "Are my uploaded files safe and confidential?",
    answer: "Yes, 100%. We follow a strict zero-retention data policy. Client-side tools (like our image converters, PDF editors, and video trimmers) process everything directly inside your browser cache without sending your files to any external server. For cloud-assisted AI tools, your input is encrypted with TLS 1.3 in transit and instantly purged from memory once processing is complete."
  },
  {
    id: "faq-3",
    question: "Do I need to install any software or create an account?",
    answer: "No. All core features on InstantTool are completely free and require zero registration, email signup, or software installation. You can simply open any tool in your browser and get your work done immediately."
  },
  {
    id: "faq-4",
    question: "How does the Copyleaks-grade AI Content Detector work?",
    answer: "Our AI Content Detector evaluates text using statistical perplexity (word choice unpredictability) and burstiness (sentence length variation). It cross-analyzes linguistic token probabilities against major LLMs including ChatGPT (GPT-4o), Claude 3.5 Sonnet, Google Gemini, and DeepSeek to highlight AI-generated versus human-written sentences."
  },
  {
    id: "faq-5",
    question: "How does the Plagiarism Checker ensure originality?",
    answer: "The Plagiarism Checker segments your text into n-grams and crawls vast indexes of published web pages, scholarly papers, and open repositories. It calculates real-time uniqueness percentages, identifies matched sources, and provides 1-click rephrasing suggestions to guarantee unique content."
  },
  {
    id: "faq-6",
    question: "Can I use InstantTool on mobile devices (iOS / Android)?",
    answer: "Yes! InstantTool is fully responsive and optimized for modern mobile browsers including Safari on iOS and Chrome on Android. You can compress photos, sign documents, and convert audio directly on your phone or tablet without needing heavy apps."
  },
  {
    id: "faq-7",
    question: "How does InstantTool sustain itself if the tools are free?",
    answer: "InstantTool is supported through non-intrusive Google AdSense advertising and voluntary community contributions via our 'Buy Us a Coffee' support widget. This allows us to pay for high-bandwidth cloud infrastructure while keeping the platform accessible to everyone without paywalls."
  },
  {
    id: "faq-8",
    question: "Is there a file size limit for free users?",
    answer: "Free users can process files up to standard limits (up to 50MB–100MB depending on the tool), which covers 99% of daily document and media tasks. For high-volume power users, photographers, or studios needing gigabyte-scale batch processing, our Pro plan unlocks extended limits and priority queueing."
  }
];

export default async function FaqsPage() {
  let faqs = FALLBACK_FAQS;

  try {
    const dbFaqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (dbFaqs && dbFaqs.length > 0) {
      faqs = dbFaqs;
    }
  } catch (err) {
    console.warn("Using fallback FAQs due to DB connection:", err);
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>?/gm, ""), // Strip HTML tags for clean schema text
      },
    })),
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Find answers to common questions about our platform and tools.
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400">No FAQs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{faq.question}</h3>
                <div 
                  className="text-slate-600 dark:text-slate-400 leading-relaxed prose prose-slate dark:prose-invert max-w-none prose-p:my-1" 
                  dangerouslySetInnerHTML={{ __html: faq.answer }} 
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Our support team is always here to help.</p>
          <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
