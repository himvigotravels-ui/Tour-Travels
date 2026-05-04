"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArticleLine,
  RiImageLine,
  RiStarLine,
  RiSearchLine,
  RiSettings4Line,
  RiMapPinLine,
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
import { ListEditor } from "@/components/admin/shared/ListEditor";
import { MetaFields } from "@/components/admin/shared/MetaFields";
import { BadgeMultiSelect } from "@/components/admin/shared/BadgeMultiSelect";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";

interface DestData {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestTime: string;
  altitude: string;
  vibe: string;
  image: string;
  highlights: string[];
  categories: string[];
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const emptyDest: DestData = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  bestTime: "",
  altitude: "",
  vibe: "",
  image: "",
  highlights: [],
  categories: [],
  isActive: true,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

interface NavGroup {
  title: string;
  slug: string;
  type: string;
}

export default function DestinationsPage() {
  const [items, setItems] = useState<DestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<DestData>(emptyDest);
  const [saving, setSaving] = useState(false);
  const [destGroups, setDestGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    fetchItems();
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const res = await fetch("/api/admin/internal-pages");
      const data = await res.json();
      setDestGroups(
        data.filter((p: NavGroup) => p.type === "destination")
      );
    } catch {}
  }

  async function fetchItems() {
    setLoading(true);
    try {
      setItems(await (await fetch("/api/admin/destinations")).json());
    } catch {
      toast.error("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyDest);
    setSheetOpen(true);
  }

  function openEdit(item: DestData) {
    setForm({
      ...item,
      highlights: item.highlights || [],
      categories: item.categories || [],
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      metaKeywords: item.metaKeywords || "",
    });
    setSheetOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const slug =
        form.slug ||
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload = {
        ...form,
        slug,
        highlights: form.highlights.filter(Boolean),
      };
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const res = await fetch(
        isEdit
          ? `/api/admin/destinations/${form.id}`
          : "/api/admin/destinations",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success(isEdit ? "Updated" : "Created");
        setSheetOpen(false);
        fetchItems();
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
      await fetch(`/api/admin/destinations/${deleteId}`, {
        method: "DELETE",
      });
      toast.success("Deleted");
      fetchItems();
    } catch {
      toast.error("Failed");
    } finally {
      setDeleteId(null);
    }
  }

  const groupOptions = useMemo(
    () => destGroups.map((g) => ({ value: g.slug, label: g.title })),
    [destGroups]
  );

  const columns: EntityColumn<DestData>[] = [
    {
      key: "destination",
      header: "Destination",
      cell: (d) => (
        <div className="flex items-center gap-3">
          {d.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.image}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{d.name}</p>
            <p className="text-xs font-mono text-muted-foreground truncate">
              /{d.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "tagline",
      header: "Tagline",
      cell: (d) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {d.tagline}
        </span>
      ),
    },
    {
      key: "best",
      header: "Best Time",
      cell: (d) => <span className="text-sm">{d.bestTime}</span>,
    },
    {
      key: "order",
      header: "Order",
      cell: (d) => <span className="text-sm">{d.sortOrder}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => <StatusBadge active={d.isActive} />,
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (d) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(d.id!)}
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
      description: "Name, tagline and the descriptive copy.",
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Name" required>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Spiti Valley"
              />
            </Field>
            <Field label="Slug" hint="Auto-generated from name.">
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="spiti-valley"
              />
            </Field>
            <Field label="Tagline" required>
              <Input
                value={form.tagline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tagline: e.target.value }))
                }
                placeholder="The Middle Land"
              />
            </Field>
            <Field label="Vibe">
              <Input
                value={form.vibe}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vibe: e.target.value }))
                }
                placeholder="Adventure & Spiritual"
              />
            </Field>
            <Field label="Best Time">
              <Input
                value={form.bestTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bestTime: e.target.value }))
                }
                placeholder="June to October"
              />
            </Field>
            <Field label="Altitude">
              <Input
                value={form.altitude}
                onChange={(e) =>
                  setForm((f) => ({ ...f, altitude: e.target.value }))
                }
                placeholder="12,500 ft"
              />
            </Field>
            <Field label="Sort Order" hint="Lower numbers appear first.">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sortOrder: Number(e.target.value),
                  }))
                }
              />
            </Field>
          </FieldGrid>

          <Field 
            label="Description" 
            required
            rightSlot={
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(form.description || "").replace(/<[^>]*>/g, "").length.toLocaleString()} chars
              </span>
            }
          >
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm((f) => ({ ...f, description: html }))}
              imageFolder="destinations"
              placeholder="Detailed description... use the toolbar to format."
            />
          </Field>

          <Field
            label="Nav Groups"
            hint="Tag this destination so it shows up in matching navbar groups."
          >
            <BadgeMultiSelect
              options={groupOptions}
              value={form.categories}
              onChange={(v) => setForm((f) => ({ ...f, categories: v }))}
              emptyHint="No destination nav groups yet."
            />
          </Field>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      description: "Hero image used on the destination page.",
      content: (
        <Field label="Cover Image" required>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            folder="destinations"
          />
        </Field>
      ),
    },
    {
      id: "highlights",
      label: "Highlights",
      icon: RiStarLine,
      description: "Bullet points showcased on the page.",
      badge:
        form.highlights.length > 0 ? (
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            {form.highlights.length}
          </Badge>
        ) : undefined,
      content: (
        <Field label="Highlights" hint="Short bullet points to call out.">
          <ListEditor
            value={form.highlights}
            onChange={(v) => setForm((f) => ({ ...f, highlights: v }))}
            placeholder="e.g. Key Monastery"
            addLabel="Add highlight"
          />
        </Field>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      icon: RiSearchLine,
      description: "Meta tags and search preview.",
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
          fallbackTitle={form.name}
          fallbackDescription={form.description || form.tagline}
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
            label="Active"
            description="Hide from the public site without deleting."
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Destinations"
        description="Manage destinations, hero copy and SEO."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Destination
          </Button>
        }
      />

      <EntityTable
        data={items}
        columns={columns}
        loading={loading}
        rowKey={(d) => d.id ?? d.slug}
        emptyTitle="No destinations yet"
        emptyDescription="Add your first destination to see it here."
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Destination" : "Create Destination"}
        description="Set up the destination content, image, highlights and SEO."
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create destination"}
        onSave={handleSave}
        footerLeft={
          form.name ? (
            <span className="inline-flex items-center gap-1.5">
              <RiMapPinLine className="h-3 w-3" />
              {form.name}
            </span>
          ) : null
        }
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this destination?"
        description="The destination will be permanently removed."
        onConfirm={handleDelete}
      />
    </div>
  );
}
