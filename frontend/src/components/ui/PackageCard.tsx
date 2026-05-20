"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  RiTimeLine,
  RiMapPinLine,
  RiGroupLine,
  RiCarLine,
  RiArrowRightUpLine,
  RiStarSFill,
  RiCheckLine,
  RiImageLine,
} from "react-icons/ri";
import { motion } from "framer-motion";

export type TourPackage = {
  id?: string;
  slug: string;
  title: string;
  location: string;
  pricePerPerson: number;
  durationDays: number;
  durationNights: number;
  imageUrls: string[];
  vehicleType: string;
  maxOccupancy: number;
  description?: string;
  itinerary?: { day: number; title: string; activities: string }[];
  inclusions?: string[];
  exclusions?: string[];
  categories?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

const categoryLabelMap: Record<string, string> = {
  adventure: "Adventure",
  family: "Family",
  honeymoon: "Honeymoon",
  spiritual: "Spiritual",
  cultural: "Cultural",
  offbeat: "Offbeat",
};

export const PackageCard = ({ tour }: { tour: TourPackage }) => {
  const [imgError, setImgError] = useState(false);
  const category = tour.categories?.[0];
  const categoryLabel = category
    ? categoryLabelMap[category] ?? category
    : null;
  const topInclusions = (tour.inclusions ?? []).slice(0, 3);
  const imageUrl = tour.imageUrls?.[0];
  const showImage = imageUrl && !imgError;

  return (
    <Link
      href={`/packages/${tour.slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 rounded-[2rem]"
    >
      <motion.article
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="group relative isolate flex aspect-[4/5] w-full flex-col overflow-hidden rounded-[2rem] bg-slate-900 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)]"
      >
        {/* IMAGE — fills entire card */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
          {showImage ? (
            <motion.div
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.08 },
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <Image
                src={imageUrl}
                alt={tour.title}
                fill
                unoptimized
                onError={() => setImgError(true)}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              <RiImageLine className="h-16 w-16" />
            </div>
          )}
          {/* Gradient veil for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/30" />
          {/* Subtle noise / glow for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
        </div>

        {/* TOP ROW — chips */}
        <div className="flex items-start justify-between gap-2 p-4 sm:p-5">
          {categoryLabel ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-md backdrop-blur">
              <RiStarSFill className="h-2.5 w-2.5 text-amber-500" />
              {categoryLabel}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/15 backdrop-blur">
            <RiTimeLine className="h-2.5 w-2.5" />
            {tour.durationDays}D / {tour.durationNights}N
          </span>
        </div>

        {/* SPACER */}
        <div className="flex-1" />

        {/* HOVER-REVEALED INCLUSIONS — above the glass panel */}
        {topInclusions.length > 0 && (
          <motion.div
            variants={{
              rest: { opacity: 0, y: 12 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="hidden px-4 pb-2 sm:block sm:px-5"
          >
            <div className="flex flex-wrap gap-1.5">
              {topInclusions.map((inc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/95 backdrop-blur"
                >
                  <RiCheckLine className="h-2.5 w-2.5 text-emerald-300" />
                  <span className="line-clamp-1 max-w-[8rem]">{inc}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* GLASS INFO PANEL */}
        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -2 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative m-3 mt-0 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:m-4 sm:mt-0 sm:p-5"
        >
          {/* Location strip */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
            <RiMapPinLine className="h-3 w-3" />
            <span className="text-slate-700 normal-case tracking-normal">
              {tour.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-outfit text-base font-bold leading-tight text-slate-900 line-clamp-2 sm:text-lg">
            {tour.title}
          </h3>

          {/* Specs strip */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1">
              <RiCarLine className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[7rem]">{tour.vehicleType}</span>
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="inline-flex items-center gap-1">
              <RiGroupLine className="h-3.5 w-3.5 text-slate-400" />
              {tour.maxOccupancy} pax
            </span>
          </div>

          {/* Footer — price + CTA */}
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-200/70 pt-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Starting from
              </p>
              <p className="font-outfit text-xl font-extrabold leading-none text-slate-900 sm:text-2xl">
                ₹{tour.pricePerPerson.toLocaleString("en-IN")}
                <span className="ml-1 text-[10px] font-medium text-slate-400">
                  /pp
                </span>
              </p>
            </div>

            <motion.span
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-900/30 transition-colors duration-300 group-hover:bg-brand-orange"
            >
              <span className="relative z-10">View</span>
              <RiArrowRightUpLine className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:rotate-45" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            </motion.span>
          </div>
        </motion.div>
      </motion.article>
    </Link>
  );
};
