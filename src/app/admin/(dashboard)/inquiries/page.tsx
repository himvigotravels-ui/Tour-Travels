"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RiEyeLine, RiDeleteBinLine, RiMailLine, RiPhoneLine } from "react-icons/ri";

interface InquiryData {
  id: string; 
  name: string; 
  email: string | null;
  phone: string; 
  fromCity: string | null; 
  toCity: string | null;
  pickupLocation: string | null;
  dropLocation: string | null;
  travelDate: string | null; 
  pickupDate: string | null;
  dropDate: string | null;
  adults: number;
  children: number;
  passengers: string | null; 
  duration: string | null;
  message: string | null; 
  status: string; 
  createdAt: string;
}

export default function InquiriesPage() {
  const [items, setItems] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InquiryData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() { setLoading(true); try { setItems(await (await fetch("/api/admin/inquiries")).json()); } catch { toast.error("Failed"); } finally { setLoading(false); } }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/inquiries/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      toast.success("Status updated!"); fetchItems();
    } catch { toast.error("Failed"); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try { await fetch(`/api/admin/inquiries/${deleteId}`, { method: "DELETE" }); toast.success("Deleted!"); fetchItems(); }
    catch { toast.error("Failed"); }
    finally { setDeleteId(null); }
  }

  const statusColor = (s: string) => s === "new" ? "default" : s === "contacted" ? "secondary" : "outline";

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Inquiries</h1><p className="text-muted-foreground mt-1">Manage contact form submissions</p></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow>
        <TableHead>Customer</TableHead><TableHead>Contact</TableHead><TableHead>Route</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {loading ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
        : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No inquiries yet.</TableCell></TableRow>
        : items.map((item) => (
          <TableRow key={item.id}>
            <TableCell><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0">{item.name[0]?.toUpperCase()}</div><p className="font-medium text-sm">{item.name}</p></div></TableCell>
            <TableCell><div className="text-sm flex items-center gap-1"><RiPhoneLine className="w-3 h-3 text-muted-foreground" />{item.phone}</div></TableCell>
            <TableCell className="text-sm">{item.fromCity && item.toCity ? `${item.fromCity} → ${item.toCity}` : "-"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Select value={item.status} onValueChange={(v) => updateStatus(item.id, v)}>
                <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => setSelected(item)}><RiEyeLine className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(item.id)}><RiDeleteBinLine className="w-4 h-4" /></Button></div></TableCell>
          </TableRow>
        ))}
      </TableBody></Table></CardContent></Card>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0"><SheetTitle>Inquiry Details</SheetTitle></SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs mb-1">Name</p><p className="font-medium">{selected.name}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Email</p><p className="font-medium">{selected.email || "-"}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Phone</p><p className="font-medium">{selected.phone}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Status</p><Badge variant={statusColor(selected.status)} className="capitalize">{selected.status}</Badge></div>
                
                {selected.pickupDate ? (
                  <>
                    <div className="col-span-2 border-t pt-2 mt-2"><p className="text-[10px] font-bold uppercase text-muted-foreground">Booking Details</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Pickup</p><p className="font-medium">{selected.pickupLocation || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Drop</p><p className="font-medium">{selected.dropLocation || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-medium">{new Date(selected.pickupDate).toLocaleDateString()} - {new Date(selected.dropDate!).toLocaleDateString()}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Travelers</p><p className="font-medium">{selected.adults} Adults, {selected.children} Children</p></div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2 border-t pt-2 mt-2"><p className="text-[10px] font-bold uppercase text-muted-foreground">Contact Inquiry</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">From</p><p className="font-medium">{selected.fromCity || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">To</p><p className="font-medium">{selected.toCity || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-medium">{selected.travelDate || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Passengers</p><p className="font-medium">{selected.passengers || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Duration</p><p className="font-medium">{selected.duration || "-"}</p></div>
                  </>
                )}
              </div>
              {selected.message && (
                <div><p className="text-muted-foreground text-xs mb-1">Message</p><p className="text-sm bg-muted p-3 rounded-lg">{selected.message}</p></div>
              )}
              <p className="text-xs text-muted-foreground">Submitted on {new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          )}
          </div>
          <SheetFooter className="p-6 pt-4 border-t"><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Inquiry?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
