import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, XCircle, Clock, FileText, Download } from "lucide-react"

export const metadata = {
  title: "Transaction History - InstantTool",
}

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch transactions, payments, and files in parallel
  const [creditTransactions, payments, fileAssets] = await Promise.all([
    prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.fileAsset.findMany({
      where: { userId: session.user.id, isOutput: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">History</h1>
        <p className="text-slate-500">Track your credit usage and past purchases.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Credit Usage History */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Credit Usage</h2>
          
          {creditTransactions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-medium">No credit history yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {creditTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.description || tx.type}</p>
                      <p className="text-xs font-medium text-slate-500">{format(tx.createdAt, "MMM d, yyyy • h:mm a")}</p>
                    </div>
                  </div>
                  <div className={`font-black text-lg ${tx.amount > 0 ? "text-green-600" : "text-slate-900"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Payment History</h2>
          
          {payments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-medium">No past payments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{payment.description}</p>
                      <p className="text-xs font-medium text-slate-500">{format(payment.createdAt, "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-slate-900">₹{payment.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    {payment.status === "SUCCESS" && <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Successful</span>}
                    {payment.status === "FAILED" && <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Failed</span>}
                    {payment.status === "PENDING" && <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                    
                    <span className="text-xs font-medium text-slate-400 ml-auto font-mono">
                      {payment.razorpayPaymentId || payment.razorpayOrderId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Downloads History */}
      <div className="space-y-6 mt-12">
        <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Files & Downloads</h2>
        
        {fileAssets.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-medium">No downloaded files yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {fileAssets.map((file) => (
              <div key={file.id} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 truncate max-w-full sm:max-w-md">{file.fileName}</p>
                    <p className="text-xs font-medium text-slate-500">{format(file.createdAt, "MMM d, yyyy • h:mm a")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
