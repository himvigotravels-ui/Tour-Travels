"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BadgeOption {
  value: string;
  label: string;
}

interface Props {
  options: BadgeOption[];
  value: string[];
  onChange: (next: string[]) => void;
  emptyHint?: string;
  className?: string;
}

export function BadgeMultiSelect({
  options,
  value,
  onChange,
  emptyHint = "No options available.",
  className,
}: Props) {
  function toggle(v: string) {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  }

  if (options.length === 0) {
    return (
      <p className="text-[11px] text-muted-foreground">{emptyHint}</p>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <Badge
              variant={active ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-2.5 py-1 text-xs capitalize transition-colors",
                !active && "hover:bg-muted"
              )}
            >
              {o.label}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
