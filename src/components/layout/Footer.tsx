import Link from "next/link"
import { FOOTER_MENU } from "@/config/menu"
import { Mail, Phone, MapPin } from "lucide-react"
import { NewsletterForm } from "@/components/layout/NewsletterForm"

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-200 mt-auto transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50">
      
      {/* Newsletter Section */}
      <div className="border-b border-slate-200 dark:border-slate-800/50">
        <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
                Stay ahead of the curve
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                Get weekly tips on video editing, format conversions, and productivity tools. Join 10,000+ subscribers.
              </p>
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          
          {/* Brand & Contact Info */}
          <div className="lg:w-1/3 flex flex-col space-y-6">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-slate-50 dark:border-[#0B0F19]"></div>
                <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-slate-50 dark:border-[#0B0F19]"></div>
                <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-slate-50 dark:border-[#0B0F19]"></div>
              </div>
              InstantTool
            </Link>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Your all-in-one platform for video editing, PDF conversions, and media manipulation — right in your browser.
            </p>

            <div className="space-y-4 pt-2">
              <a href="mailto:info.codereveals@gmail.com" className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                info.codereveals@gmail.com
              </a>
            </div>
          </div>

          {/* Links Grid (8 sections) */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {FOOTER_MENU.map((section, idx) => (
              <div key={idx} className="flex flex-col">
                <h3 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link 
                        href={item.href} 
                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/50 py-6">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} InstantTool. All rights reserved.
          </p>
          <div className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for the people of the internet.
          </div>
        </div>
      </div>
    </footer>
  )
}
