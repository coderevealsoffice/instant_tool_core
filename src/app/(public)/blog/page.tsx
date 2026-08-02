import { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma/client"
import { format } from "date-fns"
import { Search, ArrowRight } from "lucide-react"

export const metadata = {
  title: "InstantTool Blog - File Management Tips & Tricks",
  description: "Read the latest tips, tricks, and updates on file management, productivity, and how to get the most out of InstantTool.",
  alternates: {
    canonical: "https://devigo.cloud/blog"
  }
};

export default async function BlogFeedPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const categoryFilter = searchParams.category
  const searchQuery = searchParams.search

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

  const posts = await prisma.blogPost.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  })

  // Get all categories for the filter
  const allPostsForCategories = await prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: true }
  })
  const uniqueCategories = Array.from(new Set(allPostsForCategories.map(p => p.category?.name).filter(Boolean)))
  const categories = ["All", ...uniqueCategories]

  const featuredPost = posts.length > 0 && !categoryFilter && !searchQuery ? posts[0] : null
  const gridPosts = featuredPost ? posts.slice(1) : posts

  // Generate a random gradient or image for posts without one
  const getGradient = (id: string) => {
    const gradients = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-pink-500",
      "from-green-400 to-emerald-600",
      "from-orange-400 to-red-500",
      "from-indigo-500 to-blue-600",
    ]
    const index = id.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  const getUnsplashImage = (id: string) => {
    const images = [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531297172867-4b5cb3c827cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    ]
    const index = id.charCodeAt(0) % images.length
    return images[index]
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white pb-24 font-sans">
      <div className="container mx-auto max-w-6xl px-4 pt-16 md:pt-24">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            The InstantTool Blog
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400">
            Growth strategies, technical deep dives, and product updates.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row items-center p-2 lg:p-4 gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden relative">
              <img 
                src={featuredPost.image || getUnsplashImage(featuredPost.id)} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-6 lg:p-8 lg:pl-0 flex flex-col justify-center items-start">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-500">
                <span>Featured • {featuredPost.category?.name || "Update"}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <Link 
                href={`/blog/${featuredPost.slug}`}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                Read Full Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = categoryFilter === cat || (!categoryFilter && cat === "All");
              return (
                <Link
                  key={cat}
                  href={cat === "All" ? "/blog" : `/blog?category=${cat}`}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <form action="/blog" method="GET">
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              <input 
                type="text" 
                name="search"
                placeholder="Search blog..." 
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
              />
            </form>
          </div>
        </div>

        {/* Grid Posts */}
        {gridPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {gridPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={post.image || getUnsplashImage(post.id)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-green-600 dark:text-green-500">{post.category?.name || "Article"}</span>
                  <span className="text-slate-400">• {format(new Date(post.createdAt), "MMM d")}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
