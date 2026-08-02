import { ReactNode } from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LayoutDashboard, LogOut, ArrowLeft } from "lucide-react"

export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  
  if (!session?.user || !["EMPLOYEE", "ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-4">
          <Link href="/" className="font-black text-xl text-white flex items-center gap-2">
            InstantTool
          </Link>
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Employee Portal</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <Link href="/employee" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-semibold transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Tasks
          </Link>
        </div>
        <div className="p-6 border-t border-slate-800 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white font-semibold transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to User Dashboard
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 text-red-400 hover:text-red-300 font-semibold transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
