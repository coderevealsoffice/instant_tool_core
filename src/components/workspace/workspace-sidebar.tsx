"use client"

import Link from "next/link"
import {
  FileText,
  Settings,
  MoreHorizontal,
  Files,
  Scissors,
  Wand2,
  FileSignature,
  FileCheck2,
  ArrowLeft,
  User,
  LayoutGrid,
  Sparkles,
  LayoutDashboard,
  GalleryVerticalEnd
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function WorkspaceSidebar({ category }: { category: string }) {
  const { data: session } = useSession()
  const userFallback = session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"

  // We can dynamically render different toolsets based on category. 
  // For now, it matches the Smallpdf-like PDF tools sidebar.

  const tools = [
    { name: "Compress", icon: FileText, color: "text-blue-500", url: "/pdf-tools/compress-pdf" },
    { name: "Convert", icon: ArrowLeft, color: "text-red-500", url: "/converters/document" },
    { name: "Organize", icon: LayoutGrid, color: "text-purple-500", url: "/pdf-tools/merge-pdf", active: true },
    { name: "Edit", icon: Scissors, color: "text-cyan-500", url: "/pdf-tools/edit-pdf" },
    { name: "Sign", icon: FileSignature, color: "text-green-500", url: "/pdf-tools/sign-pdf" },
    { name: "AI PDF", icon: Wand2, color: "text-amber-500", url: "/ai-tools/ai-pdf-chatbot" },
  ]

  return (
    <aside className="w-20 bg-[#0f172a] flex flex-col items-center py-4 justify-between h-full z-20 shadow-xl shrink-0">
      <div className="flex flex-col items-center w-full space-y-4">
        {/* App Logo/Icon */}
        <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg hover:scale-105 transition-transform">
          <GalleryVerticalEnd className="w-5 h-5" />
        </Link>

        {/* Tools */}
        <nav className="flex flex-col w-full px-2 space-y-1">
          {tools.map((t) => (
            <Link
              key={t.name}
              href={t.url}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${t.active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <t.icon className={`w-5 h-5 mb-1 ${t.active ? "text-white" : t.color}`} />
              <span className="text-[9px] font-bold tracking-wider uppercase">{t.name}</span>
            </Link>
          ))}

          <button className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            <LayoutGrid className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider uppercase">More</span>
          </button>
        </nav>
      </div>

      <div className="flex flex-col items-center w-full space-y-2 px-2">
        <Link
          href="/ai-tools"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all w-full"
        >
          <Sparkles className="w-5 h-5 mb-1 text-purple-400" />
          <span className="text-[9px] font-bold tracking-wider uppercase truncate w-full text-center">AI Tools</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all w-full"
        >
          <LayoutDashboard className="w-5 h-5 mb-1 text-slate-300" />
          <span className="text-[9px] font-bold tracking-wider uppercase truncate w-full text-center">Dashboard</span>
        </Link>
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center text-white hover:border-slate-500 transition-colors mt-2 overflow-hidden"
        >
          {session?.user ? (
            <Avatar className="h-full w-full rounded-full">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback className="w-full h-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                {userFallback.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}
