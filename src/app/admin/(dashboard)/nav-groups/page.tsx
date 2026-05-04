"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiStarFill,
  RiSearchLine,
  RiSettings4Line,
  RiArticleLine,
  RiImageLine,
  RiSuitcaseLine,
  RiMapPinLine,
} from "react-icons/ri";
import {
  MultiSelect,
  MultiSelectOption,
} from "@/components/admin/shared/MultiSelect";
import { MetaFields } from "@/components/admin/shared/MetaFields";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { EntityTable, EntityColumn } from "@/components/admin/shared/EntityTable";
import {
  EntitySheet,
  EntitySheetSection,
} from "@/components/admin/shared/EntitySheet";
import { ConfirmDelete } from "@/components/admin/shared/ConfirmDelete";
import { Field, FieldGrid } from "@/components/admin/shared/Field";
import { ToggleRow } from "@/components/admin/shared/ToggleRow";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PackageOption {
  id: string;
  title: string;
  location: string;
  imageUrls: string[];
}

interface DestinationOption {
  id: string;
  name: string;
  tagline: string;
  image: string;
}

interface NavGroupForm {
  id?: string;
  title: string;
  slug: string;
  description: string;
  tagline: string;
  content: string;
  coverImage: string;
  type: "package" | "destination";
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  packageIds: string[];
  destinationIds: string[];
}

interface NavGroupRow extends NavGroupForm {
  id: string;
  packages?: { id: string }[];
  destinations?: { id: string }[];
}

const emptyForm: NavGroupForm = {
  title: "",
  slug: "",
  description: "",
  tagline: "",
  content: "",
  coverImage: "",
  type: "package",
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: "",
  packageIds: [],
  destinationIds: [],
};

export default function NavGroupsPage() {
  const [pages, setPages] = useState<NavGroupRow[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<NavGroupForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [pagesRes, pkgsRes, destsRes] = await Promise.all([
        fetch("/api/admin/internal-pages"),
        fetch("/api/admin/packages"),
        fetch("/api/admin/destinations"),
      ]);
      const [pagesData, pkgsData, destsData] = await Promise.all([
        pagesRes.json(),
        pkgsRes.json(),
        destsRes.json(),
      ]);
      setPages(pagesData);
      setPackages(pkgsData);
      setDestinations(destsData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setSheetOpen(true);
  }

  function openEdit(page: NavGroupRow) {
    setForm({
      id: page.id,
      title: page.title || "",
      slug: page.slug || "",
      description: page.description || "",
      tagline: page.tagline || "",
      content: page.content || "",
      coverImage: page.coverImage || "",
      type: page.type as "package" | "destination",
      isActive: page.isActive,
      isFeatured: page.isFeatured ?? false,
      sortOrder: page.sortOrder,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      metaKeywords: page.metaKeywords || "",
      ogImage: page.ogImage || "",
      packageIds: (page.packages ?? []).map((p) => p.id),
      destinationIds: (page.destinations ?? []).map((d) => d.id),
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

      const isEdit = !!form.id;
      const url = isEdit
        ? `/api/admin/internal-pages/${form.id}`
        : "/api/admin/internal-pages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Group updated" : "Group created");
        setSheetOpen(false);
        fetchAll();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to save group");
      }
    } catch {
      toast.error("Error saving group");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/internal-pages/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Group deleted");
        fetchAll();
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }

  const packageOptions = useMemo<MultiSelectOption[]>(
    () =>
      packages.map((p) => ({
        value: p.id,
        label: p.title,
        description: p.location,
        imageUrl: p.imageUrls?.[0],
      })),
    [packages]
  );

  const destinationOptions = useMemo<MultiSelectOption[]>(
    () =>
      destinations.map((d) => ({
        value: d.id,
        label: d.name,
        description: d.tagline,
        imageUrl: d.image,
      })),
    [destinations]
  );

  const selectedCount =
    form.type === "package"
      ? form.packageIds.length
      : form.destinationIds.length;

  const columns: EntityColumn<NavGroupRow>[] = [
    {
      key: "title",
      header: "Title",
      cell: (page) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{page.title}</span>
          {page.isFeatured && (
            <RiStarFill className="h-3.5 w-3.5 text-amber-500" />
          )}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cell: (p) => (
        <span className="font-mono text-xs text-muted-foreground">
          /{p.type === "package" ? "packages" : "destinations"}/{p.slug}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (p) => (
        <Badge variant="outline" className="gap-1 capitalize">
          {p.type === "package" ? (
            <RiSuitcaseLine className="h-3 w-3" />
          ) : (
            <RiMapPinLine className="h-3 w-3" />
          )}
          {p.type}
        </Badge>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (p) => {
        const itemCount =
          p.type === "package"
            ? p.packages?.length ?? 0
            : p.destinations?.length ?? 0;
        return (
          <span className="text-sm text-muted-foreground">
            {itemCount}{" "}
            {p.type === "package"
              ? itemCount === 1
                ? "package"
                : "packages"
              : itemCount === 1
              ? "destination"
              : "destinations"}
          </span>
        );
      },
    },
    {
      key: "order",
      header: "Order",
      cell: (p) => <span className="text-sm">{p.sortOrder}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => <StatusBadge active={p.isActive} />,
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(p.id)}
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
      description: "Title, slug and the copy that appears on the landing page.",
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Type" required hint="Where the group appears on site.">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    type: v as "package" | "destination",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Packages</SelectItem>
                  <SelectItem value="destination">Destinations</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Display Title"
              required
              hint="Shown in the navbar and on the landing page hero."
            >
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Honeymoon Specials"
              />
            </Field>
            <Field
              label="Slug"
              hint="Auto-generated from title if left blank."
            >
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="honeymoon-specials"
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

          <Field label="Tagline" hint="Short tagline for the navbar dropdown.">
            <Input
              value={form.tagline}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagline: e.target.value }))
              }
              placeholder="One-liner for the navbar dropdown"
            />
          </Field>

          <Field
            label="Short Description"
            hint="Intro paragraph above the listing."
            rightSlot={
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(form.description || "").replace(/<[^>]*>/g, "").length.toLocaleString()} chars
              </span>
            }
          >
            <RichTextEditor
              value={form.description}
              onChange={(html) =>
                setForm((f) => ({ ...f, description: html }))
              }
              imageFolder="nav-groups"
            />
          </Field>

          <Field
            label="Long-form Content"
            hint="Optional rich content rendered below the listing."
            rightSlot={
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {(form.content || "").replace(/<[^>]*>/g, "").length.toLocaleString()} chars
              </span>
            }
          >
            <RichTextEditor
              value={form.content}
              onChange={(html) =>
                setForm((f) => ({ ...f, content: html }))
              }
              imageFolder="nav-groups"
            />
          </Field>
        </div>
      ),
    },
    {
      id: "items",
      label: form.type === "package" ? "Packages" : "Destinations",
      icon: form.type === "package" ? RiSuitcaseLine : RiMapPinLine,
      description:
        form.type === "package"
          ? "Curate which packages this group features and in what order."
          : "Curate which destinations this group features and in what order.",
      badge: selectedCount > 0 ? (
        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
          {selectedCount}
        </Badge>
      ) : undefined,
      content: (
        <div className="space-y-3">
          {form.type === "package" ? (
            <MultiSelect
              options={packageOptions}
              value={form.packageIds}
              onChange={(v) => setForm((f) => ({ ...f, packageIds: v }))}
              placeholder="Click to add packages"
              searchPlaceholder="Search packages by title or location..."
              emptyText="No packages match. Try a different search."
              noun="package"
            />
          ) : (
            <MultiSelect
              options={destinationOptions}
              value={form.destinationIds}
              onChange={(v) =>
                setForm((f) => ({ ...f, destinationIds: v }))
              }
              placeholder="Click to add destinations"
              searchPlaceholder="Search destinations by name..."
              emptyText="No destinations match. Try a different search."
              noun="destination"
            />
          )}
          <p className="text-[11px] text-muted-foreground">
            Tip: leave empty to fall back to category-based matching (legacy
            behaviour using the items&rsquo; <code>categories</code> array).
          </p>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      description: "Cover image used as the page hero and OG fallback.",
      content: (
        <Field label="Cover Image">
          <ImageUpload
            value={form.coverImage}
            onChange={(url) =>
              setForm((f) => ({ ...f, coverImage: url }))
            }
            folder="nav-groups"
          />
        </Field>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      icon: RiSearchLine,
      description: "Meta tags & social share preview.",
      content: (
        <MetaFields
          value={{
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            metaKeywords: form.metaKeywords,
            ogImage: form.ogImage,
          }}
          onChange={(m) =>
            setForm((f) => ({
              ...f,
              metaTitle: m.metaTitle ?? "",
              metaDescription: m.metaDescription ?? "",
              metaKeywords: m.metaKeywords ?? "",
              ogImage: m.ogImage ?? "",
            }))
          }
          fallbackTitle={form.title || "Nav Group"}
          fallbackDescription={form.description || form.tagline}
        />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      description: "Visibility & highlight controls.",
      content: (
        <div className="space-y-3">
          <ToggleRow
            label="Show in Navbar"
            description="When off, the group is hidden from the public site."
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
          <ToggleRow
            label="Featured"
            description="Highlights this group on the homepage and listings."
            checked={form.isFeatured}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, isFeatured: v }))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nav Groups"
        description="Curate package or destination groups that appear in the navbar."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Group
          </Button>
        }
      />

      <EntityTable
        data={pages}
        columns={columns}
        loading={loading}
        rowKey={(p) => p.id}
        emptyTitle="No groups yet"
        emptyDescription='Click "Add Group" to create your first navbar group.'
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Nav Group" : "Create Nav Group"}
        description="Configure how this group appears in the navbar, what it links to, and how it shows in search."
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create group"}
        onSave={handleSave}
        footerLeft={
          <span>
            {selectedCount}{" "}
            {form.type === "package" ? "package" : "destination"}
            {selectedCount === 1 ? "" : "s"} selected
          </span>
        }
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this nav group?"
        description="This removes the group from the navbar. The packages and destinations inside are not affected."
        onConfirm={handleDelete}
      />
    </div>
  );
}
