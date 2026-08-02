import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { Users, CreditCard, Activity, CheckCircle2 } from "lucide-react"
import { AnalyticsCharts } from "./components/AnalyticsCharts"
import { subDays, format } from "date-fns"

export const metadata = {
  title: "Admin Reports & Analytics | Instant Tool",
}

export default async function Page() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect("/")
  }

  // 1. Fetch Totals
  const totalUsers = await prisma.user.count()
  const totalJobs = await prisma.toolJob.count()
  
  const successfulPayments = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true }
  })
  const totalRevenue = successfulPayments._sum.amount || 0

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" }
  })

  // 2. Fetch Time-Series Data (Last 30 Days)
  const thirtyDaysAgo = subDays(new Date(), 30)

  // Users Data
  const recentUsers = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true }
  })
  
  // Revenue Data
  const recentPayments = await prisma.payment.findMany({
    where: { 
      createdAt: { gte: thirtyDaysAgo },
      status: "SUCCESS"
    },
    select: { createdAt: true, amount: true }
  })

  // Group Users by Date
  const userGrowthMap = new Map<string, number>()
  const revenueMap = new Map<string, number>()
  
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(new Date(), i), 'MMM dd')
    userGrowthMap.set(d, 0)
    revenueMap.set(d, 0)
  }

  recentUsers.forEach(u => {
    const d = format(u.createdAt, 'MMM dd')
    if (userGrowthMap.has(d)) {
      userGrowthMap.set(d, userGrowthMap.get(d)! + 1)
    }
  })

  recentPayments.forEach(p => {
    const d = format(p.createdAt, 'MMM dd')
    if (revenueMap.has(d)) {
      revenueMap.set(d, revenueMap.get(d)! + p.amount)
    }
  })

  const userGrowthData = Array.from(userGrowthMap.entries()).map(([date, users]) => ({ date, users }))
  const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({ date, amount }))

  // 3. Fetch Tool Category Usage
  const toolJobs = await prisma.toolJob.groupBy({
    by: ['toolId'],
    _count: { toolId: true }
  })

  const tools = await prisma.toolDefinition.findMany({
    select: { id: true, category: true }
  })

  const categoryCountMap = new Map<string, number>()
  
  toolJobs.forEach(job => {
    const tool = tools.find(t => t.id === job.toolId)
    const cat = tool?.category || 'Unknown'
    categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + job._count.toolId)
  })

  const toolUsageData = Array.from(categoryCountMap.entries()).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value)

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Reports & Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400">Key metrics, revenue growth, and usage analytics.</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Subs</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{activeSubscriptions.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Jobs Processed</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalJobs.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts 
        revenueData={revenueData} 
        userGrowthData={userGrowthData} 
        toolUsageData={toolUsageData} 
      />
    </div>
  )
}
