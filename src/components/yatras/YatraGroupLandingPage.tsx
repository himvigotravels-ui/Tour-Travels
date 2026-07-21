"use client";

import { PackageCard, TourPackage } from "@/components/ui/PackageCard";
import { Landmark, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface YatraGroupLandingPageProps {
  title: string;
  packages: TourPackage[];
  description?: string;
  tagline?: string;
  coverImage?: string;
  destinationNames?: string[];
}

export default function YatraGroupLandingPage({
  title,
  packages,
  description,
  tagline,
  coverImage,
  destinationNames = [],
}: YatraGroupLandingPageProps) {
  const heroImage =
    coverImage ||
    packages[0]?.imageUrls?.[0] ||
    "/images/destinations/kinnaur.png";

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-end pb-16 md:pb-24 pt-32 bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30 z-[1]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full mt-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/yatras"
              className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-inter text-sm md:text-base font-semibold mb-6 transition-colors group drop-shadow-md"
            >
              Yatras
              <ChevronRight className="w-4 h-4 mx-1 group-hover:translate-x-1 transition-transform" />
              <span className="text-slate-100 font-normal">{title}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-md bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] mb-5">
              <Landmark className="w-3.5 h-3.5 text-brand-orange" />
              {tagline || "Sacred Pilgrimage Journeys"}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-extrabold text-white mb-6 drop-shadow-xl leading-[1.1]">
              {title}
            </h1>
            {description ? (
              <div
                className="text-lg md:text-2xl text-slate-200 max-w-3xl font-medium drop-shadow-lg leading-relaxed prose prose-invert prose-slate"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-lg md:text-2xl text-slate-200 max-w-3xl font-medium drop-shadow-lg leading-relaxed">
                {destinationNames.length > 0
                  ? `Guided pilgrimage yatras across ${destinationNames.join(", ")} — trusted arrangements, experienced guides and comfortable stays.`
                  : "Hand-crafted pilgrimage yatras with trusted arrangements, experienced guides and comfortable stays."}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Yatras Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue">
              Pilgrimage Yatras
            </h2>
            <div className="h-1.5 w-24 bg-brand-orange mt-6 rounded-full" />
            <p className="text-slate-600 mt-6 font-inter text-lg">
              Explore our most sought-after yatra itineraries{" "}
              {destinationNames.length > 0
                ? `in ${destinationNames.join(", ")}`
                : ""}
              , curated with care for devotees.
            </p>
          </div>
          {packages.length > 0 && (
            <p className="bg-white px-6 py-2 rounded-full border border-slate-200 font-bold text-slate-500 shadow-sm self-start md:self-auto">
              {packages.length} Yatra{packages.length === 1 ? "" : "s"} Found
            </p>
          )}
        </div>

        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} tour={pkg} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner group">
            <Sparkles className="w-20 h-20 text-slate-300 mx-auto mb-8 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-slate-500 font-bold text-2xl italic font-outfit">
              No yatras available in this group yet.
            </p>
            <p className="text-slate-400 mt-2 font-medium">
              We can arrange a custom pilgrimage just for you!
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center justify-center bg-brand-blue text-white font-bold px-10 py-4 rounded-2xl hover:bg-brand-blue/90 transition-all shadow-xl"
            >
              Plan a Custom Yatra
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
