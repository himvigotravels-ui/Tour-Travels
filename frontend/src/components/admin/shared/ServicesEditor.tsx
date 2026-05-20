"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCloseLine,
} from "react-icons/ri";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Field } from "./Field";

export interface ServiceItem {
  title: string;
  description: string;
  image: string;     // background photo for the card
  icon: string;      // small icon image (uploaded)
  ctaLabel: string;
  ctaHref: string;
  accent: "blue" | "orange";
}

interface Props {
  value: ServiceItem[];
  onChange: (next: ServiceItem[]) => void;
}

export function ServicesEditor({ value, onChange }: Props) {
  function add() {
    onChange([
      ...value,
      {
        title: "",
        description: "",
        image: "",
        icon: "",
        ctaLabel: "Learn more",
        ctaHref: "/contact",
        accent: "blue",
      },
    ]);
  }

  function update<K extends keyof ServiceItem>(
    i: number,
    field: K,
    v: ServiceItem[K]
  ) {
    onChange(value.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...value];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
          No services yet. Add your first one to see it on the homepage.
        </p>
      )}

      {value.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-4 hover:border-foreground/20"
        >
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-md bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                #{i + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {s.title || "Untitled service"}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                aria-label="Move up"
              >
                <RiArrowUpLine className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
                aria-label="Move down"
              >
                <RiArrowDownLine className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => remove(i)}
                aria-label="Remove"
              >
                <RiCloseLine className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
              <Field label="Title" required>
                <Input
                  value={s.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="Tour Packages"
                />
              </Field>
              <Field label="Accent">
                <Select
                  value={s.accent}
                  onValueChange={(v) =>
                    update(i, "accent", v as "blue" | "orange")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Brand Blue</SelectItem>
                    <SelectItem value="orange">Brand Orange</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Description" required>
              <Textarea
                value={s.description}
                onChange={(e) => update(i, "description", e.target.value)}
                rows={3}
                placeholder="Short paragraph describing this service."
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="CTA label">
                <Input
                  value={s.ctaLabel}
                  onChange={(e) => update(i, "ctaLabel", e.target.value)}
                  placeholder="View packages"
                />
              </Field>
              <Field label="CTA link">
                <Input
                  value={s.ctaHref}
                  onChange={(e) => update(i, "ctaHref", e.target.value)}
                  placeholder="/packages"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Background photo"
                required
                hint="The hero image behind the card."
              >
                <ImageUpload
                  value={s.image}
                  onChange={(url) => update(i, "image", url)}
                  folder="services"
                />
              </Field>
              <Field
                label="Icon image"
                hint="Square PNG with transparent background works best."
              >
                <ImageUpload
                  value={s.icon}
                  onChange={(url) => update(i, "icon", url)}
                  folder="service-icons"
                />
              </Field>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={add}
        className="gap-1"
      >
        <RiAddLine className="h-4 w-4" /> Add service
      </Button>
    </div>
  );
}
