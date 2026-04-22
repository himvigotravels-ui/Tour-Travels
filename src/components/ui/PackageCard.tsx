"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  RiTimeLine, 
  RiMapPinLine, 
  RiGroupLine, 
  RiCarLine, 
  RiArrowRightLine, 
  RiSparklingLine, 
  RiShieldCheckLine, 
  RiLandscapeLine 
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
};

const categoryLabelMap: Record<string, string> = {
  adventure: "Adventure Pick",
  family: "Family Favorite",
  honeymoon: "Romantic Escape",
  spiritual: "Soulful Route",
};

export const PackageCard = ({ tour }: { tour: TourPackage }) => {
  const category = tour.categories?.[0];
  const categoryLabel = category ? (categoryLabelMap[category] ?? "Signature Route") : "Signature Route";
  const highlights = [
    tour.itinerary?.[0]?.title,
    tour.itinerary?.[1]?.title,
    ...(tour.inclusions?.slice(0, 1) ?? []),
  ]
    .filter(Boolean)
    .slice(0, 2) as string[];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_14px_50px_-20px_rgba(15,23,42,0.22)] transition-all duration-500 hover:shadow-[0_28px_70px_-24px_rgba(26,58,42,0.3)]"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={tour.imageUrls[0] || "/placeholder-mountain.png"}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/75 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <RiMapPinLine className="h-3 w-3 text-forest-800" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-900 sm:text-[11px]">{tour.location}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-slate-950/65 px-3 py-1.5 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md">
            <RiSparklingLine className="h-3 w-3 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]">{categoryLabel}</span>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-white backdrop-blur-md">
            <RiLandscapeLine className="h-3 w-3 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]">Curated Himalayan Circuit</span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5 md:p-7">
        <div className="mb-5 min-h-[146px] rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-amber-50/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-forest-700">Best for</span>
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm sm:text-[11px]">
              <RiShieldCheckLine className="h-3 w-3 text-forest-700" />
              Verified stays & rides
            </div>
          </div>

          <div className="flex flex-wrap gap-2 content-start">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm sm:text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mb-3 min-h-[4.75rem] line-clamp-2 font-outfit text-[2rem] leading-[1.08] font-extrabold text-slate-900 transition-colors duration-300 group-hover:text-amber-600 md:min-h-[4.2rem] md:text-[2.45rem]">
          {tour.title}
        </h3>

        <p className="mb-5 min-h-[5.8rem] line-clamp-3 text-sm leading-relaxed text-slate-600 md:min-h-[5.7rem] md:text-[15px]">
          {tour.description}
        </p>

        <div className="mb-6 grid grid-cols-3 gap-2 text-xs font-bold tracking-wide text-slate-600 md:text-[13px]">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <RiTimeLine className="h-4 w-4 text-forest-700" />
            <span className="truncate">{tour.durationDays}D / {tour.durationNights}N</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <RiCarLine className="h-4 w-4 text-forest-700" />
            <span className="truncate">{tour.vehicleType}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <RiGroupLine className="h-4 w-4 text-forest-700" />
            <span>{tour.maxOccupancy} pax</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.26em] text-slate-400">Starting from</p>
            <p className="font-outfit text-3xl font-black text-slate-900">
              ₹{tour.pricePerPerson.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug text-slate-500">Per person, customizable on request</p>
          </div>

          <Link
            href={`/packages/${tour.slug}`}
            className="group/btn inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-outfit text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-500 hover:text-slate-900 hover:shadow-amber-500/30"
          >
            Explore <RiArrowRightLine className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
