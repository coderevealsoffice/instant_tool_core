"use client"

import { useState } from "react"
import { Coupon } from "@prisma/client"
import { createCoupon, updateCoupon, deleteCoupon } from "./coupon-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit2, Trash2, Plus, Tag } from "lucide-react"
import { toast } from "sonner"

export default function CouponClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    discountAmount: "",
    maxUses: "",
    expiresAt: "",
    isActive: true,
  })

  const handleOpenNew = () => {
    setFormData({ code: "", discountPercent: "", discountAmount: "", maxUses: "", expiresAt: "", isActive: true })
    setIsEditing(false)
    setIsOpen(true)
  }

  const handleOpenEdit = (c: Coupon) => {
    setFormData({
      code: c.code,
      discountPercent: c.discountPercent?.toString() || "",
      discountAmount: c.discountAmount?.toString() || "",
      maxUses: c.maxUses?.toString() || "",
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 16) : "",
      isActive: c.isActive
    })
    setCurrentId(c.id)
    setIsEditing(true)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id)
        setCoupons(coupons.filter(c => c.id !== id))
        toast.success("Coupon deleted")
      } catch (e: any) {
        toast.error(e.message || "Failed to delete coupon")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.discountPercent && !formData.discountAmount) {
      toast.error("Please provide either a percentage or flat amount discount")
      return
    }

    const payload = {
      code: formData.code,
      discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : undefined,
      discountAmount: formData.discountAmount ? parseFloat(formData.discountAmount) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      isActive: formData.isActive
    }

    try {
      if (isEditing) {
        await updateCoupon(currentId, payload)
        toast.success("Coupon updated")
      } else {
        await createCoupon(payload)
        toast.success("Coupon created")
      }
      setIsOpen(false)
      window.location.reload()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Coupons & Discounts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage promotional codes for subscriptions</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status / Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                      {coupon.discountPercent ? `${coupon.discountPercent}% OFF` : `$${coupon.discountAmount} OFF`}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {coupon.usedCount} / {coupon.maxUses ? coupon.maxUses : "∞"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium w-fit ${
                          coupon.isActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}>
                          {coupon.isActive ? "Active" : "Disabled"}
                        </span>
                        {coupon.expiresAt && (
                          <span className="text-[10px] text-slate-500">Exp: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(coupon)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="w-4 h-4" />
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
            <DialogTitle>{isEditing ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER50" className="uppercase font-mono" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input type="number" min="0" max="100" step="0.01" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value, discountAmount: ""})} placeholder="e.g. 20" />
              </div>
              <div className="space-y-2">
                <Label>Flat Amount ($)</Label>
                <Input type="number" min="0" step="0.01" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value, discountPercent: ""})} placeholder="e.g. 15.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Uses (Optional)</Label>
                <Input type="number" min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} placeholder="Leave blank for unlimited" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Input type="datetime-local" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Label className="flex flex-col space-y-1">
                <span>Active Status</span>
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">Can customers use this code right now?</span>
              </Label>
              <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create Coupon"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
