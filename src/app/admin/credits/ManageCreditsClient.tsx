"use client"

import { useState } from "react"
import { searchUsersAction, addCreditsAction } from "./actions"
import { Search, Loader2, Check, User, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ManageCreditsClientProps {
  initialUsers: any[]
}

export function ManageCreditsClient({ initialUsers }: ManageCreditsClientProps) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<any[]>(initialUsers)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  
  const [amount, setAmount] = useState<number | "">("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query || query.length < 2) {
      setUsers(initialUsers)
      return
    }
    setIsSearching(true)
    try {
      const results = await searchUsersAction(query)
      setUsers(results)
      setSelectedUser(null)
    } catch (err) {
      toast.error("Failed to search users")
    } finally {
      setIsSearching(false)
    }
  }

  // Handle live reset when user clears the input
  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.trim() === "") {
      setUsers(initialUsers)
    }
  }

  const handleUpdate = async () => {
    if (!selectedUser || typeof amount !== "number") return
    setIsUpdating(true)
    try {
      const updated = await addCreditsAction(selectedUser.id, amount)
      toast.success(`Successfully adjusted credits for ${updated.name || updated.email}`)
      setSelectedUser(updated)
      setAmount("")
    } catch (err) {
      toast.error("Failed to update credits")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="button" onClick={() => handleSearch()} disabled={isSearching || (query.length > 0 && query.length < 2)}>
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {users.length > 0 && !selectedUser && (
            <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <div key={u.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center justify-between cursor-pointer transition-colors" onClick={() => setSelectedUser(u)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{u.name || "Unknown User"}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{u.credits} Credits</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Card className="border-blue-200 dark:border-blue-900/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Adjust Credits</h3>
                <p className="text-sm text-slate-500">Managing credits for {selectedUser.email}</p>
              </div>
              <div className="text-right bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Current Balance</div>
                <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{selectedUser.credits}</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount to Add (use negative to deduct)</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setAmount(prev => (typeof prev === "number" ? prev - 10 : -10))}><Minus className="w-4 h-4" /></Button>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={amount}
                  onChange={e => setAmount(e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="w-32 text-center text-lg font-bold"
                />
                <Button variant="outline" size="icon" onClick={() => setAmount(prev => (typeof prev === "number" ? prev + 10 : 10))}><Plus className="w-4 h-4" /></Button>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <Button onClick={handleUpdate} disabled={isUpdating || amount === "" || amount === 0} className="w-full sm:w-auto">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Apply Adjustment
                </Button>
                <Button variant="ghost" onClick={() => { setSelectedUser(null); setAmount(""); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
