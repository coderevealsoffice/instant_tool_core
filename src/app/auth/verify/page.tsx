"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    if (!token || !email) {
      setStatus("error")
      setMessage("Missing verification token or email.")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        })
        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully!")
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An unexpected error occurred during verification.")
      }
    }

    verifyEmail()
  }, [token, email])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
      <div className="flex justify-center mb-6">
        {status === "loading" && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
        {status === "success" && <CheckCircle2 className="w-16 h-16 text-green-500" />}
        {status === "error" && <XCircle className="w-16 h-16 text-red-500" />}
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        {status === "loading" && "Verifying Email"}
        {status === "success" && "Verified!"}
        {status === "error" && "Verification Failed"}
      </h2>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {message}
      </p>

      {status !== "loading" && (
        <Link 
          href="/auth/login" 
          className={buttonVariants({ className: "w-full h-12 bg-green-950 hover:bg-green-900 dark:bg-green-900 dark:hover:bg-green-800 text-white rounded-2xl" })}
        >
          Go to Login
        </Link>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="mb-10 text-center">
        <Link href="/" className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-[#c0ffa5] border-2 border-white dark:border-slate-950"></div>
            <div className="w-6 h-6 rounded-full bg-green-950 dark:bg-green-800 border-2 border-white dark:border-slate-950"></div>
          </div>
          InstantTool
        </Link>
      </div>

      <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
