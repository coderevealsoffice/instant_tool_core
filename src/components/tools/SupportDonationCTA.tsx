"use client"

import { useState } from "react"
import { Heart, Loader2, Sparkles, Target, Coffee, Zap } from "lucide-react"
import { toast } from "sonner"
import Script from "next/script"

export function SupportDonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const predefinedAmounts = [50, 100, 250, 500]

  const handleDonate = async () => {
    const amount = customAmount ? Number(customAmount) : selectedAmount
    
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      })
      
      const order = await res.json()
      
      if (!res.ok) {
        throw new Error(order.error || "Failed to initiate payment")
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "InstantTool Support",
        description: "Donation to keep tools free and ad-free",
        image: "https://devigo.cloud/logo.png",
        order_id: order.id, 
        handler: function (response: any) {
          toast.success("Thank you for your donation! Your support means the world to us ❤️", {
            duration: 5000,
          })
          setCustomAmount("")
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#4f46e5" } // Indigo
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any){
        toast.error(`Payment Failed: ${response.error.description}`)
      })
      rzp.open()

    } catch (err: any) {
      toast.error(err.message || "Failed to load payment gateway")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="relative py-24 px-4 overflow-hidden bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-white/5 font-sans">
        
        {/* Animated Background Gradients & Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px] opacity-60 dark:opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side: Copy & Social Proof */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold mb-8 shadow-sm">
                <Heart className="w-4 h-4 animate-pulse fill-current" />
                100% Free & Ad-Free Forever
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Fuel the servers,<br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Buy us a coffee! ☕
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                We're on a mission to provide premium tools for everyone, without the premium price tag. Your contribution helps us pay for hosting and develop new features faster.
              </p>

              {/* Progress Bar Gamification */}
              <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500"/> Monthly Server Goal
                  </span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">82%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 w-[82%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out">
                    <div className="absolute inset-0 opacity-30 bg-[length:20px_20px]" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)'}}></div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Supporter" />
                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede" alt="Supporter" />
                    <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf" alt="Supporter" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Join <strong className="text-slate-800 dark:text-white">1,248+</strong> supporters
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Interactive Card */}
            <div className="w-full max-w-md mx-auto lg:ml-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative">
                
                {/* Decorative element */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20"></div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Coffee className="w-6 h-6 text-orange-500" />
                    Choose Amount
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Every rupee helps keep the servers running.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount("") }}
                      className={`relative overflow-hidden py-4 rounded-2xl font-bold text-lg transition-all duration-300
                        ${selectedAmount === amt && !customAmount 
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_8px_16px_-6px_rgba(99,102,241,0.6)] scale-[1.03] border border-transparent ring-2 ring-indigo-400/50 ring-offset-2 dark:ring-offset-slate-900" 
                          : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5"
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        <span className="text-sm opacity-70">₹</span>{amt}
                      </span>
                      {selectedAmount === amt && !customAmount && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative mb-8 group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 transition duration-500"></div>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-slate-400 font-bold text-lg">₹</span>
                    <input 
                      type="number"
                      placeholder="Custom Amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(0)
                      }}
                      className="w-full pl-10 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 font-bold text-lg transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleDonate}
                  disabled={isProcessing}
                  className="relative w-full overflow-hidden py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] text-white font-black text-lg rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] transition-all hover:scale-[1.02] hover:bg-[100%_auto] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3 group"
                >
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Donate Now</span>
                      <Zap className="w-5 h-5 relative z-10 group-hover:text-yellow-300 transition-colors" />
                    </>
                  )}
                </button>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  256-bit Secure Razorpay Payment
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </>
  )
}
