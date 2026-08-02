"use client"

import { useState } from "react"
import { CreditPack } from "@/config/pricing"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function BillingClient({ pack }: { pack: CreditPack }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      // Load Razorpay script dynamically
      const isLoaded = await new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true)
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })

      if (!isLoaded) {
        toast.error("Failed to load payment gateway")
        return
      }

      // 1. Create Order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pack.priceINR,
          planId: null,
          creditPack: pack.id,
        })
      })

      if (!res.ok) {
        throw new Error("Failed to create order")
      }
      const data = await res.json()

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount, // in paise
        currency: "INR",
        name: "InstantTool",
        description: `Purchase ${pack.title} (${pack.credits} Credits)`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (verifyRes.ok) {
              toast.success("Payment successful! Credits added to your account.")
              router.push("/dashboard")
              router.refresh()
            } else {
              toast.error("Payment verification failed.")
            }
          } catch (err) {
            toast.error("Error verifying payment.")
          }
        },
        prefill: {
          name: "User", // Can be dynamically populated
          email: "user@example.com",
        },
        theme: {
          color: "#E5322D"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`)
      })
      rzp.open()

    } catch (err) {
      console.error(err)
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={handleBuy}
        disabled={isLoading}
        className={`w-full font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 ${
          pack.isPopular 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buy Now"}
      </button>
    </>
  )
}
