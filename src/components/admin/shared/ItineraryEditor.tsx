"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RiAddLine,
  RiCloseLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";

export interface ItineraryItem {
  day: number;
  title: string;
  activities: string;
}

interface Props {
  value: ItineraryItem[];
  onChange: (next: ItineraryItem[]) => void;
}

function reseq(items: ItineraryItem[]): ItineraryItem[] {
  return items.map((it, i) => ({ ...it, day: i + 1 }));
}

export function ItineraryEditor({ value, onChange }: Props) {
  function add() {
    onChange([
      ...value,
      { day: value.length + 1, title: "", activities: "" },
    ]);
  }

  function update<K extends keyof ItineraryItem>(
    i: number,
    field: K,
    v: ItineraryItem[K]
  ) {
    onChange(value.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  }

  function remove(i: number) {
    onChange(reseq(value.filter((_, idx) => idx !== i)));
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...value];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange(reseq(next));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="text-[11px] text-muted-foreground">
          No itinerary days yet. Add one to get started.
        </p>
      )}
      {value.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-3 hover:border-foreground/20"
        >
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-md bg-primary/10 px-2 text-xs font-bold text-primary">
                Day {item.day}
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
              >
                <RiArrowDownLine className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => remove(i)}
              >
                <RiCloseLine className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Input
              value={item.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Day title (e.g. Arrival in Manali)"
              className="h-9"
            />
            <Textarea
              value={item.activities}
              onChange={(e) => update(i, "activities", e.target.value)}
              placeholder="What happens this day..."
              rows={2}
            />
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
        <RiAddLine className="h-4 w-4" /> Add day
      </Button>
    </div>
  );
}
