"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiArrowRightUpLine } from "react-icons/ri";

interface Props {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  image: string;
  /** Optional icon image URL. If empty, the badge area is hidden. */
  iconImage?: string;
  accent: "blue" | "orange";
}

export function ServiceCard({
  title,
  description,
  href,
  ctaLabel,
  image,
  iconImage,
  accent,
}: Props) {
  const accentBg = accent === "blue" ? "bg-brand-blue" : "bg-brand-orange";
  const accentText = accent === "blue" ? "text-brand-blue" : "text-brand-orange";

  return (
    <Link
      href={href}
      className="group relative isolate flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 md:h-96"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {image && (
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/30 transition-opacity duration-500 group-hover:from-slate-950/95" />
      </div>

      {/* Top icon badge */}
      <div className="p-5 sm:p-7">
        {iconImage ? (
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accentBg} p-3 shadow-lg ring-1 ring-white/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconImage}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} text-white shadow-lg ring-1 ring-white/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}
          >
            <span className="text-lg font-extrabold">
              {title.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Bottom content */}
      <div className="p-5 sm:p-7">
        <h3 className="font-outfit text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 line-clamp-3 sm:text-[15px]">
          {description}
        </p>

        <div
          className={`mt-5 inline-flex items-center gap-2 ${accentText} font-bold text-sm bg-white rounded-full pl-4 pr-3 py-2 shadow-md transition-all duration-300 group-hover:gap-3 group-hover:shadow-xl`}
        >
          {ctaLabel}
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full ${accentBg} text-white transition-transform duration-300 group-hover:rotate-45`}
          >
            <RiArrowRightUpLine className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
