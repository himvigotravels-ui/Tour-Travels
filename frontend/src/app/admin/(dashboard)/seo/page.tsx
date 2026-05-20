"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RiSaveLine } from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";

interface PageSEO { slug: string; label: string; title: string; description: string; keywords: string; }

const defaultPages: PageSEO[] = [
  { slug: "home", label: "Homepage", title: "Best Himachal Tour Packages | Himvigo Tours", description: "Premium Spiti Valley tours and Chandigarh to Manali cab services.", keywords: "himachal tours, spiti valley" },
  { slug: "packages", label: "All Packages", title: "Tour Packages | Himvigo Tours", description: "Browse all tour packages.", keywords: "tour packages" },
  { slug: "blog", label: "Blog", title: "Travel Blog | Himvigo Tours", description: "Travel stories and guides.", keywords: "travel blog" },
  { slug: "destinations", label: "Destinations", title: "Destinations | Himvigo Tours", description: "Explore Himachal destinations.", keywords: "destinations" },
  { slug: "cab", label: "Cab Services", title: "Cab Services | Himvigo Tours", description: "Book reliable cab services.", keywords: "cab, taxi" },
  { slug: "contact", label: "Contact", title: "Contact Us | Himvigo Tours", description: "Get in touch.", keywords: "contact" },
];

export default function SEOPage() {
  const [pages, setPages] = useState<PageSEO[]>(defaultPages);
  const [saving, setSaving] = useState(false);

  function updatePage(slug: string, field: keyof PageSEO, value: string) {
    setPages((prev) => prev.map((p) => p.slug === slug ? { ...p, [field]: value } : p));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data: Record<string, string> = {};
      pages.forEach((p) => { data[`seo_${p.slug}_title`] = p.title; data[`seo_${p.slug}_description`] = p.description; data[`seo_${p.slug}_keywords`] = p.keywords; });
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) toast.success("SEO saved!"); else toast.error("Failed");
    } catch { toast.error("Error"); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Settings"
        description="Manage meta tags for each top-level page."
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <RiSaveLine className="h-4 w-4" />
            {saving ? "Saving..." : "Save all"}
          </Button>
        }
      />
      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.slug}>
            <CardHeader className="pb-3"><CardTitle className="text-base">{page.label}</CardTitle><CardDescription className="text-xs">/{page.slug === "home" ? "" : page.slug}</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Title</Label><Input value={page.title} onChange={(e) => updatePage(page.slug, "title", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Meta Description</Label><Textarea value={page.description} onChange={(e) => updatePage(page.slug, "description", e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Keywords</Label><Input value={page.keywords} onChange={(e) => updatePage(page.slug, "keywords", e.target.value)} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
