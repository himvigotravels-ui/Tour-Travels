"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArticleLine,
  RiImageLine,
  RiSearchLine,
  RiSettings4Line,
  RiPriceTag3Line,
} from "react-icons/ri";

import { PageHeader } from "@/components/admin/shared/PageHeader";
import {
  EntityTable,
  EntityColumn,
} from "@/components/admin/shared/EntityTable";
import {
  EntitySheet,
  EntitySheetSection,
} from "@/components/admin/shared/EntitySheet";
import { ConfirmDelete } from "@/components/admin/shared/ConfirmDelete";
import { Field, FieldGrid } from "@/components/admin/shared/Field";
import { ToggleRow } from "@/components/admin/shared/ToggleRow";
import { TagInput } from "@/components/admin/shared/TagInput";
import { MetaFields } from "@/components/admin/shared/MetaFields";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";

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
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "",
  coverImage: "",
  category: "Travel Guide",
  tags: [],
  isPublished: false,
  publishedAt: null,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogData>(emptyBlog);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      setBlogs(await res.json());
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyBlog);
    setSheetOpen(true);
  }
  function openEdit(blog: BlogData) {
    setForm({
      ...blog,
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      metaKeywords: blog.metaKeywords || "",
    });
    setSheetOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const slug =
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload = { ...form, slug };
      if (form.isPublished && !form.publishedAt) {
        payload.publishedAt = new Date().toISOString();
      }
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const res = await fetch(
        isEdit ? `/api/admin/blogs/${form.id}` : "/api/admin/blogs",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success(isEdit ? "Blog updated" : "Blog created");
        setSheetOpen(false);
        fetchBlogs();
      } else toast.error("Failed to save");
    } catch {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" });
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }

  const columns: EntityColumn<BlogData>[] = [
    {
      key: "post",
      header: "Post",
      cell: (b) => (
        <div className="flex items-center gap-3">
          {b.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={b.coverImage}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium line-clamp-1">{b.title}</p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              /{b.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (b) => <span className="text-sm">{b.author}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (b) => (
        <Badge variant="outline" className="text-xs">
          {b.category}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <Badge variant={b.isPublished ? "default" : "secondary"}>
          {b.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(b.id!)}
          >
            <RiDeleteBinLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const sections: EntitySheetSection[] = [
    {
      id: "content",
      label: "Content",
      icon: RiArticleLine,
      description: "Title, author, excerpt and the article body.",
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Title" required>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </Field>
            <Field label="Slug" hint="Auto-generated from title.">
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
              />
            </Field>
            <Field label="Author" required>
              <Input
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
              />
            </Field>
            <Field label="Category">
              <Input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              />
            </Field>
          </FieldGrid>

          <Field
            label="Excerpt"
            required
            hint="Short summary shown in blog listings and previews."
          >
            <Textarea
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              rows={2}
            />
          </Field>

          <Field
            label="Content"
            required
            hint="Format with the toolbar — bold, headings, lists, quotes, links and inline images. Output is HTML rendered with Tailwind typography on the public site."
            rightSlot={
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(form.content || "").replace(/<[^>]*>/g, "").length.toLocaleString()} chars
              </span>
            }
          >
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              imageFolder="blogs"
              placeholder="Write your story... use the toolbar to format."
            />
          </Field>

          <Field label="Tags">
            <TagInput
              value={form.tags}
              onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
              placeholder="Type a tag and press Enter"
            />
          </Field>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      description: "Cover image used as the post hero.",
      content: (
        <Field label="Cover Image">
          <ImageUpload
            value={form.coverImage}
            onChange={(url) =>
              setForm((f) => ({ ...f, coverImage: url }))
            }
            folder="blogs"
          />
        </Field>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      icon: RiSearchLine,
      content: (
        <MetaFields
          value={{
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            metaKeywords: form.metaKeywords,
          }}
          onChange={(m) =>
            setForm((f) => ({
              ...f,
              metaTitle: m.metaTitle ?? "",
              metaDescription: m.metaDescription ?? "",
              metaKeywords: m.metaKeywords ?? "",
            }))
          }
          fallbackTitle={form.title}
          fallbackDescription={form.excerpt}
        />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      content: (
        <div className="space-y-3">
          <ToggleRow
            label="Published"
            description="Once on, the post is publicly visible. Publish date is auto-set."
            checked={form.isPublished}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, isPublished: v }))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Write and publish travel articles."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Blog
          </Button>
        }
      />

      <EntityTable
        data={blogs}
        columns={columns}
        loading={loading}
        rowKey={(b) => b.id ?? b.slug}
        emptyTitle="No blog posts yet"
        emptyDescription="Write your first article to see it listed here."
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Blog" : "Create Blog"}
        description="Write the article and configure its SEO."
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create blog"}
        onSave={handleSave}
        footerLeft={
          form.title ? (
            <span className="inline-flex items-center gap-1.5">
              <RiPriceTag3Line className="h-3 w-3" />
              {form.title}
            </span>
          ) : null
        }
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this blog post?"
        description="The post will be permanently removed."
        onConfirm={handleDelete}
      />
    </div>
  );
}
