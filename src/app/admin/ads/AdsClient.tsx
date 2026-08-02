"use client"

import { useState } from "react"
import { AdSlotSetting } from "@prisma/client"
import { upsertAdSlot, deleteAdSlot } from "./ads-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit2, Trash2, Plus, Megaphone } from "lucide-react"
import { toast } from "sonner"

export default function AdsClient({ initialSlots }: { initialSlots: AdSlotSetting[] }) {
  const [slots, setSlots] = useState<AdSlotSetting[]>(initialSlots)
  const [isOpen, setIsOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    id: "",
    slotName: "",
    isActive: true,
    client_id: "",
    slot_id: "",
    code: ""
  })

  const handleOpenNew = () => {
    setFormData({ id: "", slotName: "", isActive: true, client_id: "", slot_id: "", code: "" })
    setIsOpen(true)
  }

  const handleOpenEdit = (s: AdSlotSetting) => {
    setFormData({
      id: s.id,
      slotName: s.slotName,
      isActive: s.isActive,
      client_id: s.client_id || "",
      slot_id: s.slot_id || "",
      code: s.code || ""
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ad placement?")) {
      try {
        await deleteAdSlot(id)
        setSlots(slots.filter(s => s.id !== id))
        toast.success("Ad placement deleted")
      } catch (e: any) {
        toast.error(e.message || "Failed to delete ad placement")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.slotName) return

    try {
      await upsertAdSlot({
        slotName: formData.slotName.toUpperCase(),
        isActive: formData.isActive,
        client_id: formData.client_id,
        slot_id: formData.slot_id,
        code: formData.code
      })
      toast.success("Ad placement saved")
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
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ad Placements</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage Google AdSense or custom ad slots across the site</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Placement
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Placement (Slot Name)</th>
                <th className="px-6 py-4">AdSense Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {slots.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No ad placements configured yet.
                  </td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-slate-400" />
                      {slot.slotName}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {slot.client_id || slot.slot_id ? (
                        <div className="flex flex-col gap-1 text-xs">
                          {slot.client_id && <span>Client: {slot.client_id}</span>}
                          {slot.slot_id && <span>Slot: {slot.slot_id}</span>}
                        </div>
                      ) : slot.code ? (
                        <span className="text-xs">Custom Code Provided</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        slot.isActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {slot.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(slot)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(slot.id)}>
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
            <DialogTitle>{formData.id ? "Edit Ad Placement" : "Add New Placement"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Slot Name / Position (e.g. HEADER, SIDEBAR, IN-ARTICLE)</Label>
              <Input required value={formData.slotName} onChange={e => setFormData({...formData, slotName: e.target.value.toUpperCase()})} placeholder="e.g. SIDEBAR_BOTTOM" className="uppercase font-mono" disabled={!!formData.id} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AdSense Client ID (Optional)</Label>
                <Input value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} placeholder="ca-pub-xxx" />
              </div>
              <div className="space-y-2">
                <Label>AdSense Slot ID (Optional)</Label>
                <Input value={formData.slot_id} onChange={e => setFormData({...formData, slot_id: e.target.value})} placeholder="1234567890" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Ad Code (HTML/JS) (Optional)</Label>
              <Textarea value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="<script>...</script>" className="font-mono text-xs h-24" />
              <p className="text-[10px] text-slate-500">If you provide custom code, it overrides the Client/Slot ID rendering.</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Label className="flex flex-col space-y-1">
                <span>Active Status</span>
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">Should this ad show on the site?</span>
              </Label>
              <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Placement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
