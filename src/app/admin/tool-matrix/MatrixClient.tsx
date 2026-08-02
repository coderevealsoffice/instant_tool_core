"use client"

import { useState } from "react"
import { ToolDefinition } from "@prisma/client"
import { updateToolMatrix } from "./matrix-actions"
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
import { Edit2, Zap } from "lucide-react"
import { toast } from "sonner"

export default function MatrixClient({ tools }: { tools: ToolDefinition[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    creditCost: 1,
    isActive: true,
    isBatch: false
  })

  const handleOpenEdit = (t: ToolDefinition) => {
    setFormData({
      name: t.name,
      slug: t.slug,
      creditCost: t.creditCost,
      isActive: t.isActive,
      isBatch: t.isBatch
    })
    setCurrentId(t.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateToolMatrix(currentId, {
        creditCost: formData.creditCost,
        isActive: formData.isActive,
        isBatch: formData.isBatch
      })
      toast.success("Tool configuration updated")
      setIsOpen(false)
      window.location.reload()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" /> Tool Configuration Rules
        </h2>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-lg">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Tool Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold text-center">Batch Processing</th>
                <th className="px-6 py-4 font-bold">Credit Cost</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{tool.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{tool.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tool.isBatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Yes</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-base">{tool.creditCost}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">credits</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      tool.isActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    }`}>
                      {tool.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(tool)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No tools defined in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Tool Configuration</DialogTitle>
          </DialogHeader>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm border border-slate-200 dark:border-slate-800 mb-2">
            <p className="font-medium text-slate-900 dark:text-white">{formData.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-mono">{formData.slug}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Credit Cost (per usage)</Label>
              <Input type="number" min="0" required value={formData.creditCost} onChange={e => setFormData({...formData, creditCost: parseInt(e.target.value) || 0})} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label className="flex flex-col space-y-1">
                <span>Batch Processing</span>
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">Can users submit multiple files?</span>
              </Label>
              <Switch checked={formData.isBatch} onCheckedChange={c => setFormData({...formData, isBatch: c})} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label className="flex flex-col space-y-1">
                <span>Active Status</span>
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">If disabled, users cannot run this tool</span>
              </Label>
              <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
