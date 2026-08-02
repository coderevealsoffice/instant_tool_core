import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { QrCode, Plus, Edit, Download, Trash, BarChart, ExternalLink, Link2, Wifi, FileText } from "lucide-react"

export const metadata = {
  title: "QR Manager - InstantTool",
}

function getQrIcon(type: string) {
  if (type === "URL") return <Link2 className="w-5 h-5 text-blue-500" />
  if (type === "WIFI") return <Wifi className="w-5 h-5 text-green-500" />
  if (type === "VCARD") return <FileText className="w-5 h-5 text-amber-500" />
  return <QrCode className="w-5 h-5 text-slate-500" />
}

export default async function QrManagerPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const qrCodes = await prisma.qRCode.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">QR Code Manager</h1>
          <p className="text-slate-500">Create, manage, and track analytics for your dynamic QR codes.</p>
        </div>
        
        <button className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg shadow-sm flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Create QR Code
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
              <tr>
                <th className="px-6 py-4 font-bold">QR Name</th>
                <th className="px-6 py-4 font-bold">Content Type</th>
                <th className="px-6 py-4 font-bold">Dynamic</th>
                <th className="px-6 py-4 font-bold text-center">Scans</th>
                <th className="px-6 py-4 font-bold">Created Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {qrCodes.map((qr) => (
                <tr key={qr.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-slate-700" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{qr.name}</div>
                        <a href={qr.shortUrl || "#"} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                          {qr.shortUrl || "Static QR"} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      {getQrIcon(qr.type)}
                      {qr.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${qr.isDynamic ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                      {qr.isDynamic ? "Dynamic" : "Static"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-slate-900 text-lg">
                    {qr.visits}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {qr.isDynamic && (
                        <button className="p-2 text-slate-400 hover:text-purple-600 transition" title="Analytics">
                          <BarChart className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition" title="Download SVG/PNG">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {qrCodes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 mb-4">
                      <QrCode className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No QR Codes Found</h3>
                    <p className="text-slate-500">Create your first QR code to track scans and manage links.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
