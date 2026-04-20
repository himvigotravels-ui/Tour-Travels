"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";

interface BlogData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const emptyBlog: BlogData = {
  slug: "", title: "", excerpt: "", content: "", author: "", coverImage: "",
  category: "Travel Guide", tags: [], isPublished: false, publishedAt: null,
  metaTitle: "", metaDescription: "", metaKeywords: "",
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogData>(emptyBlog);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { fetchBlogs(); }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      setBlogs(await res.json());
    } catch { toast.error("Failed to load blogs"); }
    finally { setLoading(false); }
  }

  function openCreate() { setForm(emptyBlog); setDialogOpen(true); }
  function openEdit(blog: BlogData) {
    setForm({ ...blog, metaTitle: blog.metaTitle || "", metaDescription: blog.metaDescription || "", metaKeywords: blog.metaKeywords || "" });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...form, slug };
      if (form.isPublished && !form.publishedAt) payload.publishedAt = new Date().toISOString();
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/admin/blogs/${form.id}` : "/api/admin/blogs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { toast.success(isEdit ? "Blog updated!" : "Blog created!"); setDialogOpen(false); fetchBlogs(); }
      else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" });
      toast.success("Blog deleted!"); fetchBlogs();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleteId(null); }
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground mt-1">Manage your travel blog posts</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Blog</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : blogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No blogs yet.</TableCell></TableRow>
              ) : blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {blog.coverImage && <img src={blog.coverImage} alt="" className="w-14 h-9 rounded-md object-cover" />}
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-muted-foreground">{blog.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{blog.author}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{blog.category}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={blog.isPublished ? "default" : "secondary"} className="text-xs">
                      {blog.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(blog)}><RiEditLine className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(blog.id!)}><RiDeleteBinLine className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{form.id ? "Edit Blog" : "Create Blog"}</DialogTitle>
            <DialogDescription>Write and publish travel content.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] px-6">
            <div className="space-y-5 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" /></div>
                <div className="space-y-2"><Label>Author *</Label><Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Cover Image</Label><ImageUpload value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} folder="blogs" /></div>
              <div className="space-y-2"><Label>Excerpt *</Label><Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} /></div>
              <div className="space-y-2"><Label>Content * (Markdown supported)</Label><Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={12} className="font-mono text-sm" /></div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                  <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.isPublished} onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))} />
                <Label>Published</Label>
              </div>

              <Separator />
              <div className="space-y-4">
                <Label className="text-base font-semibold">SEO</Label>
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Title</Label><Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} /></div>
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Description</Label><Textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} /></div>
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Keywords</Label><Input value={form.metaKeywords} onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))} /></div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Blog"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Blog?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
