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
  RiShieldCheckLine,
  RiGroupLine,
  RiTrophyLine,
  RiCompass3Line,
  RiCarLine,
  RiCheckboxCircleLine,
  RiNavigationLine,
  RiStarSFill,
} from "react-icons/ri";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Field } from "./Field";

export interface FeatureItem {
  title: string;
  desc: string;
  /** Small icon image shown at the top of the card. Preferred. */
  iconImage?: string;
  /** Legacy: larger background image. Used as a fallback if iconImage is missing. */
  image: string;
  /** Legacy: Ri icon name. Used only if neither iconImage nor image is present. */
  icon?: string;
}

const ICON_CHOICES: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "RiShieldCheckLine", label: "Shield (verified)", icon: RiShieldCheckLine },
  { value: "RiGroupLine", label: "Group (people)", icon: RiGroupLine },
  { value: "RiTrophyLine", label: "Trophy (award)", icon: RiTrophyLine },
  { value: "RiCompass3Line", label: "Compass (explore)", icon: RiCompass3Line },
  { value: "RiCarLine", label: "Car (vehicle)", icon: RiCarLine },
  { value: "RiCheckboxCircleLine", label: "Check (booking)", icon: RiCheckboxCircleLine },
  { value: "RiNavigationLine", label: "Navigation", icon: RiNavigationLine },
  { value: "RiStarSFill", label: "Star", icon: RiStarSFill },
];

interface Props {
  value: FeatureItem[];
  onChange: (next: FeatureItem[]) => void;
}

export function FeaturesEditor({ value, onChange }: Props) {
  function add() {
    onChange([
      ...value,
      { title: "", desc: "", image: "", icon: "RiCompass3Line" },
    ]);
  }

  function update<K extends keyof FeatureItem>(
    i: number,
    field: K,
    v: FeatureItem[K]
  ) {
    onChange(value.map((f, idx) => (idx === i ? { ...f, [field]: v } : f)));
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
          No features yet. The first one you add will be the card that opens by
          default on the homepage.
        </p>
      )}

      {value.map((f, i) => {
        const Icon =
          ICON_CHOICES.find((c) => c.value === f.icon)?.icon || RiCompass3Line;
        return (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 hover:border-foreground/20"
          >
            <div className="flex items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-md bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                  #{i + 1}
                </span>
                {i === 0 && (
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                    Open by default
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {f.title || "Untitled"}
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
              <div className="space-y-3">
                <Field label="Title" required>
                  <Input
                    value={f.title}
                    onChange={(e) => update(i, "title", e.target.value)}
                    placeholder="Verified Drivers"
                  />
                </Field>
                <Field label="Description" required>
                  <Textarea
                    value={f.desc}
                    onChange={(e) => update(i, "desc", e.target.value)}
                    rows={3}
                    placeholder="Short description shown under the title."
                  />
                </Field>
                <Field
                  label="Fallback icon"
                  hint="Used if no icon image is uploaded."
                >
                  <Select
                    value={f.icon || "RiCompass3Line"}
                    onValueChange={(v) => update(i, "icon", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_CHOICES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-2">
                            <c.icon className="h-3.5 w-3.5" />
                            {c.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field
                label="Icon image"
                required
                hint="Square image (PNG/SVG). Shown as the card icon."
              >
                <ImageUpload
                  value={f.iconImage || f.image}
                  onChange={(url) => {
                    update(i, "iconImage", url);
                    // Keep legacy `image` mirrored so older renderers still work.
                    update(i, "image", url);
                  }}
                  folder="features"
                />
              </Field>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={add}
        className="gap-1"
      >
        <RiAddLine className="h-4 w-4" /> Add feature
      </Button>
    </div>
  );
}
