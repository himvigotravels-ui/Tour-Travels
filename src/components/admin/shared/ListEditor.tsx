"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiAddLine, RiCloseLine } from "react-icons/ri";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  emptyHint?: string;
}

export function ListEditor({
  value,
  onChange,
  placeholder = "Add an item",
  addLabel = "Add item",
  emptyHint = "No items yet.",
}: Props) {
  const items = value.length === 0 ? [""] : value;

  function update(i: number, v: string) {
    const next = [...items];
    next[i] = v;
    onChange(next);
  }

  function add() {
    onChange([...value, ""]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-[11px] text-muted-foreground">{emptyHint}</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="group flex items-center gap-2">
          <span className="text-xs text-muted-foreground/50 w-4 text-right tabular-nums">
            {i + 1}.
          </span>
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="h-9"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => remove(i)}
            aria-label="Remove"
          >
            <RiCloseLine className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={add}
        className="gap-1"
      >
        <RiAddLine className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}
