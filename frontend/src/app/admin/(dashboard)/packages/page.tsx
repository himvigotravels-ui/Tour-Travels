"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { MultiImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiStarFill,
  RiArticleLine,
  RiImageLine,
  RiCalendarTodoLine,
  RiCheckboxLine,
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
import { ListEditor } from "@/components/admin/shared/ListEditor";
import {
  ItineraryEditor,
  ItineraryItem,
} from "@/components/admin/shared/ItineraryEditor";
import { MetaFields } from "@/components/admin/shared/MetaFields";
import {
  BadgeMultiSelect,
} from "@/components/admin/shared/BadgeMultiSelect";

interface PackageData {
  id?: string;
  slug: string;
  title: string;
  location: string;
  pricePerPerson: number;
  durationDays: number;
  durationNights: number;
  imageUrls: string[];
  vehicleType: string;
  maxOccupancy: number;
  description: string;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  categories: string[];
  isFeatured: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const emptyPackage: PackageData = {
  slug: "",
  title: "",
  location: "",
  pricePerPerson: 0,
  durationDays: 1,
  durationNights: 0,
  imageUrls: [],
  vehicleType: "",
  maxOccupancy: 1,
  description: "",
  itinerary: [{ day: 1, title: "", activities: "" }],
  inclusions: [],
  exclusions: [],
  categories: [],
  isFeatured: false,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

interface NavGroup {
  title: string;
  slug: string;
  type: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageData>(emptyPackage);
  const [saving, setSaving] = useState(false);
  const [packageGroups, setPackageGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    fetchPackages();
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const res = await fetch("/api/admin/internal-pages");
      const data = await res.json();
      setPackageGroups(
        data.filter((p: NavGroup) => p.type === "package")
      );
    } catch {}
  }

  async function fetchPackages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      setPackages(await res.json());
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyPackage);
    setSheetOpen(true);
  }

  function openEdit(pkg: PackageData) {
    setForm({
      ...pkg,
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      categories: pkg.categories || [],
      metaTitle: pkg.metaTitle || "",
      metaDescription: pkg.metaDescription || "",
      metaKeywords: pkg.metaKeywords || "",
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
      const payload = {
        ...form,
        slug,
        inclusions: form.inclusions.filter(Boolean),
        exclusions: form.exclusions.filter(Boolean),
        itinerary: form.itinerary.filter((i) => i.title),
      };
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const url = isEdit
        ? `/api/admin/packages/${form.id}`
        : "/api/admin/packages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Package updated" : "Package created");
        setSheetOpen(false);
        fetchPackages();
      } else {
        toast.error("Failed to save package");
      }
    } catch {
      toast.error("Error saving package");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/packages/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Package deleted");
        fetchPackages();
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }

  const groupOptions = useMemo(
    () =>
      packageGroups.map((g) => ({ value: g.slug, label: g.title })),
    [packageGroups]
  );

  const columns: EntityColumn<PackageData>[] = [
    {
      key: "package",
      header: "Package",
      cell: (pkg) => (
        <div className="flex items-center gap-3">
          {pkg.imageUrls?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pkg.imageUrls[0]}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{pkg.title}</p>
            <p className="text-xs text-muted-foreground truncate font-mono">
              /{pkg.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (p) => <span className="text-sm">{p.location}</span>,
    },
    {
      key: "price",
      header: "Price",
      cell: (p) => (
        <span className="text-sm font-medium">
          ₹{p.pricePerPerson?.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (p) => (
        <span className="text-sm">
          {p.durationDays}D / {p.durationNights}N
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Badge variant={p.isActive ? "default" : "secondary"}>
            {p.isActive ? "Active" : "Draft"}
          </Badge>
          {p.isFeatured && (
            <RiStarFill className="h-3.5 w-3.5 text-amber-500" />
          )}
        </div>
      ),
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
            onClick={() => setDeleteId(p.id!)}
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
      description: "Title, location, pricing and description.",
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Title" required>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Spiti Valley Road Trip"
              />
            </Field>
            <Field label="Slug" hint="Auto-generated from title.">
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="spiti-valley-road-trip"
              />
            </Field>
            <Field label="Location" required>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="Spiti Valley"
              />
            </Field>
            <Field label="Vehicle Type" required>
              <Input
                value={form.vehicleType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vehicleType: e.target.value }))
                }
                placeholder="Tempo Traveller"
              />
            </Field>
            <Field label="Price Per Person (₹)" required>
              <Input
                type="number"
                value={form.pricePerPerson}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    pricePerPerson: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Max Occupancy" required>
              <Input
                type="number"
                value={form.maxOccupancy}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maxOccupancy: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Duration (Days)" required>
              <Input
                type="number"
                value={form.durationDays}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    durationDays: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Duration (Nights)" required>
              <Input
                type="number"
                value={form.durationNights}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    durationNights: Number(e.target.value),
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
              imageFolder="packages"
              placeholder="Detailed package description... use the toolbar to format."
            />
          </Field>

          <Field
            label="Nav Groups"
            hint="Tag this package so it shows up under matching navbar groups."
          >
            <BadgeMultiSelect
              options={groupOptions}
              value={form.categories}
              onChange={(v) => setForm((f) => ({ ...f, categories: v }))}
              emptyHint="No nav groups yet. Create one in the Nav Groups page."
            />
          </Field>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      description: "Photo gallery shown on the package page.",
      badge:
        form.imageUrls.length > 0 ? (
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            {form.imageUrls.length}
          </Badge>
        ) : undefined,
      content: (
        <Field
          label="Images"
          hint="First image is used as the cover. PNG, JPG or WEBP up to 10MB."
        >
          <MultiImageUpload
            value={form.imageUrls}
            onChange={(urls) => setForm((f) => ({ ...f, imageUrls: urls }))}
            folder="packages"
          />
        </Field>
      ),
    },
    {
      id: "itinerary",
      label: "Itinerary",
      icon: RiCalendarTodoLine,
      description: "Day-by-day breakdown of the trip.",
      badge:
        form.itinerary.length > 0 ? (
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            {form.itinerary.length}
          </Badge>
        ) : undefined,
      content: (
        <ItineraryEditor
          value={form.itinerary}
          onChange={(v) => setForm((f) => ({ ...f, itinerary: v }))}
        />
      ),
    },
    {
      id: "inclusions",
      label: "Inclusions & Exclusions",
      icon: RiCheckboxLine,
      description: "What is included and what is not in the price.",
      content: (
        <div className="space-y-6">
          <Field label="Inclusions" hint="What's included in the package price.">
            <ListEditor
              value={form.inclusions}
              onChange={(v) => setForm((f) => ({ ...f, inclusions: v }))}
              placeholder="e.g. Accommodation in 3-star hotels"
              addLabel="Add inclusion"
            />
          </Field>
          <Field label="Exclusions" hint="What guests need to pay separately.">
            <ListEditor
              value={form.exclusions}
              onChange={(v) => setForm((f) => ({ ...f, exclusions: v }))}
              placeholder="e.g. Personal expenses"
              addLabel="Add exclusion"
            />
          </Field>
        </div>
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
          fallbackTitle={form.title}
          fallbackDescription={form.description}
        />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      description: "Visibility and feature flags.",
      content: (
        <div className="space-y-3">
          <ToggleRow
            label="Active"
            description="Hide from the public site without deleting."
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
          <ToggleRow
            label="Featured"
            description="Highlight this package on the homepage."
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
        title="Packages"
        description="Manage your tour packages, itineraries and inclusions."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Package
          </Button>
        }
      />

      <EntityTable
        data={packages}
        columns={columns}
        loading={loading}
        rowKey={(p) => p.id ?? p.slug}
        emptyTitle="No packages yet"
        emptyDescription="Create your first tour package to see it here."
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Package" : "Create Package"}
        description="Set up the package content, images, itinerary and SEO."
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create package"}
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
        title="Delete this package?"
        description="The package will be permanently removed and unlinked from any nav groups."
        onConfirm={handleDelete}
      />
    </div>
  );
}
