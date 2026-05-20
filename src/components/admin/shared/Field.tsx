import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  className,
  rightSlot,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-xs font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        {rightSlot}
      </div>
      {children}
      {hint && (
        <p className="text-[11px] leading-tight text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FieldGrid({
  children,
  cols = 2,
  className,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  const colsCls =
    cols === 3
      ? "sm:grid-cols-3"
      : cols === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-1";
  return (
    <div className={cn("grid grid-cols-1 gap-4", colsCls, className)}>
      {children}
    </div>
  );
}
