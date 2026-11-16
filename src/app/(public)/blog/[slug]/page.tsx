import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"
import { getBuiltinBlog, BUILTIN_BLOG_POSTS } from "@/lib/blogs-data"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, User, Calendar, Tag, Clock, Share2, Sparkles, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdSlot } from "@/components/common/AdSlot"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  // 1. Check DB first
  const dbPost = await safeDbQuery(
    () => prisma.blogPost.findUnique({ where: { slug } }),
    null
  )

  // 2. Check Builtin
  const builtinPost = getBuiltinBlog(slug)
  const post = dbPost || builtinPost

  if (!post) {
    return { title: "Blog Post | InstantTool" }
  }

  const title = post.metaTitle || `${post.title} | InstantTool`
  let rawDesc = (post.metaDesc || post.excerpt || `Read the complete guide to ${post.title} on InstantTool.`).trim()
  if (rawDesc.length > 158) {
    const cut = rawDesc.slice(0, 155)
    const sp = cut.lastIndexOf(' ')
    rawDesc = (sp > 100 ? cut.slice(0, sp) : cut).trim() + '...'
  } else if (rawDesc.length < 120) {
    rawDesc = `${rawDesc} Read step-by-step instructions and best practices on InstantTool.`
    if (rawDesc.length > 158) rawDesc = rawDesc.slice(0, 155).trim() + '.'
  }
  const description = rawDesc
  const canonicalUrl = `https://devigo.cloud/blog/${slug}`

  return {
    title,
    description,
    keywords: [
      post.title,
      `${post.title.toLowerCase()} guide`,
      "tutorial",
      "free online tools",
      "InstantTool"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: post.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"],
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // 1. Fetch from DB
  const dbPost = await safeDbQuery(
    () => prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true }
    }),
    null
  )

  // 2. Fallback to builtin blog corpus
  const builtin = getBuiltinBlog(slug)

  let post: any = null
  if (dbPost && dbPost.isPublished) {
    post = dbPost
  } else if (builtin) {
    post = {
      id: builtin.id,
      slug: builtin.slug,
      title: builtin.title,
      excerpt: builtin.excerpt,
      content: builtin.content,
      author: builtin.author,
      image: builtin.image,
      createdAt: new Date(builtin.createdAt),
      updatedAt: new Date(builtin.updatedAt),
      category: { name: builtin.categoryName },
      readTime: builtin.readTime,
    }
  }

  if (!post) {
    notFound()
  }

  const categoryName = post.category?.name || "Productivity"
  const publishedDate = post.createdAt ? new Date(post.createdAt) : new Date()
  const formattedDate = format(publishedDate, "MMMM d, yyyy")
  const articleUrl = `https://devigo.cloud/blog/${slug}`

  // Schema.org Structured Data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image ? [post.image] : [],
        "datePublished": publishedDate.toISOString(),
        "dateModified": (post.updatedAt ? new Date(post.updatedAt) : publishedDate).toISOString(),
        "author": {
          "@type": "Person",
          "name": post.author || "Techyfe Editorial Board"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Techyfe",
          "url": "https://devigo.cloud",
          "logo": {
            "@type": "ImageObject",
            "url": "https://devigo.cloud/favicon.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleUrl
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://devigo.cloud"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://devigo.cloud/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": articleUrl
          }
        ]
      }
    ]
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-24 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header Banner */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 pt-16 md:pt-24 pb-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 -ml-3 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Articles
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              {categoryName}
            </Badge>
            <span className="text-slate-400 text-xs font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime || "7 min read"}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D7FB8E] text-slate-950 font-black flex items-center justify-center text-sm shadow-2xs">
                {(post.author || "IT").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{post.author || "Techyfe Editorial Board"}</div>
                <div className="text-xs text-slate-500">Verified Technical Guide • Techyfe</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Published {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="container mx-auto max-w-3xl px-4 py-14">
        {post.image && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[520px]" 
            />
          </div>
        )}

        {/* AdSense In-Content Placement */}
        <div className="my-8">
          <AdSlot slotId="blog-post-top" className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800" />
        </div>

        {/* Article HTML Content */}
        <div 
          className="prose prose-lg dark:prose-invert prose-emerald max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-bold hover:prose-a:underline prose-li:text-slate-700 dark:prose-li:text-slate-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* AdSense In-Content Bottom Placement */}
        <div className="my-12">
          <AdSlot slotId="blog-post-bottom" className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800" />
        </div>

        <hr className="my-12 border-slate-200 dark:border-slate-800" />
        
        {/* Related Tool CTA Block */}
        <div className="rounded-3xl p-8 sm:p-10 bg-[#FAFAFA] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" /> InstantTool Free Utilities
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Put these tips into practice</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">
              Access 20+ free, client-side tools for PDF compression, video audio extraction, WebP image conversion, and AI writing.
            </p>
          </div>
          <Link href="/tools">
            <Button size="lg" className="bg-[#D7FB8E] hover:bg-[#cbf576] text-slate-950 font-black px-8 rounded-full shadow-sm hover:scale-105 transition-transform shrink-0">
              Explore All Tools →
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
