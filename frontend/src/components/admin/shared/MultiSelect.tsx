"use client";

import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiCheckLine,
  RiCloseLine,
  RiSearchLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

interface Props {
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  selectedTitle?: string;
  noun?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Click to add items",
  emptyText = "No matches.",
  searchPlaceholder = "Search...",
  selectedTitle = "Selected",
  noun = "item",
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const optionMap = useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options]
  );

  const unselected = useMemo(
    () => options.filter((o) => !value.includes(o.value)),
    [options, value]
  );

  function toggle(v: string) {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  }

  function remove(v: string) {
    onChange(value.filter((x) => x !== v));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Trigger picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between font-normal"
          >
            <span className="flex items-center gap-2">
              <RiSearchLine className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {value.length > 0
                  ? `${value.length} ${noun}${value.length === 1 ? "" : "s"} selected`
                  : placeholder}
              </span>
            </span>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {options.length} available
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-[22rem]">
              <CommandEmpty>{emptyText}</CommandEmpty>

              {value.length > 0 && (
                <>
                  <CommandGroup heading={`${selectedTitle} (${value.length})`}>
                    {value.map((v) => {
                      const opt = optionMap.get(v);
                      if (!opt) return null;
                      return (
                        <CommandItem
                          key={v}
                          value={`✓ ${opt.label} ${opt.description ?? ""}`}
                          onSelect={() => toggle(v)}
                          className="flex items-center gap-3 py-2"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary bg-primary text-primary-foreground">
                            <RiCheckLine className="h-3.5 w-3.5" />
                          </div>
                          {opt.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={opt.imageUrl}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-md object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {opt.label}
                            </div>
                            {opt.description && (
                              <div className="truncate text-xs text-muted-foreground">
                                {opt.description}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              <CommandGroup
                heading={`Available (${unselected.length})`}
              >
                {unselected.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={`${opt.label} ${opt.description ?? ""}`}
                    onSelect={() => toggle(opt.value)}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-input bg-background" />
                    {opt.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={opt.imageUrl}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {opt.label}
                      </div>
                      {opt.description && (
                        <div className="truncate text-xs text-muted-foreground">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected list — ordered preview */}
      {value.length > 0 ? (
        <div className="rounded-lg border bg-muted/20">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span>Selected order</span>
              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                {value.length}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-muted-foreground hover:text-destructive"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y">
            {value.map((v, idx) => {
              const opt = optionMap.get(v);
              if (!opt)
                return (
                  <li
                    key={v}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"
                  >
                    Missing item
                    <button
                      type="button"
                      onClick={() => remove(v)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <RiCloseLine className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              return (
                <li
                  key={v}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-background/60"
                >
                  <Badge
                    variant="outline"
                    className="h-5 w-6 justify-center p-0 text-[10px] tabular-nums"
                  >
                    {idx + 1}
                  </Badge>
                  {opt.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={opt.imageUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{opt.label}</div>
                    {opt.description && (
                      <div className="truncate text-[11px] text-muted-foreground">
                        {opt.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <RiArrowUpLine className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <RiArrowDownLine className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <RiCloseLine className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          Nothing selected yet. Open the picker above and choose {noun}s.
        </div>
      )}
    </div>
  );
}
