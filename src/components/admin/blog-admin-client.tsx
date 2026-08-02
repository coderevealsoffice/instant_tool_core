"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, FileText, Globe } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"

export function BlogAdminClient({ posts, categories }: { posts: any[], categories: any[] }) {
  const [data, setData] = useState(posts)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete post")
      
      setData(data.filter(p => p.id !== id))
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete the post")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Blog Posts</CardTitle>
        <div className="flex gap-4">
          <Link href="/blog" target="_blank">
            <Button variant="outline"><Globe className="w-4 h-4 mr-2" /> View Live Blog</Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button><Plus className="w-4 h-4 mr-2" /> Create Post</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No blog posts found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {post.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.category ? <Badge variant="secondary">{post.category.name}</Badge> : <span className="text-muted-foreground">None</span>}
                  </TableCell>
                  <TableCell>
                    {post.isPublished ? (
                      <Badge className="bg-emerald-500">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
