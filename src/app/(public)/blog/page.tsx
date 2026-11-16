import { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"
import { BUILTIN_BLOG_POSTS } from "@/lib/blogs-data"
import { format } from "date-fns"
import { Search, ArrowRight, BookOpen, Clock, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "InstantTool Blog - Productivity, AI & Speed Guides",
  description: "Read in-depth guides, technical tutorials, and product updates on PDF editing, video compression, client-side WebAssembly, and AI automation.",
  alternates: {
    canonical: "https://devigo.cloud/blog"
  },
  keywords: [
    "InstantTool blog", "pdf guides", "video compression tutorial", "webassembly tutorials",
    "ai productivity tips", "speed guides", "file conversion blog"
  ],
  openGraph: {
    title: "InstantTool Blog - Productivity, AI & Speed Guides",
    description: "Read in-depth guides, technical tutorials, and product updates on PDF editing, video compression, client-side WebAssembly, and AI automation.",
    url: "https://devigo.cloud/blog",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantTool Blog - Productivity, AI & Speed Guides",
    description: "Read in-depth guides, technical tutorials, and product updates on PDF editing, video compression, client-side WebAssembly, and AI automation.",
  }
};

export default async function BlogFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }> | { category?: string; search?: string }
}) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : (searchParams || {})
  const categoryFilter = resolvedParams.category
  const searchQuery = resolvedParams.search

  const whereClause: any = { isPublished: true }
  
  if (categoryFilter && categoryFilter !== "All") {
    whereClause.category = { name: categoryFilter }
  }
  
  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { content: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  // 1. Safely query DB posts
  const dbPosts = await safeDbQuery(
    () => prisma.blogPost.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    []
  )

  // 2. Prepare high-value builtin articles as fallback & baseline corpus
  const builtinFormatted = BUILTIN_BLOG_POSTS.map(b => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    author: b.author,
    image: b.image,
    isPublished: true,
    createdAt: new Date(b.createdAt),
    category: { name: b.categoryName, slug: b.categoryName.toLowerCase().replace(/\s+/g, '-') },
    readTime: b.readTime,
  }))

  // 3. Merge: Builtin baseline + DB posts (DB posts take priority if same slug exists)
  const postMap = new Map<string, any>()
  builtinFormatted.forEach(p => postMap.set(p.slug, p))
  dbPosts.forEach((p: any) => postMap.set(p.slug, p))

  let posts = Array.from(postMap.values())

  // Apply filters in memory if search or category param was supplied
  if (categoryFilter && categoryFilter !== "All") {
    posts = posts.filter(p => p.category?.name?.toLowerCase() === categoryFilter.toLowerCase())
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    posts = posts.filter(p => 
      p.title?.toLowerCase().includes(q) || 
      p.excerpt?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q)
    )
  }

  // All distinct categories
  const allPostCategories = Array.from(postMap.values()).map(p => p.category?.name).filter(Boolean)
  const uniqueCategories = Array.from(new Set(allPostCategories))
  const categories = ["All", ...uniqueCategories]

  const featuredPost = posts.length > 0 && !categoryFilter && !searchQuery ? posts[0] : null
  const gridPosts = featuredPost ? posts.slice(1) : posts

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white pb-24 font-sans">
      <div className="container mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
            <span>◆ Expert Guides & Tutorials</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            The InstantTool Blog &amp; Knowledge Base
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl">
            In-depth engineering deep dives, file management strategies, WebAssembly privacy architecture, and AI automation tutorials.
          </p>
        </div>

        {/* Categories Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = (!categoryFilter && cat === "All") || categoryFilter === cat
              return (
                <Link
                  key={cat}
                  href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>

          <div className="w-full md:w-72 relative">
            <form action="/blog" method="GET">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              <input 
                type="text" 
                name="search"
                placeholder="Search articles..." 
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
              />
            </form>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-center p-3 lg:p-6 gap-8 lg:gap-12 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden relative">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-4 lg:p-6 lg:pl-0 flex flex-col justify-center items-start">
              <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800">
                  Featured • {featuredPost.category?.name || "Guide"}
                </span>
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredPost.readTime || "7 min read"}
                </span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-extrabold mb-4 leading-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-base leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between w-full pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500">
                  By {featuredPost.author || "InstantTool Editorial"} • {format(new Date(featuredPost.createdAt), "MMMM d, yyyy")}
                </div>
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Read full article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Grid Posts */}
        {gridPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <Link 
                key={post.id || post.slug} 
                href={`/blog/${post.slug}`} 
                className="group flex flex-col p-5 rounded-3xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {post.category?.name || "Article"}
                  </span>
                  <span className="text-slate-400 font-normal">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2.5 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>{post.readTime || "6 min read"}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Read guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
