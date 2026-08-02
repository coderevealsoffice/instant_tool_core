"use client"

import { ReactNode } from "react"

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {children}
    </div>
  )
}
