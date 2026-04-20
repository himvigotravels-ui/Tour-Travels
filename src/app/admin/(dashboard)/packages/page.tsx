"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MultiImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarLine, RiCloseLine, RiAddCircleLine } from "react-icons/ri";

interface ItineraryItem {
  day: number;
  title: string;
  activities: string;
}

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
  slug: "", title: "", location: "", pricePerPerson: 0, durationDays: 1, durationNights: 0,
  imageUrls: [], vehicleType: "", maxOccupancy: 1, description: "",
  itinerary: [{ day: 1, title: "", activities: "" }],
  inclusions: [""], exclusions: [""], categories: [],
  isFeatured: false, isActive: true, metaTitle: "", metaDescription: "", metaKeywords: "",
};

const categoryOptions = ["adventure", "family", "honeymoon", "spiritual", "offbeat", "culture", "luxury", "budget"];

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageData>(emptyPackage);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPackages(); }, []);

  async function fetchPackages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      setPackages(data);
    } catch { toast.error("Failed to load packages"); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setForm(emptyPackage);
    setDialogOpen(true);
  }

  function openEdit(pkg: PackageData) {
    setForm({
      ...pkg,
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
      inclusions: pkg.inclusions?.length ? pkg.inclusions : [""],
      exclusions: pkg.exclusions?.length ? pkg.exclusions : [""],
      categories: pkg.categories || [],
      metaTitle: pkg.metaTitle || "",
      metaDescription: pkg.metaDescription || "",
      metaKeywords: pkg.metaKeywords || "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        ...form,
        slug,
        inclusions: form.inclusions.filter(Boolean),
        exclusions: form.exclusions.filter(Boolean),
        itinerary: form.itinerary.filter((i) => i.title),
      };
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const url = isEdit ? `/api/admin/packages/${form.id}` : "/api/admin/packages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Package updated!" : "Package created!");
        setDialogOpen(false);
        fetchPackages();
      } else {
        toast.error("Failed to save package");
      }
    } catch { toast.error("Error saving package"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/packages/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Package deleted!");
        fetchPackages();
      }
    } catch { toast.error("Failed to delete"); }
    finally { setDeleteId(null); }
  }

  // Form helpers
  function addItinerary() {
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: "", activities: "" }] }));
  }
  function removeItinerary(i: number) {
    setForm((f) => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i).map((it, idx) => ({ ...it, day: idx + 1 })) }));
  }
  function updateItinerary(i: number, field: keyof ItineraryItem, value: string | number) {
    setForm((f) => ({ ...f, itinerary: f.itinerary.map((it, idx) => idx === i ? { ...it, [field]: value } : it) }));
  }
  function addListItem(field: "inclusions" | "exclusions") {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  }
  function updateListItem(field: "inclusions" | "exclusions", i: number, value: string) {
    setForm((f) => ({ ...f, [field]: f[field].map((v, idx) => idx === i ? value : v) }));
  }
  function removeListItem(field: "inclusions" | "exclusions", i: number) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
  }
  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage your tour packages</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <RiAddLine className="w-4 h-4" /> Add Package
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : packages.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No packages yet. Create your first one!</TableCell></TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {pkg.imageUrls?.[0] && (
                          <img src={pkg.imageUrls[0]} alt="" className="w-12 h-8 rounded-md object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{pkg.title}</p>
                          <p className="text-xs text-muted-foreground">{pkg.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{pkg.location}</TableCell>
                    <TableCell className="text-sm font-medium">₹{pkg.pricePerPerson?.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-sm">{pkg.durationDays}D/{pkg.durationNights}N</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pkg.isActive ? <Badge variant="default" className="text-xs">Active</Badge> : <Badge variant="secondary" className="text-xs">Draft</Badge>}
                        {pkg.isFeatured && <RiStarLine className="w-4 h-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}><RiEditLine className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(pkg.id!)}><RiDeleteBinLine className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{form.id ? "Edit Package" : "Create Package"}</DialogTitle>
            <DialogDescription>Fill in the details for your tour package.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] px-6">
            <div className="space-y-6 pb-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Spiti Valley Road Trip" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Spiti Valley" />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type *</Label>
                  <Input value={form.vehicleType} onChange={(e) => setForm((f) => ({ ...f, vehicleType: e.target.value }))} placeholder="Tempo Traveller" />
                </div>
                <div className="space-y-2">
                  <Label>Price Per Person (₹) *</Label>
                  <Input type="number" value={form.pricePerPerson} onChange={(e) => setForm((f) => ({ ...f, pricePerPerson: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Max Occupancy *</Label>
                  <Input type="number" value={form.maxOccupancy} onChange={(e) => setForm((f) => ({ ...f, maxOccupancy: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Duration Days *</Label>
                  <Input type="number" value={form.durationDays} onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Duration Nights *</Label>
                  <Input type="number" value={form.durationNights} onChange={(e) => setForm((f) => ({ ...f, durationNights: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Detailed package description..." />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Images</Label>
                <MultiImageUpload value={form.imageUrls} onChange={(urls) => setForm((f) => ({ ...f, imageUrls: urls }))} folder="packages" />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <Badge
                      key={cat}
                      variant={form.categories.includes(cat) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
                  <Label>Active</Label>
                </div>
              </div>

              <Separator />

              {/* Itinerary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Itinerary</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItinerary} className="gap-1">
                    <RiAddCircleLine className="w-4 h-4" /> Add Day
                  </Button>
                </div>
                {form.itinerary.map((item, i) => (
                  <div key={i} className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-start">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground mt-0.5">
                      D{item.day}
                    </div>
                    <Input value={item.title} onChange={(e) => updateItinerary(i, "title", e.target.value)} placeholder="Day title" />
                    <Input value={item.activities} onChange={(e) => updateItinerary(i, "activities", e.target.value)} placeholder="Activities description" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItinerary(i)} className="text-destructive mt-0.5">
                      <RiCloseLine className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Inclusions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Inclusions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addListItem("inclusions")} className="gap-1">
                    <RiAddCircleLine className="w-4 h-4" /> Add
                  </Button>
                </div>
                {form.inclusions.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => updateListItem("inclusions", i, e.target.value)} placeholder="e.g. Accommodation in hotels" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeListItem("inclusions", i)} className="text-destructive shrink-0">
                      <RiCloseLine className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Exclusions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addListItem("exclusions")} className="gap-1">
                    <RiAddCircleLine className="w-4 h-4" /> Add
                  </Button>
                </div>
                {form.exclusions.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={item} onChange={(e) => updateListItem("exclusions", i, e.target.value)} placeholder="e.g. Lunch and snacks" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeListItem("exclusions", i)} className="text-destructive shrink-0">
                      <RiCloseLine className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* SEO */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">SEO Settings</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Meta Title</Label>
                    <Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} placeholder="SEO title (defaults to package title)" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Meta Description</Label>
                    <Textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} placeholder="SEO description" rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Meta Keywords</Label>
                    <Input value={form.metaKeywords} onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))} placeholder="spiti, tour, adventure" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Package"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The package will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
