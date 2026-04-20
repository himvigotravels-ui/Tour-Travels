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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarFill } from "react-icons/ri";

interface TestimonialData { id?: string; name: string; text: string; packageName: string; rating: number; isActive: boolean; }
const empty: TestimonialData = { name: "", text: "", packageName: "", rating: 5, isActive: true };

export default function TestimonialsPage() {
  const [items, setItems] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() { setLoading(true); try { setItems(await (await fetch("/api/admin/testimonials")).json()); } catch { toast.error("Failed"); } finally { setLoading(false); } }
  function openCreate() { setForm(empty); setDialogOpen(true); }
  function openEdit(item: TestimonialData) { setForm(item); setDialogOpen(true); }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form }; delete (payload as Record<string, unknown>).id;
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/admin/testimonials/${form.id}` : "/api/admin/testimonials", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(isEdit ? "Updated!" : "Created!"); setDialogOpen(false); fetchItems(); } else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  async function handleDelete() { if (!deleteId) return; try { await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" }); toast.success("Deleted!"); fetchItems(); } catch { toast.error("Failed"); } finally { setDeleteId(null); } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Testimonials</h1><p className="text-muted-foreground mt-1">Manage customer reviews</p></div>
        <Button onClick={openCreate} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Testimonial</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table><TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Package</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {loading ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
          : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No testimonials yet.</TableCell></TableRow>
          : items.map((item) => (
            <TableRow key={item.id}>
              <TableCell><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-muted-foreground line-clamp-1">{item.text}</p></TableCell>
              <TableCell className="text-sm">{item.packageName}</TableCell>
              <TableCell><div className="flex text-amber-500">{Array.from({ length: item.rating }, (_, i) => <RiStarFill key={i} className="w-3.5 h-3.5" />)}</div></TableCell>
              <TableCell><Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">{item.isActive ? "Active" : "Hidden"}</Badge></TableCell>
              <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(item)}><RiEditLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(item.id!)}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody></Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{form.id ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Customer Name *</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Package Name *</Label><Input value={form.packageName} onChange={(e) => setForm((f) => ({ ...f, packageName: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Review Text *</Label><Textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={4} /></div>
            <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} /><Label>Visible on site</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Testimonial?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
