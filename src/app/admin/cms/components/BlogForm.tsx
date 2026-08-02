"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPostAction, updatePostAction, uploadBlogImageAction } from "../actions"
import { toast } from "sonner"
import { Loader2, Image as ImageIcon, Check } from "lucide-react"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

type BlogFormProps = {
  initialData?: any
  categories?: any[]
}

export function BlogForm({ initialData, categories = [] }: BlogFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [author, setAuthor] = useState(initialData?.author || "")
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "")
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false)
  const [imageUrl, setImageUrl] = useState(initialData?.image || "")
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "")
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc || "")

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string
        const result = await uploadBlogImageAction(base64Image)
        setImageUrl(result.url)
        toast.success("Image uploaded successfully")
      } catch (err) {
        toast.error("Failed to upload image")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const data = {
        title,
        slug,
        content,
        excerpt,
        author,
        categoryId: categoryId || undefined,
        isPublished,
        image: imageUrl || undefined,
        metaTitle: metaTitle || undefined,
        metaDesc: metaDesc || undefined,
      }

      if (isEditing) {
        await updatePostAction(initialData.id, data)
        toast.success("Blog post updated!")
      } else {
        await createPostAction(data)
        toast.success("Blog post created!")
      }
      router.push("/admin/cms")
      router.refresh()
    } catch (err) {
      toast.error(isEditing ? "Failed to update post" : "Failed to create post")
      setIsSaving(false)
    }
  }

  const autoGenerateSlug = (text: string) => {
    if (isEditing) return
    const newSlug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setSlug(newSlug)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              autoGenerateSlug(e.target.value)
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
            placeholder="E.g., Top 10 AI Tools in 2026"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
            placeholder="top-10-ai-tools-2026"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
            placeholder="E.g., John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
          >
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SEO Title (Optional)</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
            placeholder="E.g., Top 10 Best AI Tools for 2026"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SEO Description (Optional)</label>
          <input
            type="text"
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2"
            placeholder="A short description for search engines..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Excerpt (Optional)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 min-h-[80px]"
          placeholder="A short summary for the blog card..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content</label>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-64 sm:h-96"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Featured Image</label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isUploading && <p className="text-sm text-blue-600 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</p>}
            {imageUrl && !isUploading && <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Uploaded</p>}
          </div>
          {imageUrl ? (
            <div className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
              <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-24 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300"
        />
        <label htmlFor="isPublished" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          Publish Post (visible to public)
        </label>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEditing ? "Save Changes" : "Create Post"}
        </button>
      </div>
    </form>
  )
}
