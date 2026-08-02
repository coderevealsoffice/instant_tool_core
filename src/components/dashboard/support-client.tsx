"use client"

import { useState } from "react"
import { Send, Clock, CheckCircle2, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SupportClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return

    setLoading(true)
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message })
      })

      if (res.ok) {
        const newTicket = await res.json()
        setTickets([newTicket, ...tickets])
        setSubject("")
        setMessage("")
        toast.success("Ticket created successfully!")
        router.refresh()
      } else {
        toast.error("Failed to create ticket")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Create Ticket Form */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" /> New Ticket
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
            <input 
              type="text" 
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              placeholder="E.g. Billing Issue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white resize-none"
              placeholder="Describe your issue..."
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Ticket</>}
          </button>
        </form>
      </div>

      {/* Ticket List */}
      <div className="lg:col-span-2 space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center text-slate-500 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700">No open tickets</h3>
            <p className="text-sm mt-1">You haven't submitted any support requests yet.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                    ticket.status === "OPEN" ? "bg-amber-100 text-amber-700" :
                    ticket.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                <p className="text-slate-600 mt-2 text-sm whitespace-pre-wrap">{ticket.message}</p>
              </div>
              
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 shrink-0">
                <Clock className="w-3.5 h-3.5" /> 
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
