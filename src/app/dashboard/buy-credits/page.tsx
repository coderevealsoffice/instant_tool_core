import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { UpgradeButton } from "./SubscriptionClient"
import { Check, Star } from "lucide-react"

export const metadata = {
  title: "Buy Credits & Subscriptions | Instant Tool",
  description: "Manage your Instant Tool subscription and credits.",
}

export default async function BuyCreditsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch active subscription and all active plans
  const [activeSubscription, plans] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" },
      include: { plan: true }
    }),
    prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    })
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Buy Credits & Subscriptions</h1>
        <p className="text-slate-500">Manage your current plan or upgrade to unlock more features and credits.</p>
      </div>

      {/* Current Subscription Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-400 mb-1">CURRENT PLAN</h2>
          {activeSubscription ? (
            <div>
              <p className="text-3xl font-black mb-2 flex items-center gap-3">
                {activeSubscription.plan.name}
                <span className="text-sm font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full uppercase">
                  Active
                </span>
              </p>
              <p className="text-slate-400 text-sm">
                Next billing cycle: {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-black mb-2">No Active Subscription</p>
              <p className="text-slate-400 text-sm">You are currently on a pay-as-you-go or free tier.</p>
            </div>
          )}
        </div>
        {activeSubscription && (
          <div className="bg-slate-800 rounded-xl p-6 text-center min-w-[200px]">
            <p className="text-slate-400 font-bold mb-1">Monthly Credits</p>
            <p className="text-4xl font-black text-yellow-400">{activeSubscription.plan.credits}</p>
          </div>
        )}
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrent = activeSubscription?.planId === plan.id
            const features = Array.isArray(plan.features) ? plan.features as string[] : []

            return (
              <div 
                key={plan.id} 
                className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all ${
                  isCurrent 
                    ? "border-blue-600 bg-blue-50/10 shadow-lg scale-105 z-10" 
                    : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Your Plan
                  </div>
                )}
                
                <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-black text-slate-900">₹{plan.priceMonthly}</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
                
                <div className="mb-8">
                  <p className="font-bold text-slate-900 mb-4">{plan.credits} Credits included</p>
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                    <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      Up to {plan.maxFileSizeMB}MB file size
                    </li>
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <UpgradeButton planId={plan.id} isCurrent={isCurrent} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
    </div>
  )
}
