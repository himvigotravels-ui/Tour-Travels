"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Users, CarFront, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export type TourPackage = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price_per_person: number;
  duration_days: number;
  duration_nights: number;
  image_urls: string[];
  vehicle_type: string;
  max_occupancy: number;
  description?: string;
  itinerary?: { day: number; title: string; activities: string }[];
  inclusions?: string[];
  exclusions?: string[];
  categories?: string[];
};

export const PackageCard = ({ tour }: { tour: TourPackage }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 border border-slate-100/50"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={tour.image_urls[0] || "/placeholder-mountain.png"}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-5 left-5 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-forest-800" />
          <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">{tour.location}</span>
        </div>
      </div>

      <div className="p-5 md:p-8 flex flex-col flex-grow">
        <h3 className="font-outfit text-xl md:text-2xl font-extrabold text-slate-900 mb-3 md:mb-4 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
          {tour.title}
        </h3>
        
        <div className="flex flex-wrap items-center text-xs md:text-[13px] font-bold text-slate-500 mb-5 md:mb-6 font-inter tracking-wide gap-x-2 gap-y-1.5">
          <div className="flex items-center gap-1 md:gap-1.5">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
            <span>{tour.duration_days}D / {tour.duration_nights}N</span>
          </div>
          <span className="text-slate-300 hidden min-[360px]:inline">•</span>
          <div className="flex items-center gap-1 md:gap-1.5">
            <CarFront className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
            <span className="truncate max-w-[100px]">{tour.vehicle_type}</span>
          </div>
          <span className="text-slate-300 hidden min-[360px]:inline">•</span>
          <div className="flex items-center gap-1 md:gap-1.5">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
            <span>{tour.max_occupancy} pax</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-2xl font-black text-slate-900 font-outfit">
              ₹{tour.price_per_person.toLocaleString('en-IN')}
            </p>
          </div>
          <Link 
            href={`/packages/${tour.slug}`}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 font-outfit text-sm shadow-md hover:shadow-amber-500/30 hover:-translate-y-1 group/btn"
          >
            Explore <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
