import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Save, CreditCard } from "lucide-react"

export const metadata = {
 title: "Payment Settings - Super Admin",
}

export default async function PaymentSettingsPage() {
 const session = await auth()
 if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
 redirect("/")
 }

 return (
 <div className="p-8 w-full space-y-8 w-full">
 <div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Payment Settings</h1>
 <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Configure Razorpay or Stripe integration keys and webhooks.</p>
 </div>

 <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
 <CreditCard className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Razorpay Configuration</h2>
 <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Enable payments in India via Razorpay.</p>
 </div>
 </div>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Razorpay Key ID</label>
 <input type="text" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" placeholder="rzp_test_XXXXXXXXXXXXXXXX" />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Razorpay Key Secret</label>
 <input type="password" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" placeholder="••••••••••••••••••••" />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Webhook Secret</label>
 <input type="password" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" placeholder="••••••••••••••••••••" />
 </div>
 
 <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
 <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow flex items-center gap-2">
 <Save className="w-5 h-5" /> Save Payments Config
 </button>
 </div>
 </div>
 </div>
 </div>
 )
}
