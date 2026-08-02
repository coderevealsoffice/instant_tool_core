"use client"

import { useState } from "react"
import { FAQ } from "@prisma/client"
import { createFaq, updateFaq, deleteFaq } from "./faq-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit2, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function FaqClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    isActive: true,
    order: 0
  })

  const handleOpenNew = () => {
    setFormData({ question: "", answer: "", category: "", isActive: true, order: 0 })
    setIsEditing(false)
    setIsOpen(true)
  }

  const handleOpenEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      isActive: faq.isActive,
      order: faq.order
    })
    setCurrentId(faq.id)
    setIsEditing(true)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id)
        setFaqs(faqs.filter(f => f.id !== id))
        toast.success("FAQ deleted successfully")
      } catch (e: any) {
        toast.error(e.message || "Failed to delete FAQ")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateFaq(currentId, formData)
        toast.success("FAQ updated successfully")
        setFaqs(faqs.map(f => f.id === currentId ? { ...f, ...formData, id: currentId } as FAQ : f))
      } else {
        await createFaq(formData)
        toast.success("FAQ created successfully")
        // Normally we'd fetch the new FAQ or refresh the page
        window.location.reload()
      }
      setIsOpen(false)
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">All FAQs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage frequently asked questions across the platform</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No FAQs found. Add one to get started.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{faq.order}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white max-w-xs truncate">{faq.question}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{faq.category || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        faq.isActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {faq.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(faq)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(faq.id)}>
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
            <DialogTitle>{isEditing ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input required value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="e.g. How does billing work?" />
            </div>
            
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea required value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} placeholder="Detailed answer here..." className="min-h-[100px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. GENERAL" />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Label className="flex flex-col space-y-1">
                <span>Active Status</span>
                <span className="font-normal text-xs text-slate-500 dark:text-slate-400">If disabled, it won't show on the site</span>
              </Label>
              <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create FAQ"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
