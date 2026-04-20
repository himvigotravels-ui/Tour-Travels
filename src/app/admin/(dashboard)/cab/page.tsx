"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiAddCircleLine, RiCloseLine } from "react-icons/ri";

interface VehicleData { id?: string; name: string; model: string; capacity: string; ideal: string; features: string[]; image: string; isActive: boolean; }
interface RouteData { id?: string; fromCity: string; toCity: string; price: string; duration: string; isActive: boolean; }

const emptyVehicle: VehicleData = { name: "", model: "", capacity: "", ideal: "", features: [""], image: "", isActive: true };
const emptyRoute: RouteData = { fromCity: "", toCity: "", price: "", duration: "", isActive: true };

export default function CabPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [vDialogOpen, setVDialogOpen] = useState(false);
  const [rDialogOpen, setRDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "vehicle" | "route"; id: string } | null>(null);
  const [vForm, setVForm] = useState<VehicleData>(emptyVehicle);
  const [rForm, setRForm] = useState<RouteData>(emptyRoute);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);
  async function fetchAll() {
    setLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([fetch("/api/admin/cab/vehicles"), fetch("/api/admin/cab/routes")]);
      setVehicles(await vRes.json()); setRoutes(await rRes.json());
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  async function saveVehicle() {
    setSaving(true);
    try {
      const payload = { ...vForm, features: vForm.features.filter(Boolean) }; delete (payload as Record<string, unknown>).id;
      const isEdit = !!vForm.id;
      const res = await fetch(isEdit ? `/api/admin/cab/vehicles/${vForm.id}` : "/api/admin/cab/vehicles", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success("Saved!"); setVDialogOpen(false); fetchAll(); } else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  async function saveRoute() {
    setSaving(true);
    try {
      const payload = { ...rForm }; delete (payload as Record<string, unknown>).id;
      const isEdit = !!rForm.id;
      const res = await fetch(isEdit ? `/api/admin/cab/routes/${rForm.id}` : "/api/admin/cab/routes", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success("Saved!"); setRDialogOpen(false); fetchAll(); } else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/cab/${deleteTarget.type === "vehicle" ? "vehicles" : "routes"}/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Deleted!"); fetchAll();
    } catch { toast.error("Failed"); }
    finally { setDeleteTarget(null); }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Cab Services</h1><p className="text-muted-foreground mt-1">Manage fleet vehicles and transfer routes</p></div>

      <Tabs defaultValue="vehicles">
        <TabsList><TabsTrigger value="vehicles">Vehicles</TabsTrigger><TabsTrigger value="routes">Routes</TabsTrigger></TabsList>

        <TabsContent value="vehicles" className="space-y-4 mt-4">
          <div className="flex justify-end"><Button onClick={() => { setVForm(emptyVehicle); setVDialogOpen(true); }} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Vehicle</Button></div>
          <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Vehicle</TableHead><TableHead>Model</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            : vehicles.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No vehicles yet.</TableCell></TableRow>
            : vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell><div className="flex items-center gap-3">{v.image && <img src={v.image} alt="" className="w-12 h-8 rounded-md object-cover" />}<p className="font-medium text-sm">{v.name}</p></div></TableCell>
                <TableCell className="text-sm">{v.model}</TableCell>
                <TableCell className="text-sm">{v.capacity}</TableCell>
                <TableCell><Badge variant={v.isActive ? "default" : "secondary"} className="text-xs">{v.isActive ? "Active" : "Hidden"}</Badge></TableCell>
                <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => { setVForm({ ...v, features: v.features?.length ? v.features : [""] }); setVDialogOpen(true); }}><RiEditLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget({ type: "vehicle", id: v.id! })}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4 mt-4">
          <div className="flex justify-end"><Button onClick={() => { setRForm(emptyRoute); setRDialogOpen(true); }} className="gap-2"><RiAddLine className="w-4 h-4" /> Add Route</Button></div>
          <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Route</TableHead><TableHead>Price</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            : routes.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No routes yet.</TableCell></TableRow>
            : routes.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-sm">{r.fromCity} → {r.toCity}</TableCell>
                <TableCell className="text-sm">{r.price}</TableCell>
                <TableCell className="text-sm">{r.duration}</TableCell>
                <TableCell><Badge variant={r.isActive ? "default" : "secondary"} className="text-xs">{r.isActive ? "Active" : "Hidden"}</Badge></TableCell>
                <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => { setRForm(r); setRDialogOpen(true); }}><RiEditLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget({ type: "route", id: r.id! })}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Vehicle Dialog */}
      <Sheet open={vDialogOpen} onOpenChange={setVDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0"><SheetTitle>{vForm.id ? "Edit" : "Add"} Vehicle</SheetTitle></SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={vForm.name} onChange={(e) => setVForm((f) => ({ ...f, name: e.target.value }))} placeholder="Premium SUV" /></div>
              <div className="space-y-2"><Label>Model *</Label><Input value={vForm.model} onChange={(e) => setVForm((f) => ({ ...f, model: e.target.value }))} placeholder="Toyota Innova Crysta" /></div>
              <div className="space-y-2"><Label>Capacity</Label><Input value={vForm.capacity} onChange={(e) => setVForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="6-7 Passengers" /></div>
              <div className="space-y-2"><Label>Ideal For</Label><Input value={vForm.ideal} onChange={(e) => setVForm((f) => ({ ...f, ideal: e.target.value }))} placeholder="Family trips" /></div>
            </div>
            <div className="space-y-2"><Label>Image</Label><ImageUpload value={vForm.image} onChange={(url) => setVForm((f) => ({ ...f, image: url }))} folder="cab" /></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Features</Label><Button type="button" variant="outline" size="sm" onClick={() => setVForm((f) => ({ ...f, features: [...f.features, ""] }))} className="gap-1"><RiAddCircleLine className="w-4 h-4" /> Add</Button></div>
              {vForm.features.map((feat, i) => (
                <div key={i} className="flex gap-2"><Input value={feat} onChange={(e) => setVForm((f) => ({ ...f, features: f.features.map((v, idx) => idx === i ? e.target.value : v) }))} placeholder="Feature" /><Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setVForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))}><RiCloseLine className="w-4 h-4" /></Button></div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2"><Switch checked={vForm.isActive} onCheckedChange={(v) => setVForm((f) => ({ ...f, isActive: v }))} /><Label>Active</Label></div>
          </div>
          <SheetFooter className="p-6 pt-4 border-t"><Button variant="outline" onClick={() => setVDialogOpen(false)}>Cancel</Button><Button onClick={saveVehicle} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Route Dialog */}
      <Sheet open={rDialogOpen} onOpenChange={setRDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0"><SheetTitle>{rForm.id ? "Edit" : "Add"} Route</SheetTitle></SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>From *</Label><Input value={rForm.fromCity} onChange={(e) => setRForm((f) => ({ ...f, fromCity: e.target.value }))} placeholder="Chandigarh" /></div>
              <div className="space-y-2"><Label>To *</Label><Input value={rForm.toCity} onChange={(e) => setRForm((f) => ({ ...f, toCity: e.target.value }))} placeholder="Manali" /></div>
              <div className="space-y-2"><Label>Price</Label><Input value={rForm.price} onChange={(e) => setRForm((f) => ({ ...f, price: e.target.value }))} placeholder="Starts from ₹4,500" /></div>
              <div className="space-y-2"><Label>Duration</Label><Input value={rForm.duration} onChange={(e) => setRForm((f) => ({ ...f, duration: e.target.value }))} placeholder="8-9 Hours" /></div>
            </div>
            <div className="flex items-center gap-2 pt-2"><Switch checked={rForm.isActive} onCheckedChange={(v) => setRForm((f) => ({ ...f, isActive: v }))} /><Label>Active</Label></div>
          </div>
          <SheetFooter className="p-6 pt-4 border-t"><Button variant="outline" onClick={() => setRDialogOpen(false)}>Cancel</Button><Button onClick={saveRoute} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
