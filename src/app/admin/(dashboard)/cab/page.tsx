"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArticleLine,
  RiImageLine,
  RiSettings4Line,
  RiTaxiLine,
  RiRoadMapLine,
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
import { ListEditor } from "@/components/admin/shared/ListEditor";

interface VehicleData {
  id?: string;
  name: string;
  model: string;
  capacity: string;
  ideal: string;
  features: string[];
  image: string;
  isActive: boolean;
}
interface RouteData {
  id?: string;
  fromCity: string;
  toCity: string;
  price: string;
  duration: string;
  isActive: boolean;
}

const emptyVehicle: VehicleData = {
  name: "",
  model: "",
  capacity: "",
  ideal: "",
  features: [],
  image: "",
  isActive: true,
};
const emptyRoute: RouteData = {
  fromCity: "",
  toCity: "",
  price: "",
  duration: "",
  isActive: true,
};

export default function CabPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [vSheet, setVSheet] = useState(false);
  const [rSheet, setRSheet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "vehicle" | "route";
    id: string;
  } | null>(null);
  const [vForm, setVForm] = useState<VehicleData>(emptyVehicle);
  const [rForm, setRForm] = useState<RouteData>(emptyRoute);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);
  async function fetchAll() {
    setLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([
        fetch("/api/admin/cab/vehicles"),
        fetch("/api/admin/cab/routes"),
      ]);
      setVehicles(await vRes.json());
      setRoutes(await rRes.json());
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function saveVehicle() {
    setSaving(true);
    try {
      const payload = {
        ...vForm,
        features: vForm.features.filter(Boolean),
      };
      delete (payload as Record<string, unknown>).id;
      const isEdit = !!vForm.id;
      const res = await fetch(
        isEdit
          ? `/api/admin/cab/vehicles/${vForm.id}`
          : "/api/admin/cab/vehicles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success("Saved");
        setVSheet(false);
        fetchAll();
      } else toast.error("Failed");
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  }

  async function saveRoute() {
    setSaving(true);
    try {
      const payload = { ...rForm };
      delete (payload as Record<string, unknown>).id;
      const isEdit = !!rForm.id;
      const res = await fetch(
        isEdit ? `/api/admin/cab/routes/${rForm.id}` : "/api/admin/cab/routes",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success("Saved");
        setRSheet(false);
        fetchAll();
      } else toast.error("Failed");
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(
        `/api/admin/cab/${
          deleteTarget.type === "vehicle" ? "vehicles" : "routes"
        }/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      toast.success("Deleted");
      fetchAll();
    } catch {
      toast.error("Failed");
    } finally {
      setDeleteTarget(null);
    }
  }

  const vehicleColumns: EntityColumn<VehicleData>[] = [
    {
      key: "vehicle",
      header: "Vehicle",
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={v.image}
              alt=""
              className="h-9 w-14 rounded-md object-cover"
            />
          )}
          <p className="text-sm font-medium">{v.name}</p>
        </div>
      ),
    },
    {
      key: "model",
      header: "Model",
      cell: (v) => <span className="text-sm">{v.model}</span>,
    },
    {
      key: "capacity",
      header: "Capacity",
      cell: (v) => <span className="text-sm">{v.capacity}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (v) => (
        <Badge variant={v.isActive ? "default" : "secondary"}>
          {v.isActive ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (v) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setVForm({ ...v, features: v.features ?? [] });
              setVSheet(true);
            }}
          >
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() =>
              setDeleteTarget({ type: "vehicle", id: v.id! })
            }
          >
            <RiDeleteBinLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const routeColumns: EntityColumn<RouteData>[] = [
    {
      key: "route",
      header: "Route",
      cell: (r) => (
        <span className="text-sm font-medium">
          {r.fromCity} → {r.toCity}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (r) => <span className="text-sm">{r.price}</span>,
    },
    {
      key: "duration",
      header: "Duration",
      cell: (r) => <span className="text-sm">{r.duration}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <Badge variant={r.isActive ? "default" : "secondary"}>
          {r.isActive ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRForm(r);
              setRSheet(true);
            }}
          >
            <RiEditLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget({ type: "route", id: r.id! })}
          >
            <RiDeleteBinLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const vehicleSections: EntitySheetSection[] = [
    {
      id: "content",
      label: "Details",
      icon: RiArticleLine,
      content: (
        <div className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Name" required>
              <Input
                value={vForm.name}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Premium SUV"
              />
            </Field>
            <Field label="Model" required>
              <Input
                value={vForm.model}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, model: e.target.value }))
                }
                placeholder="Toyota Innova Crysta"
              />
            </Field>
            <Field label="Capacity">
              <Input
                value={vForm.capacity}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, capacity: e.target.value }))
                }
                placeholder="6-7 Passengers"
              />
            </Field>
            <Field label="Ideal For">
              <Input
                value={vForm.ideal}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, ideal: e.target.value }))
                }
                placeholder="Family trips"
              />
            </Field>
          </FieldGrid>
          <Field label="Features">
            <ListEditor
              value={vForm.features}
              onChange={(v) =>
                setVForm((f) => ({ ...f, features: v }))
              }
              placeholder="e.g. Leather seats"
              addLabel="Add feature"
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
        <Field label="Vehicle Image">
          <ImageUpload
            value={vForm.image}
            onChange={(url) => setVForm((f) => ({ ...f, image: url }))}
            folder="cab"
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
          description="Hide from the public site without deleting."
          checked={vForm.isActive}
          onCheckedChange={(v) =>
            setVForm((f) => ({ ...f, isActive: v }))
          }
        />
      ),
    },
  ];

  const routeSections: EntitySheetSection[] = [
    {
      id: "content",
      label: "Route",
      icon: RiRoadMapLine,
      content: (
        <FieldGrid cols={2}>
          <Field label="From City" required>
            <Input
              value={rForm.fromCity}
              onChange={(e) =>
                setRForm((f) => ({ ...f, fromCity: e.target.value }))
              }
              placeholder="Chandigarh"
            />
          </Field>
          <Field label="To City" required>
            <Input
              value={rForm.toCity}
              onChange={(e) =>
                setRForm((f) => ({ ...f, toCity: e.target.value }))
              }
              placeholder="Manali"
            />
          </Field>
          <Field label="Price">
            <Input
              value={rForm.price}
              onChange={(e) =>
                setRForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="Starts from ₹4,500"
            />
          </Field>
          <Field label="Duration">
            <Input
              value={rForm.duration}
              onChange={(e) =>
                setRForm((f) => ({ ...f, duration: e.target.value }))
              }
              placeholder="8-9 Hours"
            />
          </Field>
        </FieldGrid>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: RiSettings4Line,
      content: (
        <ToggleRow
          label="Active"
          checked={rForm.isActive}
          onCheckedChange={(v) =>
            setRForm((f) => ({ ...f, isActive: v }))
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cab Services"
        description="Manage fleet vehicles and intercity transfer routes."
      />

      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles" className="gap-1.5">
            <RiTaxiLine className="h-4 w-4" /> Vehicles
          </TabsTrigger>
          <TabsTrigger value="routes" className="gap-1.5">
            <RiRoadMapLine className="h-4 w-4" /> Routes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setVForm(emptyVehicle);
                setVSheet(true);
              }}
              className="gap-2"
            >
              <RiAddLine className="h-4 w-4" /> Add Vehicle
            </Button>
          </div>
          <EntityTable
            data={vehicles}
            columns={vehicleColumns}
            loading={loading}
            rowKey={(v) => v.id ?? v.name}
            emptyTitle="No vehicles yet"
            emptyDescription="Add your first vehicle to feature it on the cab page."
          />
        </TabsContent>

        <TabsContent value="routes" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setRForm(emptyRoute);
                setRSheet(true);
              }}
              className="gap-2"
            >
              <RiAddLine className="h-4 w-4" /> Add Route
            </Button>
          </div>
          <EntityTable
            data={routes}
            columns={routeColumns}
            loading={loading}
            rowKey={(r) => r.id ?? `${r.fromCity}-${r.toCity}`}
            emptyTitle="No routes yet"
            emptyDescription="Add your first transfer route."
          />
        </TabsContent>
      </Tabs>

      <EntitySheet
        open={vSheet}
        onOpenChange={setVSheet}
        title={vForm.id ? "Edit Vehicle" : "Add Vehicle"}
        sections={vehicleSections}
        saving={saving}
        saveLabel={vForm.id ? "Save changes" : "Add vehicle"}
        onSave={saveVehicle}
        width="sm:!max-w-[50vw] sm:!w-[50vw]"
      />

      <EntitySheet
        open={rSheet}
        onOpenChange={setRSheet}
        title={rForm.id ? "Edit Route" : "Add Route"}
        sections={routeSections}
        saving={saving}
        saveLabel={rForm.id ? "Save changes" : "Add route"}
        onSave={saveRoute}
        width="sm:!max-w-[50vw] sm:!w-[50vw]"
      />

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete this item?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
