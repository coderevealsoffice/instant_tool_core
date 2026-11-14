"use client"

import { useState } from "react"
import { Heart, Loader2, Coffee, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Script from "next/script"

export function SupportDonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const predefinedAmounts = [50, 100, 250, 500]
  const currentAmount = customAmount ? Number(customAmount) : selectedAmount

  const handleDonate = async () => {
    const amount = currentAmount
    
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsProcessing(true)

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      })
      
      const order = await res.json()
      
      if (!res.ok) {
        throw new Error(order.error || "Failed to initiate payment")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "InstantTool Support",
        description: "Donation to keep tools fast and free",
        image: "/favicon.png",
        order_id: order.id, 
        handler: function () {
          toast.success("Thank you for your generous support! ❤️", {
            duration: 5000,
          })
          setCustomAmount("")
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#10b981" }
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
      
      <div className="w-full max-w-4xl mx-auto px-4 py-8 font-sans">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20 p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left: Message & Value Proposition */}
            <div className="space-y-2 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Buy Us a Coffee
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Support InstantTool &amp; Keep Tools Free
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                We build free multimedia, PDF, and SEO tools for everyone. A small contribution helps us cover server infrastructure and maintain high-speed processing.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Secure Razorpay
                </span>
                <span>•</span>
                <span>100% Voluntary</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  Community Supported
                </span>
              </div>
            </div>

            {/* Right: Clean, Compact Donation Controls */}
            <div className="w-full sm:w-auto min-w-[300px] flex-shrink-0 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Select Contribution:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  ₹{currentAmount || 0}
                </span>
              </div>

              {/* Amount Pills */}
              <div className="grid grid-cols-4 gap-2">
                {predefinedAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt)
                        setCustomAmount("")
                      }}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                        isSelected
                          ? "bg-[#D7FB8E] text-slate-950 border-[#b5eb4e] shadow-2xs scale-105 font-bold"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  )
                })}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Or enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(0)
                  }}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={handleDonate}
                disabled={isProcessing || !currentAmount || currentAmount < 1}
                className="w-full bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-medium text-xs h-10 rounded-xl gap-2 shadow-xs border border-black/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-slate-950" />
                    <span className="font-semibold text-slate-950">Tip ₹{currentAmount || 100}</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <span>256-bit encrypted Razorpay checkout</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  )
}
