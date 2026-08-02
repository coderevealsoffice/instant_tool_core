"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail("")
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
        ✅ You're subscribed! Welcome aboard.
      </div>
    )
  }

  return (
    <form className="flex w-full md:w-[420px] relative items-center" onSubmit={handleSubmit}>
      <Mail className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full pl-12 pr-36 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
        required
      />
      <Button
        type="submit"
        className="absolute right-1.5 rounded-full px-5 py-2 bg-slate-900 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-sm transition-colors h-auto"
      >
        Subscribe
      </Button>
    </form>
  )
}
