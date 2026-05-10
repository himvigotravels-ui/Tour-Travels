"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  RiSaveLine,
  RiGlobalLine,
  RiImageLine,
  RiShieldUserLine,
  RiArticleLine,
} from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Field, FieldGrid } from "@/components/admin/shared/Field";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PageSEO {
  slug: string;
  label: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

interface SiteSEO {
  siteName: string;
  defaultDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  twitterHandle: string;
  googleVerification: string;
  themeColor: string;
  backgroundColor: string;
  faviconSvg: string;
  faviconPng: string;
  appleIcon: string;
  manifestShortName: string;
}

const PAGES: { slug: string; label: string; path: string }[] = [
  { slug: "home", label: "Homepage", path: "/" },
  { slug: "packages", label: "All Packages", path: "/packages" },
  { slug: "treks", label: "Treks", path: "/treks" },
  { slug: "destinations", label: "Destinations", path: "/destinations" },
  { slug: "blog", label: "Blog", path: "/blog" },
  { slug: "cab", label: "Cab Services", path: "/cab" },
  { slug: "about", label: "About", path: "/about" },
  { slug: "contact", label: "Contact", path: "/contact" },
];

const emptySite: SiteSEO = {
  siteName: "",
  defaultDescription: "",
  defaultKeywords: "",
  defaultOgImage: "",
  twitterHandle: "",
  googleVerification: "",
  themeColor: "#f39e1e",
  backgroundColor: "#ffffff",
  faviconSvg: "",
  faviconPng: "",
  appleIcon: "",
  manifestShortName: "",
};

export default function SEOPage() {
  const [site, setSite] = useState<SiteSEO>(emptySite);
  const [pages, setPages] = useState<PageSEO[]>(
    PAGES.map((p) => ({
      ...p,
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data: Record<string, string> = await res.json();
        setSite({
          siteName: data.site_name || "",
          defaultDescription: data.seo_default_description || "",
          defaultKeywords: data.seo_default_keywords || "",
          defaultOgImage: data.seo_default_og_image || "",
          twitterHandle: data.seo_twitter_handle || "",
          googleVerification: data.seo_google_verification || "",
          themeColor: data.seo_theme_color || "#f39e1e",
          backgroundColor: data.seo_background_color || "#ffffff",
          faviconSvg: data.seo_favicon_svg || "",
          faviconPng: data.seo_favicon_png || "",
          appleIcon: data.seo_apple_icon || "",
          manifestShortName: data.seo_manifest_short_name || "",
        });
        setPages(
          PAGES.map((p) => ({
            ...p,
            title: data[`seo_${p.slug}_title`] || "",
            description: data[`seo_${p.slug}_description`] || "",
            keywords: data[`seo_${p.slug}_keywords`] || "",
            ogImage: data[`seo_${p.slug}_og_image`] || "",
          }))
        );
      } catch {
        toast.error("Failed to load SEO settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updatePage(slug: string, field: keyof PageSEO, value: string) {
    setPages((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data: Record<string, string> = {
        site_name: site.siteName,
        seo_default_description: site.defaultDescription,
        seo_default_keywords: site.defaultKeywords,
        seo_default_og_image: site.defaultOgImage,
        seo_twitter_handle: site.twitterHandle,
        seo_google_verification: site.googleVerification,
        seo_theme_color: site.themeColor,
        seo_background_color: site.backgroundColor,
        seo_favicon_svg: site.faviconSvg,
        seo_favicon_png: site.faviconPng,
        seo_apple_icon: site.appleIcon,
        seo_manifest_short_name: site.manifestShortName,
      };
      pages.forEach((p) => {
        data[`seo_${p.slug}_title`] = p.title;
        data[`seo_${p.slug}_description`] = p.description;
        data[`seo_${p.slug}_keywords`] = p.keywords;
        data[`seo_${p.slug}_og_image`] = p.ogImage;
      });
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast.success("SEO settings saved");
      else toast.error("Failed to save");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Settings"
        description="Manage site-wide branding, social meta, search-engine signals and per-page meta tags."
        actions={
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            <RiSaveLine className="h-4 w-4" />
            {saving ? "Saving..." : "Save all"}
          </Button>
        }
      />

      {/* Site-wide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RiGlobalLine className="h-4 w-4 text-brand-blue" />
            Site-wide
          </CardTitle>
          <CardDescription>
            Defaults used everywhere on the site. Per-page values override these.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <Field label="Site Name" hint="Used in <title> templates and OG site name.">
              <Input
                value={site.siteName}
                onChange={(e) =>
                  setSite((s) => ({ ...s, siteName: e.target.value }))
                }
                placeholder="Himvigo Tours"
              />
            </Field>
            <Field label="Manifest Short Name" hint="Shown under home-screen icon (≤12 chars).">
              <Input
                value={site.manifestShortName}
                onChange={(e) =>
                  setSite((s) => ({ ...s, manifestShortName: e.target.value }))
                }
                placeholder="Himvigo"
                maxLength={12}
              />
            </Field>
          </FieldGrid>
          <Field
            label="Default Description"
            hint="Falls back to this when a page doesn't set its own description."
          >
            <Textarea
              value={site.defaultDescription}
              onChange={(e) =>
                setSite((s) => ({ ...s, defaultDescription: e.target.value }))
              }
              rows={2}
              placeholder="Premium Himachal Pradesh tours, Spiti Valley packages, and Himalayan cab services."
            />
          </Field>
          <Field label="Default Keywords" hint="Comma-separated.">
            <Input
              value={site.defaultKeywords}
              onChange={(e) =>
                setSite((s) => ({ ...s, defaultKeywords: e.target.value }))
              }
              placeholder="himachal tours, spiti valley, manali packages"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Branding / Icons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RiImageLine className="h-4 w-4 text-brand-blue" />
            Branding &amp; Icons
          </CardTitle>
          <CardDescription>
            Upload custom icons to override the bundled defaults. Leave blank to use the file-based icons baked into the build.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGrid cols={3}>
            <Field
              label="Favicon (SVG, recommended)"
              hint="Square SVG. Used by modern browsers + Google search results."
            >
              <ImageUpload
                value={site.faviconSvg}
                onChange={(url) =>
                  setSite((s) => ({ ...s, faviconSvg: url }))
                }
                folder="branding"
              />
            </Field>
            <Field
              label="Favicon PNG (512×512)"
              hint="High-res PNG fallback for older clients."
            >
              <ImageUpload
                value={site.faviconPng}
                onChange={(url) =>
                  setSite((s) => ({ ...s, faviconPng: url }))
                }
                folder="branding"
              />
            </Field>
            <Field
              label="Apple Touch Icon (180×180)"
              hint="Used when the site is added to an iPhone home screen."
            >
              <ImageUpload
                value={site.appleIcon}
                onChange={(url) =>
                  setSite((s) => ({ ...s, appleIcon: url }))
                }
                folder="branding"
              />
            </Field>
          </FieldGrid>
          <FieldGrid cols={2}>
            <Field
              label="Theme Color"
              hint="Browser chrome / mobile address-bar tint. Hex value."
            >
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={site.themeColor}
                  onChange={(e) =>
                    setSite((s) => ({ ...s, themeColor: e.target.value }))
                  }
                  className="h-9 w-16 cursor-pointer p-1"
                />
                <Input
                  value={site.themeColor}
                  onChange={(e) =>
                    setSite((s) => ({ ...s, themeColor: e.target.value }))
                  }
                  placeholder="#f39e1e"
                />
              </div>
            </Field>
            <Field label="Background Color" hint="PWA splash background.">
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={site.backgroundColor}
                  onChange={(e) =>
                    setSite((s) => ({ ...s, backgroundColor: e.target.value }))
                  }
                  className="h-9 w-16 cursor-pointer p-1"
                />
                <Input
                  value={site.backgroundColor}
                  onChange={(e) =>
                    setSite((s) => ({ ...s, backgroundColor: e.target.value }))
                  }
                  placeholder="#ffffff"
                />
              </div>
            </Field>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Social / Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RiShieldUserLine className="h-4 w-4 text-brand-blue" />
            Social &amp; Search
          </CardTitle>
          <CardDescription>
            Default OG image, social handles and search-console verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field
            label="Default Open Graph Image (1200×630)"
            hint="Used as the social-share image when a page doesn't override it."
          >
            <ImageUpload
              value={site.defaultOgImage}
              onChange={(url) =>
                setSite((s) => ({ ...s, defaultOgImage: url }))
              }
              folder="branding"
            />
          </Field>
          <FieldGrid cols={2}>
            <Field label="Twitter Handle" hint="Including the @.">
              <Input
                value={site.twitterHandle}
                onChange={(e) =>
                  setSite((s) => ({ ...s, twitterHandle: e.target.value }))
                }
                placeholder="@himvigotours"
              />
            </Field>
            <Field
              label="Google Site Verification"
              hint="Token from Search Console (without the meta tag wrapper)."
            >
              <Input
                value={site.googleVerification}
                onChange={(e) =>
                  setSite((s) => ({ ...s, googleVerification: e.target.value }))
                }
                placeholder="8WFTUbPg…"
              />
            </Field>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Per-page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RiArticleLine className="h-4 w-4 text-brand-blue" />
            Per-page Meta
          </CardTitle>
          <CardDescription>
            Override title, description, keywords and OG image for each top-level page. Leave blank to inherit defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {pages.map((page) => (
            <div
              key={page.slug}
              className="rounded-lg border border-slate-200 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{page.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {page.path}
                  </p>
                </div>
              </div>
              <FieldGrid cols={2}>
                <Field label="Meta Title">
                  <Input
                    value={page.title}
                    onChange={(e) =>
                      updatePage(page.slug, "title", e.target.value)
                    }
                  />
                </Field>
                <Field label="Keywords">
                  <Input
                    value={page.keywords}
                    onChange={(e) =>
                      updatePage(page.slug, "keywords", e.target.value)
                    }
                  />
                </Field>
              </FieldGrid>
              <Field label="Meta Description">
                <Textarea
                  value={page.description}
                  onChange={(e) =>
                    updatePage(page.slug, "description", e.target.value)
                  }
                  rows={2}
                />
              </Field>
              <Field label="OG Image" hint="Per-page social-share override.">
                <ImageUpload
                  value={page.ogImage}
                  onChange={(url) => updatePage(page.slug, "ogImage", url)}
                  folder="seo"
                />
              </Field>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
