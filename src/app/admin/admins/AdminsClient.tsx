"use client"

import { useState } from "react"
import { User, Role } from "@prisma/client"
import { changeUserRole, searchUserByEmail } from "./admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Shield, Search, ArrowRight, UserMinus } from "lucide-react"
import { toast } from "sonner"

export default function AdminsClient({ initialStaff }: { initialStaff: User[] }) {
  const [staff, setStaff] = useState<User[]>(initialStaff)
  const [isOpen, setIsOpen] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchEmail) return
    setIsSearching(true)
    try {
      const user = await searchUserByEmail(searchEmail)
      if (user) {
        setFoundUser(user)
      } else {
        toast.error("User not found with this email")
        setFoundUser(null)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to search user")
    }
    setIsSearching(false)
  }

  const handlePromote = async () => {
    if (!foundUser) return
    try {
      await changeUserRole(foundUser.id, selectedRole)
      toast.success(`User promoted to ${selectedRole}`)
      setIsOpen(false)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || "Failed to change role")
    }
  }

  const handleDemote = async (userId: string, currentRole: string) => {
    if (confirm(`Are you sure you want to demote this ${currentRole} to a regular USER?`)) {
      try {
        await changeUserRole(userId, "USER")
        toast.success("User role updated successfully")
        setStaff(staff.filter(u => u.id !== userId))
      } catch (err: any) {
        toast.error(err.message || "Failed to update role")
      }
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Admin Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage platform administrators and employees</p>
        </div>
        <Button onClick={() => { setIsOpen(true); setFoundUser(null); setSearchEmail(""); }} className="gap-2">
          <Shield className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No admins or employees found.
                  </td>
                </tr>
              ) : (
                staff.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.name || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.role === "SUPER_ADMIN" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                        user.role === "ADMIN" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDemote(user.id, user.role)}>
                        <UserMinus className="w-4 h-4 mr-1" /> Revoke
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Promote User to Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <form onSubmit={handleSearch} className="space-y-2">
              <Label>Search User by Email</Label>
              <div className="flex gap-2">
                <Input required type="email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} placeholder="user@example.com" />
                <Button type="submit" disabled={isSearching} variant="secondary">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {foundUser && (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{foundUser.name || "No Name"}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{foundUser.email}</div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Current: {foundUser.role}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Label>Select New Role</Label>
                  <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as Role)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee (Limited Access)</SelectItem>
                      <SelectItem value="ADMIN">Admin (Standard Access)</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin (Full Access)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handlePromote} className="w-full gap-2">
                  Apply Role <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
