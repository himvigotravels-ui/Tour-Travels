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
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiAddCircleLine, RiCloseLine } from "react-icons/ri";

interface DestData {
  id?: string; slug: string; name: string; tagline: string; description: string;
  bestTime: string; altitude: string; vibe: string; image: string;
  highlights: string[]; isActive: boolean; sortOrder: number;
  metaTitle: string; metaDescription: string; metaKeywords: string;
}

const emptyDest: DestData = {
  slug: "", name: "", tagline: "", description: "", bestTime: "", altitude: "", vibe: "",
  image: "", highlights: [""], isActive: true, sortOrder: 0,
  metaTitle: "", metaDescription: "", metaKeywords: "",
};

export default function DestinationsPage() {
  const [items, setItems] = useState<DestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<DestData>(emptyDest);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try { setItems(await (await fetch("/api/admin/destinations")).json()); }
    catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  function openCreate() { setForm(emptyDest); setDialogOpen(true); }
  function openEdit(item: DestData) {
    setForm({ ...item, highlights: item.highlights?.length ? item.highlights : [""], metaTitle: item.metaTitle || "", metaDescription: item.metaDescription || "", metaKeywords: item.metaKeywords || "" });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...form, slug, highlights: form.highlights.filter(Boolean) };
      delete (payload as Record<string, unknown>).id;

      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/admin/destinations/${form.id}` : "/api/admin/destinations", {
        method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (res.ok) { toast.success(isEdit ? "Updated!" : "Created!"); setDialogOpen(false); fetchItems(); }
      else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try { await fetch(`/api/admin/destinations/${deleteId}`, { method: "DELETE" }); toast.success("Deleted!"); fetchItems(); }
    catch { toast.error("Failed"); }
    finally { setDeleteId(null); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Destinations</h1><p className="text-muted-foreground mt-1">Manage travel destinations</p></div>
        <Button onClick={openCreate} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Destination</Button>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Destination</TableHead><TableHead>Tagline</TableHead><TableHead>Best Time</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No destinations yet.</TableCell></TableRow>
            : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell><div className="flex items-center gap-3">{item.image && <img src={item.image} alt="" className="w-12 h-8 rounded-md object-cover" />}<div><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.slug}</p></div></div></TableCell>
                <TableCell className="text-sm">{item.tagline}</TableCell>
                <TableCell className="text-sm">{item.bestTime}</TableCell>
                <TableCell><Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">{item.isActive ? "Active" : "Draft"}</Badge></TableCell>
                <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(item)}><RiEditLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(item.id!)}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0"><DialogTitle>{form.id ? "Edit" : "Create"} Destination</DialogTitle><DialogDescription>Add or edit destination details and SEO.</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[70vh] px-6"><div className="space-y-5 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" /></div>
              <div className="space-y-2"><Label>Tagline *</Label><Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="The Middle Land" /></div>
              <div className="space-y-2"><Label>Vibe</Label><Input value={form.vibe} onChange={(e) => setForm((f) => ({ ...f, vibe: e.target.value }))} placeholder="Adventure & Spiritual" /></div>
              <div className="space-y-2"><Label>Best Time</Label><Input value={form.bestTime} onChange={(e) => setForm((f) => ({ ...f, bestTime: e.target.value }))} placeholder="June to October" /></div>
              <div className="space-y-2"><Label>Altitude</Label><Input value={form.altitude} onChange={(e) => setForm((f) => ({ ...f, altitude: e.target.value }))} placeholder="12,500 ft" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} /></div>
            </div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} /></div>
            <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} folder="destinations" /></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Highlights</Label><Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, highlights: [...f.highlights, ""] }))} className="gap-1"><RiAddCircleLine className="w-4 h-4" /> Add</Button></div>
              {form.highlights.map((h, i) => (
                <div key={i} className="flex gap-2"><Input value={h} onChange={(e) => setForm((f) => ({ ...f, highlights: f.highlights.map((v, idx) => idx === i ? e.target.value : v) }))} placeholder="Key Monastery" /><Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setForm((f) => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))}><RiCloseLine className="w-4 h-4" /></Button></div>
              ))}
            </div>

            <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} /><Label>Active</Label></div>

            <Separator />
            <div className="space-y-4">
              <Label className="text-base font-semibold">SEO</Label>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Title</Label><Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} /></div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Description</Label><Textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} /></div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Keywords</Label><Input value={form.metaKeywords} onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))} /></div>
            </div>
          </div></ScrollArea>
          <DialogFooter className="p-6 pt-0"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Destination?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
