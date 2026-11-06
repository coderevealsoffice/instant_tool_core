import prisma from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FileText, ChevronRight, Clock } from "lucide-react"
import type { Metadata } from "next"

const LEGAL_SLUGS = ["privacy-policy", "terms-of-service", "refund-policy", "cookie-policy", "disclaimer"]

interface LegalContent {
  title: string
  updatedAt: string
  content: string
}

const DEFAULT_LEGAL_PAGES: Record<string, LegalContent> = {
  "privacy-policy": {
    title: "Privacy Policy",
    updatedAt: "2026-11-06",
    content: `
      <h2>1. Introduction & Overview</h2>
      <p>At <strong>InstantTool</strong> (accessible at <a href="https://devigo.cloud">https://devigo.cloud</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by InstantTool and how we use and protect it.</p>
      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info.codereveals@gmail.com">info.codereveals@gmail.com</a>.</p>

      <h2>2. File Processing & Zero-Storage Guarantee</h2>
      <p>InstantTool provides client-side and secure serverless file processing utilities (including PDF editors, image converters, video compressors, and SEO tools):</p>
      <ul>
        <li><strong>Client-Side Processing:</strong> The vast majority of our tools operate directly within your browser using modern WebAssembly, Canvas, and HTML5 APIs. In these cases, your files never leave your device and are never transmitted to our servers.</li>
        <li><strong>Cloud-Processed Tasks:</strong> For tools requiring server-side assistance, files are transmitted via TLS 1.3 encrypted connections and are processed immediately in transient memory. We do not store, view, or retain your uploaded files or generated results once your session ends. All temporary artifacts are automatically purged.</li>
      </ul>

      <h2>3. Google DoubleClick DART Cookies & Third-Party Advertising</h2>
      <p>Google is one of our third-party vendors on our site. Google uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <a href="https://devigo.cloud">https://devigo.cloud</a> and other sites on the internet.</p>
      <p>Visitors may choose to decline or customize the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a> or through Google's Ad Settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</a>.</p>
      <p>You can also opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>

      <h2>4. Advertising Partners Privacy Policies</h2>
      <p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on InstantTool, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
      <p>Note that InstantTool has no access to or control over these cookies that are used by third-party advertisers.</p>

      <h2>5. Log Files & Analytics</h2>
      <p>InstantTool follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

      <h2>6. GDPR Data Protection Rights (EU Visitors)</h2>
      <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the right to access, rectification, erasure, restrict processing, and data portability.</p>

      <h2>7. Children's Information</h2>
      <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. InstantTool does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>

      <h2>8. Consent & Updates</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms. Any updates to this policy will be posted on this page with a revised timestamp.</p>
    `
  },
  "terms-of-service": {
    title: "Terms of Service",
    updatedAt: "2026-11-06",
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using InstantTool (<a href="https://devigo.cloud">https://devigo.cloud</a>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any of these terms, you are prohibited from using or accessing this site.</p>

      <h2>2. Use License & Free Utilities</h2>
      <p>Permission is granted to freely use InstantTool's online converters, editors, AI utilities, and SEO analyzers for personal, educational, or commercial purposes. You agree not to:</p>
      <ul>
        <li>Attempt to decompile, reverse engineer, or exploit the proprietary source code of the backend services.</li>
        <li>Use automated scripts or scrapers to overload, disrupt, or launch denial of service attacks against our infrastructure.</li>
        <li>Upload malicious payloads, viruses, or unlawful, infringing, or harmful media files.</li>
      </ul>

      <h2>3. Intellectual Property Rights</h2>
      <p>You retain 100% full ownership, rights, and title to all files, images, documents, and texts you upload or process through InstantTool. InstantTool claims no ownership or license over your content.</p>

      <h2>4. Disclaimer of Warranties</h2>
      <p>The materials and utilities on InstantTool are provided on an 'as is' and 'as available' basis. InstantTool makes no warranties, expressed or implied, and hereby disclaims all other warranties including merchantability, fitness for a particular purpose, or non-infringement.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall InstantTool or its creators be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the tools on InstantTool.</p>

      <h2>6. Modifications to Terms</h2>
      <p>InstantTool may revise these Terms of Service for its website at any time without prior notice. By using this website you are agreeing to be bound by the then-current version of these terms.</p>
    `
  },
  "cookie-policy": {
    title: "Cookie Policy",
    updatedAt: "2026-11-06",
    content: `
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work efficiently, remember your preferences, and provide analytical information.</p>

      <h2>2. How InstantTool Uses Cookies</h2>
      <p>We use cookies for several functional and analytical reasons:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required to keep you authenticated, remember dark/light mode preferences, and preserve active workspace settings.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our tools so we can identify bugs and optimize processing speed.</li>
        <li><strong>Advertising Cookies (Google AdSense):</strong> Third-party advertising partners such as Google AdSense place cookies to serve relevant advertisements based on your prior browsing history across the web.</li>
      </ul>

      <h2>3. Managing Your Cookie Preferences</h2>
      <p>You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites. You can also customize your Google ad personalization preferences anytime at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
    `
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    updatedAt: "2026-11-06",
    content: `
      <h2>1. Free & Open-Access Tools</h2>
      <p>All core multimedia, PDF, image, and SEO tools on InstantTool are free to use without requiring a credit card or mandatory subscription.</p>

      <h2>2. Voluntary Support & Donations</h2>
      <p>Contributions made through our "Support / Buy us a coffee" feature via Razorpay are strictly voluntary donations intended to help cover cloud hosting, bandwidth, and ongoing development. Because these are direct voluntary gifts, donations are generally non-refundable once processed.</p>

      <h2>3. Premium Plans & Credit Packs</h2>
      <p>If you purchase a paid subscription or credit pack and encounter a technical failure where credits were deducted without producing the promised output, please email <a href="mailto:info.codereveals@gmail.com">info.codereveals@gmail.com</a> within 7 days with your transaction ID. We will promptly investigate and credit your account or issue a full refund.</p>
    `
  },
  "disclaimer": {
    title: "Disclaimer",
    updatedAt: "2026-11-06",
    content: `
      <h2>1. General Information Only</h2>
      <p>The information and utilities provided by InstantTool (<a href="https://devigo.cloud">https://devigo.cloud</a>) are for general informational, educational, and productivity purposes only.</p>

      <h2>2. SEO & AI Tool Results</h2>
      <p>Our SEO analyzers, AI detectors, and plagiarism checkers use heuristic algorithms, statistical entropy models, and public search engine index simulations. While we strive for industry-grade accuracy, these metrics should be used as guidance rather than definitive proof of copyright infringement or algorithmic authorship.</p>

      <h2>3. External Links Disclaimer</h2>
      <p>InstantTool may contain links to external websites that are not provided or maintained by or in any way affiliated with InstantTool. Please note that InstantTool does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
    `
  }
}

// Generate static slugs for known legal pages
export async function generateStaticParams() {
  return LEGAL_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let title = DEFAULT_LEGAL_PAGES[slug]?.title || "Legal Document"

  try {
    const page = await prisma.legalPage.findUnique({ where: { slug } })
    if (page?.title) {
      title = page.title
    }
  } catch (e) {
    // DB blip fallback
  }

  return {
    title: `${title} | InstantTool`,
    description: `Read our ${title} - InstantTool's commitment to your privacy, security, transparency, and data protection.`,
    alternates: { canonical: `https://devigo.cloud/legal/${slug}` },
  }
}

const LEGAL_NAV = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
  { slug: "refund-policy", label: "Refund Policy" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "disclaimer", label: "Disclaimer" },
]

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fallback = DEFAULT_LEGAL_PAGES[slug]

  let pageTitle = fallback?.title
  let pageContent = fallback?.content
  let pageUpdatedAt = fallback?.updatedAt ? new Date(fallback.updatedAt) : new Date()

  try {
    const dbPage = await prisma.legalPage.findUnique({ where: { slug } })
    if (dbPage) {
      pageTitle = dbPage.title
      pageContent = dbPage.content
      pageUpdatedAt = dbPage.updatedAt
    }
  } catch (err) {
    console.warn(`Using fallback legal content for ${slug}:`, err)
  }

  if (!pageTitle || !pageContent) {
    notFound()
  }

  const formattedDate = pageUpdatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-semibold">{pageTitle}</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{pageTitle}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex gap-10 items-start">

          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Legal Documents</p>
            <nav className="space-y-1">
              {LEGAL_NAV.map(item => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.slug === slug
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Need Help?</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mb-3">If you have questions about our policies, contact us.</p>
              <Link href="/contact" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Contact Us →
              </Link>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 lg:p-12">
              <div
                className="prose prose-slate dark:prose-invert max-w-none
                  prose-h2:text-2xl prose-h2:font-black prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-800 dark:prose-h3:text-slate-200
                  prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                  prose-li:text-slate-600 dark:prose-li:text-slate-400
                  prose-a:text-blue-600 hover:prose-a:text-blue-700
                  prose-strong:text-slate-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Other Legal Documents</p>
              <div className="grid grid-cols-2 gap-3">
                {LEGAL_NAV.filter(n => n.slug !== slug).map(item => (
                  <Link
                    key={item.slug}
                    href={`/legal/${item.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
