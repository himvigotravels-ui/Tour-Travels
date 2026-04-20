"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RiSettings4Line, RiSaveLine } from "react-icons/ri";

const settingFields = [
  { key: "site_name", label: "Site Name", placeholder: "Himvigo Tours" },
  { key: "site_phone", label: "Phone Number", placeholder: "+91 70183 18824" },
  { key: "site_email", label: "Email", placeholder: "explore@himvigo.in" },
  { key: "site_address", label: "Address", placeholder: "Mall Road, Manali" },
  { key: "site_whatsapp", label: "WhatsApp Number", placeholder: "+917018318824" },
  { key: "site_instagram", label: "Instagram URL", placeholder: "https://instagram.com/himvigo" },
  { key: "site_facebook", label: "Facebook URL", placeholder: "https://facebook.com/himvigo" },
  { key: "site_youtube", label: "YouTube URL", placeholder: "" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) toast.success("Settings saved!"); else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><RiSettings4Line className="w-8 h-8" /> Site Settings</h1><p className="text-muted-foreground mt-1">Global settings for the website</p></div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><RiSaveLine className="w-4 h-4" /> {saving ? "Saving..." : "Save"}</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {settingFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input value={settings[field.key] || ""} onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))} placeholder={field.placeholder} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
