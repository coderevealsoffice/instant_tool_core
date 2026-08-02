"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export function BlogEditor({ post, categories }: { post?: any, categories: any[] }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    image: post?.image || "",
    metaTitle: post?.metaTitle || "",
    metaDesc: post?.metaDesc || "",
    categoryId: post?.categoryId || "none",
    isPublished: post?.isPublished || false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = {
        ...formData,
        categoryId: formData.categoryId === "none" ? null : formData.categoryId
      }
      
      const url = post ? `/api/blog/${post.id}` : "/api/blog"
      const method = post ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post")
      }
      
      router.push("/admin/blog")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} 
          {post ? "Update Post" : "Publish Post"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="The definitive guide to PDF tools"
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML/Markdown support)</Label>
                <RichTextEditor
                  value={formData.content} 
                  onChange={(val: string) => setFormData({ ...formData, content: val })} 
                  placeholder="<h1>Heading</h1><p>Write your post content here...</p>"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">SEO Meta Data & Media</h3>
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input 
                  id="metaTitle" 
                  name="metaTitle" 
                  value={formData.metaTitle} 
                  onChange={handleChange} 
                  placeholder="Usually 50-60 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea 
                  id="metaDesc" 
                  name="metaDesc" 
                  value={formData.metaDesc} 
                  onChange={handleChange} 
                  placeholder="Usually 150-160 characters"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Publish Status</Label>
                <Switch 
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPublished: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                If unpublished, the post will only be visible in the CMS as a draft.
              </p>
            </CardContent>
          </Card>
          
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
                  placeholder="definitive-guide-to-pdfs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val: string) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  placeholder="A short summary for the blog feed"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
