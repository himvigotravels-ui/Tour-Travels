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
  RiSettings4Line,
  RiSearchLine,
} from "react-icons/ri";

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
import { MetaFields } from "@/components/admin/shared/MetaFields";

interface TripForm {
  id?: string;
  title: string;
  slug: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  image: string;
  totalSeats: number;
  seatsLeft: number;
  description: string;
  highlights: string[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const emptyForm: TripForm = {
  title: "",
  slug: "",
  destination: "",
  startDate: "",
  endDate: "",
  durationDays: 3,
  durationNights: 2,
  pricePerPerson: 0,
  image: "",
  totalSeats: 20,
  seatsLeft: 20,
  description: "",
  highlights: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

// dates are stored as ISO strings; the <input type="date"> wants yyyy-mm-dd
const toDateInput = (v?: string | null) => (v ? String(v).slice(0, 10) : "");

export default function UpcomingTripsPage() {
  const [items, setItems] = useState<TripForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TripForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upcoming-trips");
      setItems(await res.json());
    } catch {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setSheetOpen(true);
  }

  function openEdit(t: TripForm) {
    setForm({
      ...emptyForm,
      ...t,
      startDate: toDateInput(t.startDate),
      endDate: toDateInput(t.endDate),
      highlights: Array.isArray(t.highlights) ? t.highlights : [],
      description: t.description || "",
      metaTitle: t.metaTitle || "",
      metaDescription: t.metaDescription || "",
      metaKeywords: t.metaKeywords || "",
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
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const res = await fetch(
        isEdit
          ? `/api/admin/upcoming-trips/${form.id}`
          : "/api/admin/upcoming-trips",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success(isEdit ? "Trip updated" : "Trip created");
        setSheetOpen(false);
        fetchItems();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to save trip");
      }
    } catch {
      toast.error("Error saving trip");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/upcoming-trips/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Trip deleted");
        fetchItems();
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }

  const columns: EntityColumn<TripForm>[] = [
    {
      key: "trip",
      header: "Trip",
      cell: (t) => (
        <div className="flex items-center gap-3">
          {t.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.image}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <div>
            <p className="text-sm font-medium">{t.title}</p>
            <p className="text-xs text-muted-foreground">{t.destination}</p>
          </div>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Departure",
      cell: (t) => (
        <span className="text-sm">
          {t.startDate ? toDateInput(t.startDate) : "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (t) => (
        <span className="text-sm tabular-nums">
          ₹{Number(t.pricePerPerson).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "seats",
      header: "Seats",
      cell: (t) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {t.seatsLeft}/{t.totalSeats}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (t) => <StatusBadge active={t.isActive} />,
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (t) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(t.id!)}
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
      label: "Details",
      icon: RiArticleLine,
      description: "The trip name, destination and departure window.",
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Trip Title" required>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Spiti Valley Group Departure"
              />
            </Field>
            <Field label="Destination" required>
              <Input
                value={form.destination}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destination: e.target.value }))
                }
                placeholder="e.g. Spiti Valley"
              />
            </Field>
            <Field label="Start Date" hint="Departure date.">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </Field>
            <Field label="End Date" hint="Return date.">
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
              />
            </Field>
            <Field label="Days">
              <Input
                type="number"
                value={form.durationDays}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label="Nights">
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
            <Field label="Price / person (₹)" required>
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
            <Field label="Sort Order" hint="Lower numbers appear first.">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label="Total Seats">
              <Input
                type="number"
                value={form.totalSeats}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalSeats: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label="Seats Left" hint="Drives the 'seats left' urgency badge.">
              <Input
                type="number"
                value={form.seatsLeft}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seatsLeft: Number(e.target.value) }))
                }
              />
            </Field>
          </FieldGrid>

          <Field label="Slug" hint="Auto-generated from the title if left blank.">
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="spiti-valley-group-departure"
            />
          </Field>

          <Field label="Short Description" hint="One or two lines shown on the card.">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              placeholder="A quick summary of this departure."
            />
          </Field>

          <Field
            label="Highlights"
            hint="One highlight per line — shown as chips on the trip card."
          >
            <Textarea
              value={form.highlights.join("\n")}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  highlights: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              rows={4}
              placeholder={"Key Monastery\nChandratal Lake\nAll permits included"}
            />
          </Field>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      description: "Cover image for the trip card.",
      content: (
        <Field label="Cover Image">
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            folder="upcoming-trips"
          />
        </Field>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      icon: RiSearchLine,
      description: "Meta tags for the standalone page.",
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
          fallbackTitle={form.title || "Upcoming Trip"}
          fallbackDescription={form.description}
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
            label="Active"
            description="When off, the trip is hidden from the site."
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
          <ToggleRow
            label="Featured"
            description="Highlights this trip on the homepage section."
            checked={form.isFeatured}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Trips"
        description="Fixed-departure group trips shown below the homepage hero and on the Upcoming Trips page."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Trip
          </Button>
        }
      />

      <EntityTable
        data={items}
        columns={columns}
        loading={loading}
        rowKey={(t) => t.id ?? t.slug}
        emptyTitle="No upcoming trips yet"
        emptyDescription='Click "Add Trip" to schedule your first departure.'
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Trip" : "Add Upcoming Trip"}
        description="Schedule a fixed-departure group trip with dates, pricing and seats."
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create trip"}
        onSave={handleSave}
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this trip?"
        description="This removes the departure from the homepage and Upcoming Trips page."
        onConfirm={handleDelete}
      />
    </div>
  );
}
