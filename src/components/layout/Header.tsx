"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { MAIN_MENU, TOOL_CATEGORIES } from "@/config/menu"
import { ChevronDown, ChevronRight, Menu, X, ArrowUpRight, Sparkles, BookOpen, FileText, Phone, Award, Layers } from "lucide-react"

import { useSession } from "next-auth/react"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isLockedClosed, setIsLockedClosed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>("PDF Tools")
  const { data: session } = useSession()
  const [credits, setCredits] = useState<number | null>(null)

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Automatically close all dropdowns & mobile menus on navigation and window events
  useEffect(() => {
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
    setIsLockedClosed(true)
    const timer = setTimeout(() => setIsLockedClosed(false), 800)
    return () => clearTimeout(timer)
  }, [pathname])

  // Close menus on outside click or escape
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("header") && !target.closest("nav")) {
        setActiveDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("click", handleDocumentClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
    setIsLockedClosed(true)
    setTimeout(() => {
      setIsLockedClosed(false)
    }, 800)
  }

  const handleMouseEnter = (menuName: string) => {
    if (isLockedClosed) return
    setActiveDropdown(menuName)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

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
        <Link href="/" className="font-black text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Image
            src="/favicon.png"
            alt="InstantTool Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg object-contain shadow-sm"
            priority
          />
          <span>InstantTool</span>
        </Link>
        
        {/* Main Nav Links (Like iLovePDF) */}
        <nav 
          className="hidden lg:flex gap-6 items-center flex-1 ml-10"
          onMouseLeave={handleMouseLeave}
        >
          {/* Global backdrop when any dropdown is open */}
          {activeDropdown && (
            <div 
              className="fixed inset-0 top-16 bg-black/10 dark:bg-black/30 backdrop-blur-2xs z-30 transition-opacity"
              onClick={closeAllDropdowns}
            />
          )}
          
          {/* PDF Tools Dropdown */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => handleMouseEnter("pdf")}
          >
            <button 
              onClick={() => setActiveDropdown(activeDropdown === "pdf" ? null : "pdf")}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase flex items-center gap-1 cursor-pointer"
            >
              PDF Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "pdf" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "pdf" && (
              <div 
                className="absolute top-16 left-0 w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-2 gap-2">
                  {TOOL_CATEGORIES.find(c => c.title === "PDF Tools")?.tools?.slice(0, 10).map((tool, idx) => (
                    <Link 
                      key={idx} 
                      href={tool.href} 
                      onClick={closeAllDropdowns}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-slate-800 hover:text-emerald-600 rounded-md transition-colors"
                    >
                      <span className="text-slate-400 group-hover:text-emerald-600 transition-colors scale-75">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link 
                    href="/pdf-tools" 
                    onClick={closeAllDropdowns}
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View All PDF Tools →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Video Tools Dropdown */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => handleMouseEnter("video")}
          >
            <button 
              onClick={() => setActiveDropdown(activeDropdown === "video" ? null : "video")}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase flex items-center gap-1 cursor-pointer"
            >
              Video Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "video" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "video" && (
              <div 
                className="absolute top-16 left-0 w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-2 gap-2">
                  {TOOL_CATEGORIES.find(c => c.title === "Video Tools")?.tools?.slice(0, 10).map((tool, idx) => (
                    <Link 
                      key={idx} 
                      href={tool.href} 
                      onClick={closeAllDropdowns}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-slate-800 hover:text-emerald-600 rounded-md transition-colors"
                    >
                      <span className="text-slate-400 group-hover:text-emerald-600 transition-colors scale-75">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link 
                    href="/video-tools" 
                    onClick={closeAllDropdowns}
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View All Video Tools →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mega Menu Trigger */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => handleMouseEnter("all")}
          >
            <button 
              onClick={() => setActiveDropdown(activeDropdown === "all" ? null : "all")}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase flex items-center gap-1 cursor-pointer"
            >
              All Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "all" ? "rotate-180" : ""}`} />
            </button>
            
            {/* Mega Menu Dropdown — fixed to viewport for proper centering */}
            {activeDropdown === "all" && (
              <div 
                className="fixed top-16 left-0 right-0 flex justify-center z-50 pointer-events-auto animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="w-full max-w-7xl mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-b-2xl p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOL_CATEGORIES.filter(c => !["PDF Tools", "Video Tools", "AI Tools"].includes(c.title)).map((category, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b dark:border-slate-800 pb-2">
                          {category.title}
                        </h4>
                        <ul className="space-y-2">
                          {category.tools?.slice(0, 4).map((tool, toolIdx) => (
                            <li key={toolIdx}>
                              <Link 
                                href={tool.href}
                                onClick={closeAllDropdowns}
                                className="flex items-center gap-3 group/item hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 p-2 -ml-2 rounded-lg transition-colors"
                              >
                                <div className="text-slate-400 group-hover/item:text-emerald-600 transition-colors flex-shrink-0">
                                  {tool.icon}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-white truncate">
                                  {tool.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                          {(category.tools?.length ?? 0) > 4 && (
                            <li>
                              <Link 
                                href="/tools" 
                                onClick={closeAllDropdowns}
                                className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline p-2 block"
                              >
                                View all {category.tools?.length} tools...
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

          {/* SEO Tools Dropdown */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => handleMouseEnter("seo")}
          >
            <button 
              onClick={() => setActiveDropdown(activeDropdown === "seo" ? null : "seo")}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors uppercase flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SEO Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "seo" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "seo" && (
              <div 
                className="absolute top-16 left-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="flex flex-col gap-1.5">
                  {TOOL_CATEGORIES.find(c => c.title === "SEO Tools")?.tools.map((tool, idx) => (
                    <Link 
                      key={idx} 
                      href={tool.href} 
                      onClick={closeAllDropdowns}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-emerald-500 transition-colors">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                  
                  <Link 
                    href="/seo-tools" 
                    onClick={closeAllDropdowns}
                    className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                  >
                    View All SEO & AEO Tools &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* AI Tools Dropdown */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => handleMouseEnter("ai")}
          >
            <button 
              onClick={() => setActiveDropdown(activeDropdown === "ai" ? null : "ai")}
              className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors uppercase flex items-center gap-1 bg-[#D7FB8E]/30 dark:bg-[#D7FB8E]/10 px-3 py-1.5 rounded-full border border-black/10 dark:border-[#D7FB8E]/20 cursor-pointer"
            >
              AI Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "ai" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "ai" && (
              <div 
                className="absolute top-16 left-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-b-xl py-4 px-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="flex flex-col gap-2">
                  {TOOL_CATEGORIES.find(c => c.title === "AI Tools")?.tools?.slice(0, 10).map((tool, idx) => (
                    <Link 
                      key={idx} 
                      href={tool.href} 
                      onClick={closeAllDropdowns}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#D7FB8E]/20 dark:hover:bg-[#D7FB8E]/10 hover:text-slate-950 dark:hover:text-white rounded-md transition-colors"
                    >
                      <span className="text-slate-500 group-hover:text-slate-950 transition-colors">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                  
                  <Link 
                    href="/ai-tools" 
                    onClick={closeAllDropdowns}
                    className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                  >
                    View all AI tools &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/workspace" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D7FB8E] text-slate-950 font-medium text-xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
                100% Free Plan
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hidden sm:block">
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-medium text-sm tracking-tight transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99] hidden sm:inline-flex">
                <span>Free Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
              </Link>
            </>
          )}
          <button 
            type="button"
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-200/80 dark:border-slate-700 shadow-2xs cursor-pointer select-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Modern Fullscreen Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <div className="p-4 sm:p-6 space-y-6 max-w-lg mx-auto">
            
            {/* Top Primary Action Banner */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  ◆ Instant Online Suite
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  100% Free &bull; No Sign-Up
                </span>
              </div>
              <Link 
                href="/tools" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-xs"
              >
                <span>Explore All 100+ Tools</span>
                <ArrowUpRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>

            {/* Category Tool Accordions */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Tool Categories
              </div>

              {TOOL_CATEGORIES.map((category) => {
                const isExpanded = expandedMobileCategory === category.title

                return (
                  <div 
                    key={category.title}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedMobileCategory(isExpanded ? null : category.title)}
                      className="w-full p-4 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                          ({category.tools?.length || 0})
                        </span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-1 animate-in fade-in-50 duration-150">
                        {category.tools?.slice(0, 8).map((tool, idx) => (
                          <Link
                            key={idx}
                            href={tool.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <span className="w-5 h-5 flex items-center justify-center text-slate-400">{tool.icon}</span>
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        ))}
                        <Link
                          href={category.title.toLowerCase().includes("seo") ? "/seo-tools" : category.title.toLowerCase().includes("pdf") ? "/pdf-tools" : category.title.toLowerCase().includes("video") ? "/video-tools" : category.title.toLowerCase().includes("ai") ? "/ai-tools" : "/tools"}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 p-2 hover:underline"
                        >
                          View all {category.title} →
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Company & Knowledge Base Links */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Company &amp; Guides
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
                >
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>Blog &amp; Guides</span>
                </Link>

                <Link
                  href="/tutorials"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Tutorials</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
                >
                  <Award className="w-4 h-4 text-sky-500" />
                  <span>About Techyfe</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Contact Us</span>
                </Link>
              </div>

              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Subscription Plans</span>
                </span>
                <span className="text-[10px] text-slate-400">Optional Pro &rarr;</span>
              </Link>
            </div>

            {/* User Session / Workspace */}
            <div className="pt-2">
              {session ? (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm tracking-tight shadow-xs"
                >
                  <span>Go to Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm tracking-tight shadow-xs"
                >
                  <span>Log In / Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
