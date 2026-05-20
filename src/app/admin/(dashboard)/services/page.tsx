"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { RiSaveLine, RiInformationLine } from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import {
  ServicesEditor,
  ServiceItem,
} from "@/components/admin/shared/ServicesEditor";

function parseServices(raw?: string): ServiceItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ServiceItem[]) : [];
  } catch {
    return [];
  }
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) => {
        setServices(parseServices(s?.services_json));
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load services");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services_json: JSON.stringify(services) }),
      });
      if (res.ok) toast.success("Saved");
      else toast.error("Failed to save");
    } catch {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="What We Do"
        description="Cards shown in the homepage 'What We Do' / Our Services section."
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <RiSaveLine className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="flex items-start gap-3 py-4">
          <RiInformationLine className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-medium">
              Each service card uses a background photo + a small icon image.
            </p>
            <p className="mt-1 text-xs text-amber-800/80">
              Reorder cards using the up/down arrows. The first two cards
              appear larger on the homepage.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service cards</CardTitle>
          <CardDescription>
            Title, description, accent colour, CTA and the photo + icon used
            on the card. Changes go live as soon as you save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : (
            <ServicesEditor value={services} onChange={setServices} />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <RiSaveLine className="h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
