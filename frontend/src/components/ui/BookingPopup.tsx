"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  RiCloseLine,
  RiSparkling2Line,
  RiArrowRightLine,
} from "react-icons/ri";

export interface BookingPopupConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image?: string;
  pages: string; // CSV of pathnames or "all" or "home"
  delaySeconds: number;
  showOnce: boolean; // session storage flag
  exitIntent: boolean;
  badge?: string;
}

const DISMISS_KEY = "himvigo_booking_popup_dismissed";

function pathnameMatches(rule: string, pathname: string): boolean {
  const r = rule.trim().toLowerCase();
  if (!r) return false;
  if (r === "all" || r === "*") return true;
  if (r === "home" || r === "/") return pathname === "/";
  // Allow exact or prefix matches starting with "/"
  const norm = r.startsWith("/") ? r : `/${r}`;
  return pathname === norm || pathname.startsWith(norm + "/");
}

export function BookingPopup({ config }: { config: BookingPopupConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  // Hide on admin routes always
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!config.enabled || isAdmin) return;

    const allowedRules = (config.pages || "all")
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const allowed =
      allowedRules.length === 0 ||
      allowedRules.some((rule) => pathnameMatches(rule, pathname));
    if (!allowed) return;

    if (config.showOnce && typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(DISMISS_KEY)) return;
      } catch {
        /* ignore storage errors */
      }
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let exitListener: ((e: MouseEvent) => void) | null = null;

    if (config.exitIntent) {
      exitListener = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setOpen(true);
          if (exitListener) {
            document.removeEventListener("mouseout", exitListener);
          }
        }
      };
      document.addEventListener("mouseout", exitListener);
    } else {
      const delay = Math.max(0, config.delaySeconds || 0) * 1000;
      timeoutId = setTimeout(() => setOpen(true), delay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (exitListener) document.removeEventListener("mouseout", exitListener);
    };
  }, [config, pathname, isAdmin]);

  function dismiss() {
    setOpen(false);
    if (config.showOnce && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }

  if (!config.enabled || isAdmin || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-popup-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close popup"
        onClick={dismiss}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 ring-1 ring-slate-200 shadow-sm transition-colors hover:bg-white hover:text-destructive"
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-5">
          {config.image && (
            <div className="relative h-44 sm:h-auto sm:col-span-2 bg-slate-200">
              <Image
                src={config.image}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>
          )}

          <div
            className={`flex flex-col p-6 sm:p-8 ${
              config.image ? "sm:col-span-3" : "sm:col-span-5"
            }`}
          >
            {config.badge && (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 mb-3">
                <RiSparkling2Line className="h-3 w-3 text-brand-orange" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                  {config.badge}
                </span>
              </div>
            )}
            <h3
              id="booking-popup-title"
              className="font-outfit text-2xl sm:text-3xl font-extrabold text-brand-blue leading-tight mb-3"
            >
              {config.title}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {config.subtitle}
            </p>
            <div className="mt-auto flex flex-col sm:flex-row items-stretch gap-3">
              <Link
                href={config.ctaHref || "/contact"}
                onClick={dismiss}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-brand-orange/90 hover:-translate-y-0.5"
              >
                {config.ctaText || "Get a free quote"}
                <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
