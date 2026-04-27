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

interface ActivityData {
  id?: string;
  title: string;
  description: string;
  image: string;
  location: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

const empty: ActivityData = {
  title: "",
  description: "",
  image: "",
  location: "",
  icon: "Compass",
  isActive: true,
  sortOrder: 0,
};

export default function ActivitiesPage() {
  const [items, setItems] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ActivityData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      setItems(await (await fetch("/api/admin/activities")).json());
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(empty);
    setSheetOpen(true);
  }
  function openEdit(item: ActivityData) {
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
        isEdit ? `/api/admin/activities/${form.id}` : "/api/admin/activities",
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
      await fetch(`/api/admin/activities/${deleteId}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchItems();
    } catch {
      toast.error("Failed");
    } finally {
      setDeleteId(null);
    }
  }

  const columns: EntityColumn<ActivityData>[] = [
    {
      key: "activity",
      header: "Activity",
      cell: (i) => (
        <div className="flex items-center gap-3">
          {i.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={i.image}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <p className="text-sm font-medium">{i.title}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (i) => <span className="text-sm">{i.location}</span>,
    },
    {
      key: "order",
      header: "Order",
      cell: (i) => <span className="text-sm">{i.sortOrder}</span>,
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
      label: "Content",
      icon: RiArticleLine,
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
            <Field label="Location" required>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </Field>
            <Field label="Icon Name" hint="Lucide icon name (e.g. Compass).">
              <Input
                value={form.icon}
                onChange={(e) =>
                  setForm((f) => ({ ...f, icon: e.target.value }))
                }
              />
            </Field>
            <Field label="Sort Order">
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
          <Field label="Description" required>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
            />
          </Field>
        </div>
      ),
    },
    {
      id: "media",
      label: "Media",
      icon: RiImageLine,
      content: (
        <Field label="Image">
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            folder="activities"
          />
        </Field>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      content: (
        <ToggleRow
          label="Active"
          description="When off, the activity is hidden on the public site."
          checked={form.isActive}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activities"
        description="Manage signature activities featured on the site."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <RiAddLine className="h-4 w-4" /> Add Activity
          </Button>
        }
      />

      <EntityTable
        data={items}
        columns={columns}
        loading={loading}
        rowKey={(i) => i.id ?? i.title}
        emptyTitle="No activities yet"
        emptyDescription="Add your first activity to feature it on the site."
      />

      <EntitySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={form.id ? "Edit Activity" : "Add Activity"}
        sections={sections}
        saving={saving}
        saveLabel={form.id ? "Save changes" : "Create activity"}
        onSave={handleSave}
        width="sm:max-w-3xl lg:max-w-4xl"
      />

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete this activity?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
