"use client"

import { useState } from "react"
import { Role } from "@prisma/client"
import { grantCreditsToUser, updateUserRole, deleteUser } from "@/actions/admin"
import { MoreVertical, ShieldAlert, Coins, Trash2, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ModalType = "credits" | "role" | "delete" | null

export function UserActions({ user }: { user: { id: string, name: string | null, email: string | null, role: Role, credits: number } }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Modal states
  const [creditAmount, setCreditAmount] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role>(user.role)

  const handleGrantCredits = async () => {
    const amount = parseInt(creditAmount)
    if (isNaN(amount) || amount <= 0) return toast.error("Invalid amount.")

    setIsProcessing(true)
    try {
      await grantCreditsToUser(user.id, amount)
      toast.success("Credits granted successfully.")
      setActiveModal(null)
      setCreditAmount("")
    } catch (err: any) {
      toast.error(err.message || "Failed to grant credits.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleChangeRole = async () => {
    setIsProcessing(true)
    try {
      await updateUserRole(user.id, selectedRole)
      toast.success("Role updated successfully.")
      setActiveModal(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update role.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    setIsProcessing(true)
    try {
      await deleteUser(user.id)
      toast.success("User deleted.")
      setActiveModal(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 z-50 rounded-xl">
          <DropdownMenuItem onClick={() => setActiveModal("credits")} className="cursor-pointer flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900">
            <Coins className="w-4 h-4 text-green-600" /> Grant Credits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal("role")} className="cursor-pointer flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Change Role
          </DropdownMenuItem>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
          <DropdownMenuItem onClick={() => setActiveModal("delete")} className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold focus:text-red-700">
            <Trash2 className="w-4 h-4" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Grant Credits Modal */}
      <Dialog open={activeModal === "credits"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Grant Credits</DialogTitle>
            <DialogDescription>
              Add credits to <strong>{user.email}</strong>'s account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="e.g. 50"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleGrantCredits} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Grant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={activeModal === "role"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for <strong>{user.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as Role)}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleChangeRole} disabled={isProcessing} className="bg-amber-600 hover:bg-amber-700 text-white">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={activeModal === "delete"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to completely delete <strong>{user.email}</strong>? This action cannot be undone. All their files and jobs will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 hover:bg-red-700 text-white">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
