"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RiEyeLine,
  RiEyeOffLine,
  RiStarFill,
  RiSearchLine,
  RiSettings4Line,
  RiArticleLine,
} from "react-icons/ri";
import { MultiSelect, MultiSelectOption } from "@/components/admin/shared/MultiSelect";
import { FormSection } from "@/components/admin/shared/FormSection";
import { MetaFields } from "@/components/admin/shared/MetaFields";

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
        toast.success(isEdit ? "Group updated!" : "Group created!");
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
        toast.success("Group deleted!");
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
    form.type === "package" ? form.packageIds.length : form.destinationIds.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nav Groups</h1>
          <p className="text-muted-foreground mt-1">
            Curate package or destination groupings to feature in the navbar.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <RiAddLine className="w-4 h-4" /> Add Group
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No groups yet. Click &ldquo;Add Group&rdquo; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                pages.map((page) => {
                  const itemCount =
                    page.type === "package"
                      ? page.packages?.length ?? 0
                      : page.destinations?.length ?? 0;
                  return (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          {page.title}
                          {page.isFeatured && (
                            <RiStarFill className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {page.slug}
                      </TableCell>
                      <TableCell className="capitalize">
                        <Badge variant="outline">{page.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {itemCount}{" "}
                        {page.type === "package"
                          ? itemCount === 1
                            ? "package"
                            : "packages"
                          : itemCount === 1
                          ? "destination"
                          : "destinations"}
                      </TableCell>
                      <TableCell>{page.sortOrder}</TableCell>
                      <TableCell>
                        {page.isActive ? (
                          <Badge variant="default" className="gap-1">
                            <RiEyeLine className="w-3 h-3" /> Visible
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <RiEyeOffLine className="w-3 h-3" /> Hidden
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(page)}
                          >
                            <RiEditLine className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(page.id!)}
                          >
                            <RiDeleteBinLine className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>
              {form.id ? "Edit Nav Group" : "Create Nav Group"}
            </SheetTitle>
            <SheetDescription>
              Configure how this group appears in the navbar, what it links to,
              and how it shows in search.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="content" className="px-6 py-5">
            <TabsList className="w-full">
              <TabsTrigger value="content" className="gap-1.5">
                <RiArticleLine className="w-4 h-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-1.5">
                <RiSearchLine className="w-4 h-4" /> SEO
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <RiSettings4Line className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-5 space-y-5">
              <FormSection
                title="Basic Information"
                description="The name, type and copy for this group."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
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
                    <p className="text-[11px] text-muted-foreground">
                      Where this group will appear in the navbar.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Title *</Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="e.g. Honeymoon Specials"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, slug: e.target.value }))
                      }
                      placeholder="auto-generated from title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={form.tagline}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tagline: e.target.value }))
                    }
                    placeholder="A short one-liner for the navbar dropdown"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    placeholder="Intro shown above the listing on the landing page."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Long-form Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    rows={6}
                    placeholder="Optional long-form content shown on the landing page."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cover Image URL</Label>
                  <Input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImage: e.target.value }))
                    }
                    placeholder="https://res.cloudinary.com/..."
                  />
                  {form.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.coverImage}
                      alt=""
                      className="mt-2 h-32 rounded-md object-cover"
                    />
                  )}
                </div>
              </FormSection>

              <FormSection
                title={
                  form.type === "package"
                    ? "Packages in this Group"
                    : "Destinations in this Group"
                }
                description={
                  form.type === "package"
                    ? "Search and select the tour packages you want to feature. Reorder using the arrows."
                    : "Search and select the destinations you want to feature. Reorder using the arrows."
                }
              >
                {form.type === "package" ? (
                  <MultiSelect
                    options={packageOptions}
                    value={form.packageIds}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, packageIds: v }))
                    }
                    placeholder="Choose packages..."
                    searchPlaceholder="Search packages by title or location..."
                    emptyText="No packages match. Try a different search."
                  />
                ) : (
                  <MultiSelect
                    options={destinationOptions}
                    value={form.destinationIds}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, destinationIds: v }))
                    }
                    placeholder="Choose destinations..."
                    searchPlaceholder="Search destinations by name..."
                    emptyText="No destinations match. Try a different search."
                  />
                )}
                <p className="text-[11px] text-muted-foreground">
                  Tip: leave empty to fall back to category-based matching
                  (legacy behavior).
                </p>
              </FormSection>
            </TabsContent>

            <TabsContent value="seo" className="mt-5">
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
            </TabsContent>

            <TabsContent value="settings" className="mt-5 space-y-5">
              <FormSection
                title="Visibility & Highlights"
                description="Control whether this group appears on the public site."
              >
                <div className="flex items-start gap-3">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isActive: v }))
                    }
                  />
                  <div>
                    <Label>Show in Navbar</Label>
                    <p className="text-xs text-muted-foreground">
                      When off, the group is hidden from the public site.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Switch
                    checked={form.isFeatured}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isFeatured: v }))
                    }
                  />
                  <div>
                    <Label>Featured</Label>
                    <p className="text-xs text-muted-foreground">
                      Highlights this group in homepage and listing surfaces.
                    </p>
                  </div>
                </div>
              </FormSection>
            </TabsContent>
          </Tabs>

          <SheetFooter className="px-6 py-4 border-t bg-background">
            <div className="flex w-full items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {form.type === "package"
                  ? `${selectedCount} package${selectedCount === 1 ? "" : "s"} selected`
                  : `${selectedCount} destination${selectedCount === 1 ? "" : "s"} selected`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Group"}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the group from the Navbar. The packages and
              destinations inside will not be affected. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
