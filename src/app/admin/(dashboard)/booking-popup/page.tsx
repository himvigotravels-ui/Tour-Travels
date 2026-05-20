"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RiSaveLine, RiInformationLine, RiEyeLine } from "react-icons/ri";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Field, FieldGrid } from "@/components/admin/shared/Field";
import { ToggleRow } from "@/components/admin/shared/ToggleRow";
import { ImageUpload } from "@/components/admin/ImageUpload";

const FIELDS = [
  "booking_popup_enabled",
  "booking_popup_title",
  "booking_popup_subtitle",
  "booking_popup_cta_text",
  "booking_popup_cta_link",
  "booking_popup_image",
  "booking_popup_pages",
  "booking_popup_delay_seconds",
  "booking_popup_show_once",
  "booking_popup_exit_intent",
  "booking_popup_badge",
] as const;

type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  booking_popup_enabled: "false",
  booking_popup_title: "Plan your Himalayan getaway in 24 hours.",
  booking_popup_subtitle:
    "Tell us where you want to go and our local experts will craft a no-obligation quote for you.",
  booking_popup_cta_text: "Get a free quote",
  booking_popup_cta_link: "/contact",
  booking_popup_image: "",
  booking_popup_pages: "all",
  booking_popup_delay_seconds: "6",
  booking_popup_show_once: "true",
  booking_popup_exit_intent: "false",
  booking_popup_badge: "Limited slots",
};

export default function BookingPopupAdminPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: Settings) => {
        const merged = { ...DEFAULTS };
        for (const f of FIELDS) {
          if (s?.[f] !== undefined && s[f] !== null) merged[f] = s[f];
        }
        setSettings(merged);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  function update(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Settings = {};
      for (const f of FIELDS) payload[f] = settings[f] ?? "";
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        title="Booking Popup"
        description="Show a lead-capture popup to visitors browsing the public site."
        actions={
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <RiSaveLine className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading...
        </p>
      ) : (
        <div className="space-y-5">
          <Card>
            <CardContent className="pt-6">
              <ToggleRow
                label="Enable booking popup"
                description="When off, the popup never shows on the public site."
                checked={settings.booking_popup_enabled === "true"}
                onCheckedChange={(v) =>
                  update("booking_popup_enabled", v ? "true" : "false")
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Title, subtitle, image and the call-to-action button.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FieldGrid cols={2}>
                <Field label="Title" required>
                  <Input
                    value={settings.booking_popup_title}
                    onChange={(e) =>
                      update("booking_popup_title", e.target.value)
                    }
                    placeholder="Plan your Himalayan getaway in 24 hours."
                  />
                </Field>
                <Field
                  label="Eyebrow badge"
                  hint="Small chip shown above the title. Leave blank to hide."
                >
                  <Input
                    value={settings.booking_popup_badge}
                    onChange={(e) =>
                      update("booking_popup_badge", e.target.value)
                    }
                    placeholder="Limited slots"
                  />
                </Field>
              </FieldGrid>

              <Field label="Subtitle" required>
                <Textarea
                  rows={3}
                  value={settings.booking_popup_subtitle}
                  onChange={(e) =>
                    update("booking_popup_subtitle", e.target.value)
                  }
                />
              </Field>

              <FieldGrid cols={2}>
                <Field label="CTA text">
                  <Input
                    value={settings.booking_popup_cta_text}
                    onChange={(e) =>
                      update("booking_popup_cta_text", e.target.value)
                    }
                    placeholder="Get a free quote"
                  />
                </Field>
                <Field label="CTA link" hint="Internal path or full URL.">
                  <Input
                    value={settings.booking_popup_cta_link}
                    onChange={(e) =>
                      update("booking_popup_cta_link", e.target.value)
                    }
                    placeholder="/contact"
                  />
                </Field>
              </FieldGrid>

              <Field label="Side image" hint="Optional. Shown on the left of the popup.">
                <ImageUpload
                  value={settings.booking_popup_image}
                  onChange={(url) => update("booking_popup_image", url)}
                  folder="booking-popup"
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Where &amp; when to show</CardTitle>
              <CardDescription>
                Control which pages trigger the popup and when it appears.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field
                label="Pages"
                hint='Comma-separated. Use "all" for every page or "home" for only the homepage. Examples: "/packages, /destinations" matches those routes and any sub-pages.'
              >
                <Input
                  value={settings.booking_popup_pages}
                  onChange={(e) =>
                    update("booking_popup_pages", e.target.value)
                  }
                  placeholder="all"
                />
              </Field>

              <FieldGrid cols={2}>
                <Field
                  label="Delay (seconds)"
                  hint="Wait this long before showing the popup. Ignored if exit-intent is on."
                >
                  <Input
                    type="number"
                    min={0}
                    max={120}
                    value={settings.booking_popup_delay_seconds}
                    onChange={(e) =>
                      update(
                        "booking_popup_delay_seconds",
                        e.target.value
                      )
                    }
                  />
                </Field>
                <Field label="Behaviour">
                  <div className="space-y-2">
                    <ToggleRow
                      label="Exit-intent only"
                      description="Show only when the user moves their cursor toward closing the tab."
                      checked={settings.booking_popup_exit_intent === "true"}
                      onCheckedChange={(v) =>
                        update("booking_popup_exit_intent", v ? "true" : "false")
                      }
                    />
                    <ToggleRow
                      label="Show only once per session"
                      description="If a visitor dismisses the popup, don't show it again until they re-open the browser."
                      checked={settings.booking_popup_show_once === "true"}
                      onCheckedChange={(v) =>
                        update("booking_popup_show_once", v ? "true" : "false")
                      }
                    />
                  </div>
                </Field>
              </FieldGrid>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex items-start gap-3 py-4">
              <RiInformationLine className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium">
                  Test on the public site.
                </p>
                <p className="mt-1 text-xs text-amber-800/80">
                  After saving, open the site in a private window — the popup
                  honours the &ldquo;show once per session&rdquo; flag, so a
                  fresh window is the easiest way to preview it.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiEyeLine className="h-4 w-4" />
                Preview
              </CardTitle>
              <CardDescription>
                Approximate preview of how the popup will look.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-slate-900/5 ring-1 ring-slate-200 p-6">
                <div className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    {settings.booking_popup_image && (
                      <div
                        className="relative h-32 sm:h-auto sm:col-span-2 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${settings.booking_popup_image})`,
                        }}
                      />
                    )}
                    <div
                      className={`p-5 ${
                        settings.booking_popup_image
                          ? "sm:col-span-3"
                          : "sm:col-span-5"
                      }`}
                    >
                      {settings.booking_popup_badge && (
                        <span className="inline-block rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2">
                          {settings.booking_popup_badge}
                        </span>
                      )}
                      <h4 className="font-outfit text-lg font-extrabold text-brand-blue leading-tight mb-2">
                        {settings.booking_popup_title}
                      </h4>
                      <p className="text-xs text-slate-600 mb-3">
                        {settings.booking_popup_subtitle}
                      </p>
                      <span className="inline-block rounded-full bg-brand-orange px-3 py-1.5 text-xs font-bold text-white">
                        {settings.booking_popup_cta_text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <RiSaveLine className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
