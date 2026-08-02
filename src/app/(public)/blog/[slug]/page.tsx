import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma/client"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, User, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })

  if (!post) {
    return { title: "Not Found | Instant Tool" }
  }

  return {
    title: post.metaTitle || `${post.title} | Instant Tool`,
    description: post.metaDesc || post.excerpt || `Read ${post.title} on Instant Tool.`,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true }
  })

  if (!post || !post.isPublished) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 -ml-4 text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 mb-6">
            {post.category && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                <Tag className="w-3 h-3 mr-1" />
                {post.category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">{post.author || "Instant Tool Team"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="container mx-auto max-w-3xl px-4 py-16">
        {post.image && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
        <div 
          className="prose prose-lg dark:prose-invert prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <hr className="my-12 border-slate-200 dark:border-slate-800" />
        
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to boost your productivity?</h3>
            <p className="text-slate-600 dark:text-slate-400">Explore our suite of 20+ free tools for PDF, Video, Audio, and Image processing.</p>
          </div>
          <Link href="/">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full whitespace-nowrap">
              Explore Tools
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
