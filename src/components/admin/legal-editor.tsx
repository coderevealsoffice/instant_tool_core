"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Save, ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export function LegalEditor({ page }: { page?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const url = page ? `/api/legal/${page.id}` : "/api/legal"
      const method = page ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to save page")
      }
      
      toast.success(page ? "Page updated successfully" : "Page created successfully")
      router.push("/admin/legal")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!page) return
    if (!confirm("Are you sure you want to delete this page?")) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/legal/${page.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete page")
      toast.success("Page deleted successfully")
      router.push("/admin/legal")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/legal")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          {page && (
            <Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} 
              Delete
            </Button>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} 
            {page ? "Update Page" : "Create Page"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Privacy Policy"
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={formData.content} 
                  onChange={(val: string) => setFormData({ ...formData, content: val })} 
                  placeholder="<p>Write your legal content here...</p>"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input 
                  id="slug" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  required 
                  placeholder="privacy-policy"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The page will be available at <strong>/legal/your-slug</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
