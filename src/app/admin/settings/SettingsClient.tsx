"use client"

import { useState } from "react"
import { saveSiteSettings } from "./settings-actions"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    SEO_TITLE_FORMAT: initialSettings.SEO_TITLE_FORMAT || "%s | Instant Tool",
    SEO_META_DESC: initialSettings.SEO_META_DESC || "The ultimate collection of fast, browser-based tools for PDF, image, audio, and video.",
    SMTP_CONNECTION: initialSettings.SMTP_CONNECTION || "",
    AI_API_KEY: initialSettings.AI_API_KEY || "",
    S3_BUCKET: initialSettings.S3_BUCKET || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveSiteSettings(formData)
      toast.success("Global settings saved successfully")
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings")
    }
    setIsSaving(false)
  }

  return (
    <div className="grid gap-8">
      {/* Global SEO Settings */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Global SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Site Title Format</label>
            <Input name="SEO_TITLE_FORMAT" value={formData.SEO_TITLE_FORMAT} onChange={handleChange} placeholder="%s | Instant Tool" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Default Meta Description</label>
            <Textarea name="SEO_META_DESC" value={formData.SEO_META_DESC} onChange={handleChange} rows={3} placeholder="Meta description..." />
          </div>
        </div>
      </section>

      {/* Infrastructure Integrations */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Infrastructure & API Keys</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">SMTP Connection String</label>
            <Input type="password" name="SMTP_CONNECTION" value={formData.SMTP_CONNECTION} onChange={handleChange} placeholder="smtp://user:pass@host:port" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">AI Provider API Key (OpenAI / Claude)</label>
            <Input type="password" name="AI_API_KEY" value={formData.AI_API_KEY} onChange={handleChange} placeholder="sk-..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">S3 Storage Bucket (For large file buffers)</label>
            <Input name="S3_BUCKET" value={formData.S3_BUCKET} onChange={handleChange} placeholder="s3://instant-tool-bucket" />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2 font-bold px-8">
          <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  )
}
