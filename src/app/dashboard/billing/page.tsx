import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { CreditCard, Check, ShieldCheck, Zap, Download } from "lucide-react"
import { PlanCard } from "@/components/dashboard/plan-card"
import { CREDIT_PACKS } from "@/config/pricing"
import { BillingClient } from "./BillingClient"

export const metadata = {
  title: "Billing & Plans - InstantTool",
}

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const userId = typeof session.user.id === 'string' ? session.user.id : undefined
  const userEmail = typeof session.user.email === 'string' ? session.user.email : undefined

  let user = null;
  if (userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      })
    } catch (error) {
      console.error("Prisma error fetching user in billing:", error)
    }
  } else if (userEmail) {
    try {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { credits: true }
      })
    } catch (error) {
      console.error("Prisma error fetching user by email in billing:", error)
    }
  }

  let subscription = null;
  try {
    subscription = userId ? await prisma.subscription.findFirst({
      where: { userId: userId, status: "ACTIVE" }
    }) : null;
  } catch (error) {
    console.error("Prisma error fetching subscription:", error);
  }

  // Fetch recent payments/invoices
  let payments: any[] = [];
  try {
    payments = userId ? await prisma.payment.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 10
    }) : [];
  } catch (error) {
    console.error("Prisma error fetching payments:", error);
  }

  const activePlans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: "asc" }
  })

  const userPlanId = subscription?.planId

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 w-full">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Billing & Credits</h1>
        <p className="text-slate-500">Manage your subscription, buy credits, and view invoices.</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-300 mb-1">Available Credits</h2>
            <div className="text-5xl font-black tracking-tight">{user?.credits}</div>
            <p className="text-sm text-slate-400 mt-2">Credits never expire. 1 credit = 1 file conversion or operation.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#credit-packs" className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-6 rounded-xl transition text-center block">
            Buy Credits
          </a>
          <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition border border-white/10">
            Redeem Coupon
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isCurrentPlan={userPlanId === plan.id} />
          ))}
        </div>
      </div>

      <div id="credit-packs" className="pt-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Buy Credits (Pay as you go)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} className={`bg-white rounded-3xl p-6 border-2 ${pack.isPopular ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-100'} relative flex flex-col`}>
              {pack.isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
              <h3 className="text-xl font-black text-slate-900 mb-2">{pack.title}</h3>
              <div className="text-4xl font-black text-slate-900 mb-6">₹{pack.priceINR}</div>
              <div className="flex-1 text-slate-600 mb-8 font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500"/> {pack.credits} Credits
              </div>
              <BillingClient pack={pack} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 mb-4">Billing History</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <tr>
                  <th className="px-6 py-4 font-bold">Transaction ID</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                      {payment.razorpayPaymentId || payment.id}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      {payment.currency === "INR" ? "₹" : "$"}{payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase tracking-wider ${
                        payment.status === "SUCCESS" ? "text-green-600" :
                        payment.status === "FAILED" ? "text-red-600" :
                        "text-amber-600"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === "SUCCESS" && (
                        <button className="text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1 font-semibold" title="Download Invoice">
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-900">No transactions yet</p>
                      <p className="text-sm mt-1">Your payment history will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
