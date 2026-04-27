"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiStarFill,
  RiArticleLine,
  RiSettings4Line,
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

interface TestimonialData {
  id?: string;
  name: string;
  text: string;
  packageName: string;
  rating: number;
  isActive: boolean;
}

const empty: TestimonialData = {
  name: "",
  text: "",
  packageName: "",
  rating: 5,
  isActive: true,
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      setItems(await (await fetch("/api/admin/testimonials")).json());
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(empty);
    setSheetOpen(true);
  }
  function openEdit(item: TestimonialData) {
    setForm(item);
    setSheetOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form };
      delete (payload as Record<string, unknown>).id;
      const isEdit = !!form.id;
      const res = await fetch(
        isEdit
          ? `/api/admin/testimonials/${form.id}`
          : "/api/admin/testimonials",
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
      } else toast.error("Failed");
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/testimonials/${deleteId}`, {
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

  const columns: EntityColumn<TestimonialData>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (i) => (
        <div className="min-w-0">
          <p className="text-sm font-medium">{i.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{i.text}</p>
        </div>
      ),
    },
    {
      key: "package",
      header: "Package",
      cell: (i) => <span className="text-sm">{i.packageName}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (i) => (
        <div className="flex text-amber-500">
          {Array.from({ length: i.rating }, (_, idx) => (
            <RiStarFill key={idx} className="h-3.5 w-3.5" />
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => (
        <Badge variant={i.isActive ? "default" : "secondary"}>
          {i.isActive ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (i) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(i.id!)}
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
      label: "Review",
      icon: RiArticleLine,
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Customer Name" required>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Package Name" required>
              <Input
                value={form.packageName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, packageName: e.target.value }))
                }
              />
            </Field>
            <Field label="Rating (1–5)">
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: Number(e.target.value) }))
                }
              />
            </Field>
          </FieldGrid>
          <Field label="Review Text" required>
            <Textarea
              value={form.text}
              onChange={(e) =>
                setForm((f) => ({ ...f, text: e.target.value }))
              }
              rows={5}
            />
          </Field>
        </div>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      content: (
        <ToggleRow
          label="Visible on site"
          description="Hide without deleting."
          checked={form.isActive}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage customer reviews shown across the site."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Testimonial
          </Button>
        }
      />

      <EntityTable
        data={items}
        columns={columns}
        loading={loading}
        rowKey={(i) => i.id ?? i.name}
        emptyTitle="No testimonials yet"
        emptyDescription="Add customer feedback to feature it on the site."
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Testimonial" : "Add Testimonial"}
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Add testimonial"}
        onSave={handleSave}
        width="sm:!max-w-[50vw] sm:!w-[50vw]"
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this testimonial?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
