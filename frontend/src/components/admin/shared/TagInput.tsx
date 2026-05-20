"use client";

import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RiCloseLine } from "react-icons/ri";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
}: Props) {
  const [input, setInput] = useState("");

  function commit() {
    const v = input.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="rounded-md border border-input bg-background px-2 py-2 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex flex-wrap items-center gap-1">
        {value.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="gap-1 pl-2 pr-1 font-normal"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== t))}
              className="ml-1 rounded-sm hover:bg-foreground/10"
            >
              <RiCloseLine className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={value.length ? "" : placeholder}
          className="h-6 flex-1 min-w-[120px] border-0 px-1 py-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
