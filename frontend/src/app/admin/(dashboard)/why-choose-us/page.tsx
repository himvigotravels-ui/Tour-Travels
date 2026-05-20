"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RiSaveLine, RiInformationLine } from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { FeaturesEditor, FeatureItem } from "@/components/admin/shared/FeaturesEditor";

function parseFeatures(raw?: string): FeatureItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeatureItem[]) : [];
  } catch {
    return [];
  }
}

export default function WhyChooseUsAdminPage() {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) => {
        setFeatures(parseFeatures(s?.why_choose_us_json));
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load features");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ why_choose_us_json: JSON.stringify(features) }),
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
        title="Why Choose Us"
        description="Cards shown in the homepage 'Why Choose Himvigo' section."
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
              The first card is the one that opens by default on the homepage.
            </p>
            <p className="mt-1 text-xs text-amber-800/80">
              Reorder cards using the up/down arrows. Hovering on the homepage
              switches the active card to whichever the visitor points at.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature cards</CardTitle>
          <CardDescription>
            Each card has a title, short description, image and an icon.
            Changes are reflected on the homepage as soon as you save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : (
            <FeaturesEditor value={features} onChange={setFeatures} />
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
