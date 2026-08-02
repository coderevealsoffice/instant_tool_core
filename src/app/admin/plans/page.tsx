import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { Check, Layers } from "lucide-react"
import { PlanFormDialog } from "./components/PlanFormDialog"

export const metadata = {
 title: "Subscription Plans - Admin",
}

export default async function PlansPage() {
 const session = await auth()
 const role = (session?.user as any)?.role
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
 redirect("/")
 }

 const plans = await prisma.plan.findMany({
 orderBy: { priceMonthly: "asc" }
 })

 return (
 <div className="p-8 max-w-6xl mx-auto w-full space-y-8 w-full">
 <div className="flex flex-col md:flex-row justify-between gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Subscription Plans</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage pricing tiers, credit allocations, and plan features.</p>
 </div>
 <PlanFormDialog />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {plans.map((plan) => (
 <div key={plan.id} className={`bg-white dark:bg-slate-950 rounded-3xl border ${plan.isActive ? 'border-slate-200 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800 opacity-60'} p-6 flex flex-col relative`}>
 {!plan.isActive && <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs font-bold px-2 py-1 rounded">Inactive</div>}
 
 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200">
 <Layers className="w-6 h-6" />
 </div>
 
 <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{plan.name}</h2>
 <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 min-h-[40px]">{plan.description}</p>
 
 <div className="flex items-baseline gap-1 mb-6">
 <span className="text-3xl font-black text-slate-900 dark:text-white">₹{plan.priceMonthly}</span>
 <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold">/mo</span>
 </div>
 
 <div className="space-y-3 flex-1 mb-8">
 <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
 <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> {plan.credits} Credits / month
 </div>
 <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-semibold">
 <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> {plan.maxFileSizeMB}MB Max File Size
 </div>
 {plan.features.map((feature, idx) => (
 <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
 <Check className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" /> {feature}
 </div>
 ))}
 </div>
 
 <PlanFormDialog plan={plan} />
 </div>
 ))}

 {plans.length === 0 && (
 <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Subscription Plans</h3>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Create your first subscription plan to start generating revenue.</p>
 </div>
 )}
 </div>
 </div>
 )
}
