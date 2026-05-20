"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RiSaveLine, RiGlobalLine, RiLayoutTopLine, RiContactsLine, RiInformationLine, RiCustomerService2Line } from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";
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

  const updateSetting = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Site Settings"
        description="Manage global content, contact details and per-page hero copy."
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <RiSaveLine className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="home">Home & Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiContactsLine /> Contact Information</CardTitle>
              <CardDescription>Primary contact details used across the site</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input value={settings.site_name || ""} onChange={(e) => updateSetting("site_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={settings.site_phone || ""} onChange={(e) => updateSetting("site_phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={settings.site_whatsapp || ""} onChange={(e) => updateSetting("site_whatsapp", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={settings.site_email || ""} onChange={(e) => updateSetting("site_email", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address</Label>
                <Input value={settings.site_address || ""} onChange={(e) => updateSetting("site_address", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiInformationLine /> Social Media & Misc</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input value={settings.site_instagram || ""} onChange={(e) => updateSetting("site_instagram", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input value={settings.site_facebook || ""} onChange={(e) => updateSetting("site_facebook", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input value={settings.site_youtube || ""} onChange={(e) => updateSetting("site_youtube", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Site Tagline</Label>
                <Input value={settings.site_tagline || ""} onChange={(e) => updateSetting("site_tagline", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiLayoutTopLine /> Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Headline</Label>
                <Input value={settings.hero_headline || ""} onChange={(e) => updateSetting("hero_headline", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Hero Subheadline</Label>
                <Textarea value={settings.hero_subheadline || ""} onChange={(e) => updateSetting("hero_subheadline", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary CTA Text</Label>
                  <Input value={settings.hero_cta_text || ""} onChange={(e) => updateSetting("hero_cta_text", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Text (Call)</Label>
                  <Input value={settings.hero_cta_call || ""} onChange={(e) => updateSetting("hero_cta_call", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiInformationLine /> About Section (Homepage/About)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Who We Are</Label>
                <Textarea rows={6} value={settings.about_who_we_are || ""} onChange={(e) => updateSetting("about_who_we_are", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Trust Factors (JSON)</Label>
                <CardDescription className="mb-2">JSON array of trust factors for the About page</CardDescription>
                <Textarea rows={6} className="font-mono text-xs" value={settings.about_trust_us_json || ""} onChange={(e) => updateSetting("about_trust_us_json", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Why Choose Himvigo (Homepage Features)</CardTitle>
              <CardDescription>
                The cards shown in the homepage &ldquo;Why Choose Himvigo&rdquo;
                section now live on their own page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/admin/why-choose-us"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Open Why Choose Us editor →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bottom Call-to-Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CTA Headline</Label>
                <Input value={settings.bottom_cta_headline || ""} onChange={(e) => updateSetting("bottom_cta_headline", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CTA Subheadline</Label>
                <Textarea value={settings.bottom_cta_subheadline || ""} onChange={(e) => updateSetting("bottom_cta_subheadline", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Button Text (Quote)</Label>
                <Input value={settings.bottom_cta_quote || ""} onChange={(e) => updateSetting("bottom_cta_quote", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiCustomerService2Line /> Service Descriptions</CardTitle>
              <CardDescription>Update text for your primary business areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tour Packages Description</Label>
                <Textarea rows={4} value={settings.service_packages_desc || ""} onChange={(e) => updateSetting("service_packages_desc", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cab Services Description</Label>
                <Textarea rows={4} value={settings.service_cab_desc || ""} onChange={(e) => updateSetting("service_cab_desc", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tempo Traveller Description</Label>
                <Textarea rows={4} value={settings.service_tempo_desc || ""} onChange={(e) => updateSetting("service_tempo_desc", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Custom Plans Description</Label>
                <Textarea rows={4} value={settings.service_custom_desc || ""} onChange={(e) => updateSetting("service_custom_desc", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RiGlobalLine /> Page Meta Titles & Descriptions</CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold border-b pb-1">Homepage</h3>
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input value={settings.seo_home_title || ""} onChange={(e) => updateSetting("seo_home_title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea value={settings.seo_home_description || ""} onChange={(e) => updateSetting("seo_home_description", e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold border-b pb-1">Cab Services Page</h3>
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input value={settings.seo_cab_title || ""} onChange={(e) => updateSetting("seo_cab_title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea value={settings.seo_cab_description || ""} onChange={(e) => updateSetting("seo_cab_description", e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold border-b pb-1">Tour Packages Page</h3>
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input value={settings.seo_packages_title || ""} onChange={(e) => updateSetting("seo_packages_title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea value={settings.seo_packages_description || ""} onChange={(e) => updateSetting("seo_packages_description", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
