"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff, Zap, ShieldCheck, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.error || "Registration failed")
        return
      }

      toast.success(data.message || "Registration successful! Please check your email to verify your account.")
      // Clear form
      setName("")
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Left Panel - Vridhi Style Branding */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden bg-green-950">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#c0ffa5] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#a6ff7e] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 w-full max-w-2xl px-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[#c0ffa5] text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Trusted by 1000+ teams
          </div>
          
          <h1 className="text-5xl font-bold text-white leading-[1.1] mb-8 tracking-tighter">
            Scale your business with <span className="text-[#c0ffa5]">InstantTool AI.</span>
          </h1>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors group cursor-default flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c0ffa5] flex items-center justify-center text-green-950 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">10x Faster Processing</h3>
                <p className="text-green-100/60 text-sm">Automated file conversions and enhancements in seconds.</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors group cursor-default flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#c0ffa5] border border-white/10 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">Verified Security</h3>
                <p className="text-green-100/60 text-sm">Bank-grade encryption for all your sensitive documents.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl border border-white/5">
            <p className="text-green-100/80 italic text-sm leading-relaxed mb-4">
              "The most intuitive file platform we've ever used. Our team's productivity tripled in just 3 months."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c0ffa5]/20 flex items-center justify-center text-[#c0ffa5] font-bold text-xs shrink-0">
                JD
              </div>
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider">JAMES DALTON</div>
                <div className="text-green-100/40 text-[10px] font-bold">Growth Lead @ Codereveals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-20 py-12 relative">
        <div className="lg:hidden absolute top-[-5%] right-[-5%] w-40 h-40 bg-green-100 dark:bg-green-900/30 rounded-full blur-[80px] opacity-50"></div>
        <div className="lg:hidden absolute bottom-[-5%] left-[-5%] w-40 h-40 bg-green-50 dark:bg-green-800/20 rounded-full blur-[80px] opacity-50"></div>

        <div className="w-full max-w-[400px] relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/" className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
               <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#c0ffa5] border-2 border-white dark:border-slate-950"></div>
                  <div className="w-6 h-6 rounded-full bg-green-950 dark:bg-green-800 border-2 border-white dark:border-slate-950"></div>
               </div>
              InstantTool
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign up to get 20 free credits today</p>
          </div>

          <div className="flex gap-4 mb-8">
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-semibold shadow-sm"
              onClick={() => handleOAuthLogin("google")}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl font-semibold shadow-sm"
              onClick={() => handleOAuthLogin("github")}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <Input 
                id="name" 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 placeholder:text-slate-400 text-slate-900 dark:text-white focus-visible:ring-green-500 shadow-sm"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 placeholder:text-slate-400 text-slate-900 dark:text-white focus-visible:ring-green-500 shadow-sm"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 placeholder:text-slate-400 text-slate-900 dark:text-white focus-visible:ring-green-500 shadow-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full h-12 text-sm font-bold rounded-2xl bg-green-950 hover:bg-green-900 dark:bg-green-900 dark:hover:bg-green-800 text-white flex items-center justify-center gap-2 shadow-lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
              {!isLoading && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-green-600 dark:text-green-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
