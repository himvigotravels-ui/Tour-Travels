"use client";

import { ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EntitySheetSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  content: ReactNode;
  badge?: ReactNode;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  sections: EntitySheetSection[];
  footerLeft?: ReactNode;
  saving?: boolean;
  saveLabel?: string;
  onSave: () => void;
  onCancel?: () => void;
  width?: string;
  defaultSection?: string;
}

export function EntitySheet({
  open,
  onOpenChange,
  title,
  description,
  sections,
  footerLeft,
  saving,
  saveLabel = "Save",
  onSave,
  onCancel,
  width = "sm:max-w-[64rem] lg:max-w-[72rem]",
  defaultSection,
}: Props) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.id);

  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "w-full overflow-hidden p-0 flex flex-col",
          width
        )}
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-xs">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex flex-1 min-h-0">
          {/* Vertical sidebar of sections */}
          <nav className="hidden sm:flex w-56 shrink-0 flex-col gap-0.5 border-r bg-muted/30 p-3 overflow-y-auto">
            {sections.map((s) => {
              const isActive = s.id === active;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.label}</span>
                      {s.badge}
                    </div>
                    {s.description && (
                      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground/80 line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Mobile section dropdown */}
          <div className="sm:hidden border-b bg-muted/30 p-2">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{current.label}</h2>
                {current.description && (
                  <p className="text-xs text-muted-foreground">
                    {current.description}
                  </p>
                )}
              </div>
              {current.content}
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t bg-background px-6 py-3">
          <div className="text-xs text-muted-foreground">{footerLeft}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => (onCancel ? onCancel() : onOpenChange(false))}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : saveLabel}
            </Button>
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
