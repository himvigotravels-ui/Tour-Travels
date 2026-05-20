"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  RiTwitterXLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiLinkedinBoxLine,
  RiLinksLine,
  RiCheckLine,
} from "react-icons/ri";

interface Props {
  title: string;
  /** Path beginning with "/", e.g. "/blog/foo". */
  path: string;
}

export function ShareButtons({ title, path }: Props) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? new URL(path, window.location.origin).toString()
      : `https://www.himvigo.com${path}`;
  const enc = encodeURIComponent;

  const targets = [
    {
      label: "Share on X / Twitter",
      icon: RiTwitterXLine,
      href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    },
    {
      label: "Share on Facebook",
      icon: RiFacebookCircleLine,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: "Share on WhatsApp",
      icon: RiWhatsappLine,
      href: `https://wa.me/?text=${enc(`${title} — ${url}`)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: RiLinkedinBoxLine,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className="flex flex-row md:flex-col items-center gap-2">
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.label}
          title={t.label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 shadow-sm transition-all hover:bg-brand-orange hover:text-white hover:ring-brand-orange hover:-translate-y-0.5"
        >
          <t.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        title="Copy link"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 shadow-sm transition-all hover:bg-brand-blue hover:text-white hover:ring-brand-blue hover:-translate-y-0.5"
      >
        {copied ? (
          <RiCheckLine className="h-4 w-4" />
        ) : (
          <RiLinksLine className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
