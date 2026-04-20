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
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";

interface ActivityData { id?: string; title: string; description: string; image: string; location: string; icon: string; isActive: boolean; sortOrder: number; }
const empty: ActivityData = { title: "", description: "", image: "", location: "", icon: "Compass", isActive: true, sortOrder: 0 };

export default function ActivitiesPage() {
  const [items, setItems] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ActivityData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() { setLoading(true); try { setItems(await (await fetch("/api/admin/activities")).json()); } catch { toast.error("Failed"); } finally { setLoading(false); } }
  function openCreate() { setForm(empty); setDialogOpen(true); }
  function openEdit(item: ActivityData) { setForm(item); setDialogOpen(true); }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form }; delete (payload as Record<string, unknown>).id;
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/admin/activities/${form.id}` : "/api/admin/activities", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(isEdit ? "Updated!" : "Created!"); setDialogOpen(false); fetchItems(); } else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  async function handleDelete() { if (!deleteId) return; try { await fetch(`/api/admin/activities/${deleteId}`, { method: "DELETE" }); toast.success("Deleted!"); fetchItems(); } catch { toast.error("Failed"); } finally { setDeleteId(null); } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Activities</h1><p className="text-muted-foreground mt-1">Manage fun activities shown on the site</p></div>
        <Button onClick={openCreate} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Activity</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table><TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Location</TableHead><TableHead>Order</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
          : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No activities yet.</TableCell></TableRow>
          : items.map((item) => (
            <TableRow key={item.id}>
              <TableCell><div className="flex items-center gap-3">{item.image && <img src={item.image} alt="" className="w-12 h-8 rounded-md object-cover" />}<p className="font-medium text-sm">{item.title}</p></div></TableCell>
              <TableCell className="text-sm">{item.location}</TableCell>
              <TableCell className="text-sm">{item.sortOrder}</TableCell>
              <TableCell><Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">{item.isActive ? "Active" : "Hidden"}</Badge></TableCell>
              <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(item)}><RiEditLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(item.id!)}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody></Table>
      </CardContent></Card>

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0"><SheetTitle>{form.id ? "Edit" : "Add"} Activity</SheetTitle></SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Location *</Label><Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} folder="activities" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Icon Name</Label><Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="Compass" /></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} /></div>
            </div>
            <div className="flex items-center gap-2 pt-2"><Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} /><Label>Active</Label></div>
          </div>
          <SheetFooter className="p-6 pt-4 border-t"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Activity?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
