"use client"

import { Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: any
  }
}

export function PlanCard({ plan, isCurrentPlan }: { plan: any, isCurrentPlan: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    if (isCurrentPlan) return

    setLoading(true)
    try {
      // 1. Create order on the backend
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      })
      const order = await res.json()

      if (!res.ok) throw new Error(order.error)

      // 2. Open Razorpay Checkout
      const options = {
        key: order.keyId, 
        amount: order.amount,
        currency: order.currency,
        name: "InstantTool",
        description: `Subscription to ${plan.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              amount: order.amount
            }),
          })
          
          if (verifyRes.ok) {
            toast.success("Payment successful! Your subscription is now active.")
            router.refresh()
          } else {
            toast.error("Payment verification failed. Please contact support.")
          }
        },
        theme: {
          color: "#2563eb"
        }
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.on("payment.failed", function (response: any) {
        toast.error(response.error.description)
      })
      rzp1.open()

    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-3xl border-2 ${isCurrentPlan ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-100'} p-6 flex flex-col relative`}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Current Plan
        </div>
      )}
      <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
      <p className="text-sm text-slate-500 mb-6 h-10">{plan.description}</p>
      
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black text-slate-900">₹{plan.priceMonthly}</span>
        <span className="text-slate-500 font-semibold">/mo</span>
      </div>
      
      <button 
        onClick={handleSubscribe}
        disabled={isCurrentPlan || loading}
        className={`w-full py-3 rounded-xl font-bold mb-8 transition ${
          isCurrentPlan 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
        }`}
      >
        {isCurrentPlan ? 'Active' : loading ? 'Processing...' : 'Subscribe Now'}
      </button>
      
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
          <Check className="w-5 h-5 text-green-500 shrink-0" /> {plan.credits} Credits / month
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
          <Check className="w-5 h-5 text-green-500 shrink-0" /> {plan.maxFileSizeMB}MB Max File Size
        </div>
        {plan.features.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-slate-600">
            <Check className="w-5 h-5 text-green-500 shrink-0" /> {feature}
          </div>
        ))}
      </div>
    </div>
  )
}
