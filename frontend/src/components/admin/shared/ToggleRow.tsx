"use client";

import { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";

interface Props {
  label: string;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: Props) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/30">
      <div className="space-y-1">
        <div className="text-sm font-medium leading-none">{label}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
