"use client"

import { useState } from "react"
import { savePlan } from "@/actions/admin"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, X, Edit } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type PlanFormProps = {
  plan?: {
    id: string
    name: string
    description?: string | null
    priceMonthly: number
    priceYearly: number
    credits: number
    maxFileSizeMB: number
    features: string[]
    isActive: boolean
  }
}

export function PlanFormDialog({ plan }: PlanFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form State
  const [name, setName] = useState(plan?.name || "")
  const [description, setDescription] = useState(plan?.description || "")
  const [priceMonthly, setPriceMonthly] = useState(plan?.priceMonthly?.toString() || "0")
  const [priceYearly, setPriceYearly] = useState(plan?.priceYearly?.toString() || "0")
  const [credits, setCredits] = useState(plan?.credits?.toString() || "0")
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(plan?.maxFileSizeMB?.toString() || "25")
  const [isActive, setIsActive] = useState(plan?.isActive ?? true)
  
  // Features List State
  const [features, setFeatures] = useState<string[]>(plan?.features || [])
  const [newFeature, setNewFeature] = useState("")

  const handleAddFeature = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Plan name is required")

    setIsProcessing(true)
    try {
      await savePlan({
        id: plan?.id,
        name: name.trim(),
        description: description.trim(),
        priceMonthly: parseFloat(priceMonthly) || 0,
        priceYearly: parseFloat(priceYearly) || 0,
        credits: parseInt(credits) || 0,
        maxFileSizeMB: parseInt(maxFileSizeMB) || 25,
        features,
        isActive
      })
      
      toast.success(`Plan ${plan ? 'updated' : 'created'} successfully!`)
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to save plan")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          plan ? (
            <button className="w-full py-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-2 transition-colors" />
          ) : (
            <button className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg shadow-sm flex items-center gap-2" />
          )
        }
      >
        {plan ? (
          <>
            <Edit className="w-4 h-4" /> Edit Plan
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" /> Create Plan
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            Configure the pricing, credits, and features for this subscription tier.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input 
                placeholder="e.g. Pro Plan" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center gap-2 h-10">
                <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
                <Label htmlFor="isActive">{isActive ? "Active (Visible)" : "Inactive (Hidden)"}</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Short description of the plan" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monthly Price (₹)</Label>
              <Input 
                type="number" 
                value={priceMonthly} 
                onChange={(e) => setPriceMonthly(e.target.value)} 
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label>Yearly Price (₹)</Label>
              <Input 
                type="number" 
                value={priceYearly} 
                onChange={(e) => setPriceYearly(e.target.value)} 
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Credits per Month</Label>
              <Input 
                type="number" 
                value={credits} 
                onChange={(e) => setCredits(e.target.value)} 
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label>Max File Size (MB)</Label>
              <Input 
                type="number" 
                value={maxFileSizeMB} 
                onChange={(e) => setMaxFileSizeMB(e.target.value)} 
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <Label>Features List (Displayed with checkmarks)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Unlimited PDF conversions" 
                value={newFeature} 
                onChange={(e) => setNewFeature(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAddFeature(e)}
                className="bg-slate-50 dark:bg-slate-900"
              />
              <Button type="button" onClick={handleAddFeature} variant="secondary">Add</Button>
            </div>
            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              {features.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-2">No features added yet.</p>
              ) : (
                features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 px-3 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feat}</span>
                    <button onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleSave} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
