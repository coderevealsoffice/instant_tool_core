"use client"

import { useState } from "react"
import { updateSubscriptionAction } from "./actions"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function UpgradeButton({ planId, isCurrent }: { planId: string, isCurrent: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    setIsProcessing(true)
    try {
      const res = await updateSubscriptionAction(planId)
      if (res.success) {
        toast.success(`Successfully upgraded to ${res.planName}!`)
      }
    } catch (error) {
      toast.error("Failed to update subscription")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isCurrent) {
    return (
      <button 
        disabled
        className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200"
      >
        <CheckCircle2 className="w-5 h-5" /> Current Plan
      </button>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={isProcessing}
      className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
      {isProcessing ? "Updating..." : "Subscribe Now"}
    </button>
  )
}
