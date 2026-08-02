"use client"

import Link from "next/link"
import { useState } from "react"
import { MAIN_MENU, TOOL_CATEGORIES } from "@/config/menu"
import { ChevronDown, Menu, X } from "lucide-react"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/credits")
        .then(async res => {
          if (!res.ok) throw new Error("Failed to fetch credits")
          return res.json()
        })
        .then(data => {
          if (data && data.credits !== undefined) {
            setCredits(data.credits)
          }
        })
        .catch(console.error)
    }
  }, [session])

  return (
    <header className="border-b dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
           <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-red-600"></div>
              <div className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-300"></div>
           </div>
          InstantTool
        </Link>
        
        {/* Main Nav Links (Like iLovePDF) */}
        <nav className="hidden lg:flex gap-6 items-center flex-1 ml-10">
          {/* PDF Tools Dropdown */}
          <div className="relative group h-16 flex items-center">
            <button className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors uppercase flex items-center gap-1">
              PDF Tools <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-16 left-0 w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 hidden group-hover:block">
              <div className="grid grid-cols-2 gap-2">
                {TOOL_CATEGORIES.find(c => c.title === "PDF Tools")?.tools.slice(0, 10).map((tool, idx) => (
                  <Link key={idx} href={tool.href} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 rounded-md transition-colors">
                    <span className="text-slate-400 group-hover:text-red-600 transition-colors scale-75">{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t dark:border-slate-800 text-center">
                <Link href="/tools" className="text-sm font-bold text-red-600 hover:underline">View All PDF Tools →</Link>
              </div>
            </div>
          </div>

          {/* Video Tools Dropdown */}
          <div className="relative group h-16 flex items-center">
            <button className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors uppercase flex items-center gap-1">
              Video Tools <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-16 left-0 w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 hidden group-hover:block">
              <div className="grid grid-cols-2 gap-2">
                {TOOL_CATEGORIES.find(c => c.title === "Video Tools")?.tools.slice(0, 10).map((tool, idx) => (
                  <Link key={idx} href={tool.href} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 rounded-md transition-colors">
                    <span className="text-slate-400 group-hover:text-red-600 transition-colors scale-75">{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t dark:border-slate-800 text-center">
                <Link href="/tools" className="text-sm font-bold text-red-600 hover:underline">View All Video Tools →</Link>
              </div>
            </div>
          </div>

          {/* Mega Menu Trigger */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="text-sm font-bold text-red-600 transition-colors uppercase flex items-center gap-1">
              All Tools <ChevronDown className="w-4 h-4" />
            </button>
            
            {/* Mega Menu Dropdown — fixed to viewport for proper centering */}
            {isMegaMenuOpen && (
              <div className="fixed top-16 left-0 right-0 flex justify-center z-50">
                <div className="w-full max-w-7xl mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-b-2xl p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOL_CATEGORIES.filter(c => !["PDF Tools", "Video Tools", "AI Tools"].includes(c.title)).map((category, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b dark:border-slate-800 pb-2">
                          {category.title}
                        </h4>
                        <ul className="space-y-2">
                          {category.tools.slice(0, 4).map((tool, toolIdx) => (
                            <li key={toolIdx}>
                              <Link 
                                href={tool.href}
                                className="flex items-center gap-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -ml-2 rounded-lg transition-colors"
                              >
                                <div className="text-slate-400 group-hover:text-red-600 transition-colors flex-shrink-0">
                                  {tool.icon}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                                  {tool.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                          {category.tools.length > 4 && (
                            <li>
                              <Link href="/tools" className="text-sm font-bold text-red-600 hover:underline p-2 block">
                                View all {category.tools.length} tools...
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Tools Dropdown */}
          <div className="relative group h-16 flex items-center">
            <button className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-500 transition-colors uppercase flex items-center gap-1 bg-fuchsia-50 dark:bg-fuchsia-900/30 px-3 py-1.5 rounded-full border border-fuchsia-100 dark:border-fuchsia-800">
              AI Tools <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-16 left-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 hidden group-hover:block">
              <div className="flex flex-col gap-2">
                {TOOL_CATEGORIES.find(c => c.title === "AI Tools")?.tools.slice(0, 10).map((tool, idx) => (
                  <Link key={idx} href={tool.href} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 hover:text-fuchsia-600 rounded-md transition-colors">
                    <span className="text-slate-400 group-hover:text-fuchsia-600 transition-colors">{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
                
                <Link href="/ai-tools" className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors">
                  View all AI tools &rarr;
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard/billing" className="hidden sm:flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-full font-bold text-sm border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                {credits !== null ? `${credits} Credits` : "..."}
              </Link>
              <Link href="/dashboard" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hidden sm:block">
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/register" className="text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm hover:shadow-md hidden sm:block">
                Become a Member
              </Link>
            </>
          )}
          <button className="lg:hidden p-1 bg-slate-100 dark:bg-slate-800 rounded-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          <div className="p-4 flex flex-col gap-4">
            <Link href="/pdf-tools" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-red-600 transition-colors uppercase py-2 border-b border-slate-100 dark:border-slate-800">PDF Tools</Link>
            <Link href="/video-tools" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-red-600 transition-colors uppercase py-2 border-b border-slate-100 dark:border-slate-800">Video Tools</Link>
            <Link href="/ai-tools" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-fuchsia-600 hover:text-fuchsia-700 transition-colors uppercase py-2 border-b border-slate-100 dark:border-slate-800">AI Tools</Link>
            <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-red-600 transition-colors uppercase py-2">All Tools →</Link>
            
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
            
            {session ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-700 dark:text-slate-200 py-2">Dashboard</Link>
            ) : (
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-slate-700 dark:text-slate-200 py-2">Become a Member</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
