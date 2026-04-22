"use client";

import { TourPackage } from "@/components/ui/PackageCard";
import { 
  Clock, MapPin, Users, Car, Check, X, Star, Calendar, ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { BookingForm } from "./BookingForm";
import { motion } from "framer-motion";

interface PackageDetailClientProps {
  pkg: TourPackage;
}

export default function PackageDetailClient({ pkg }: PackageDetailClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Dynamic Hero Banner */}
      <section className="relative w-full h-[70vh] min-h-[550px] flex items-end pb-20 bg-forest-900 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={pkg.imageUrls[0]} 
            alt={pkg.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/30 z-[1]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/packages" className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-inter text-sm md:text-base font-semibold mb-6 transition-colors group drop-shadow-md">
              Packages <ChevronRight className="w-4 h-4 mx-1 group-hover:translate-x-1 transition-transform" /> <span className="text-slate-200 font-normal">{pkg.title}</span>
            </Link>
          </motion.div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div className="max-w-4xl">
                <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 py-1.5 px-3 rounded-md bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4"
              >
                <Star className="w-3 h-3 fill-brand-orange" /> Bestseller
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-outfit font-extrabold text-white mb-6 drop-shadow-xl leading-[1.1]"
              >
                {pkg.title}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center text-slate-100 font-medium bg-white/10 px-5 py-2.5 rounded-full border border-white/20 shadow-lg font-inter">
                  <MapPin className="w-5 h-5 mr-2 text-brand-orange" />
                  {pkg.location}
                </div>
                <div className="flex items-center text-slate-100 font-medium bg-white/10 px-5 py-2.5 rounded-full border border-white/20 shadow-lg font-inter">
                  <Clock className="w-5 h-5 mr-2 text-brand-orange" />
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden lg:flex flex-col items-end"
            >
              <p className="text-slate-300 text-sm font-medium mb-1 drop-shadow-md">Excellent Reviews</p>
              <div className="flex text-brand-orange mb-2 drop-shadow-md">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full flex flex-col lg:flex-row gap-12 relative -mt-8">
        
        {/* Main Content Column */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* Quick Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-200"
          >
            {[
              { icon: Users, label: "Group Size", value: `Up to ${pkg.maxOccupancy} px` },
              { icon: Car, label: "Vehicle", value: pkg.vehicleType },
              { icon: Clock, label: "Duration", value: `${pkg.durationDays}D / ${pkg.durationNights}N` },
              { icon: Star, label: "Rating", value: "4.9/5 Excellent" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col">
                <span className="text-slate-400 text-sm font-medium mb-1 flex items-center">
                  <stat.icon className="w-4 h-4 mr-1 text-brand-blue"/> {stat.label}
                </span>
                <span className="text-slate-900 font-bold font-outfit">{stat.value}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200"
          >
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-brand-blue rounded-full mr-3"></div>
              Tour Overview
            </h2>
            <p className="text-slate-600 font-inter leading-relaxed text-lg">
              {pkg.description || "Get ready for an incredible adventure in Himachal Pradesh..."}
            </p>
          </motion.div>

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200"
            >
              <h2 className="text-2xl md:text-3xl font-bold font-outfit text-slate-900 mb-10 flex items-center">
                <div className="w-2 h-8 bg-brand-orange rounded-full mr-4"></div>
                Detailed Itinerary
              </h2>
              
              <div className="relative border-l-2 border-slate-100 ml-3 md:ml-6 pb-4">
                {pkg.itinerary.map((day, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-8 md:pl-12 py-6 group"
                  >
                    {/* Circle marker */}
                    <div className="absolute left-[-1.1rem] top-8 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-brand-blue text-slate-50 font-bold text-sm shadow-sm ring-1 ring-slate-100 transition-transform duration-300 group-hover:bg-brand-orange group-hover:scale-110">
                      {day.day}
                    </div>
                    
                    <div className="bg-slate-50/50 group-hover:bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-slate-200">
                      <div className="flex flex-col mb-4">
                        <span className="text-brand-orange font-extrabold text-xs md:text-sm uppercase tracking-widest mb-2 block">
                          Day {day.day}
                        </span>
                        <h3 className="font-outfit font-bold text-slate-900 text-xl md:text-2xl leading-snug">
                          {day.title}
                        </h3>
                      </div>
                      <div className="w-12 h-1 bg-brand-blue/10 rounded-full mb-5 group-hover:bg-brand-orange/40 transition-colors duration-300"></div>
                      <p className="text-slate-600 font-inter text-base leading-relaxed">
                        {day.activities}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-blue/5 p-8 rounded-3xl border border-brand-blue/10"
            >
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
                <Check className="w-6 h-6 text-brand-blue mr-2 bg-brand-blue/10 p-1 rounded-full" />
                What&apos;s Included
              </h3>
              <ul className="space-y-4">
                {pkg.inclusions?.map((inc, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-brand-blue mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-inter">{inc}</span>
                  </li>
                )) || <li className="text-slate-500 italic">No inclusions specified.</li>}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-red-50/50 p-8 rounded-3xl border border-red-100"
            >
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
                <X className="w-6 h-6 text-red-500 mr-2 bg-red-100 p-1 rounded-full" />
                What&apos;s Excluded
              </h3>
              <ul className="space-y-4">
                {pkg.exclusions?.map((exc, i) => (
                  <li key={i} className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-inter">{exc}</span>
                  </li>
                )) || <li className="text-slate-500 italic">No exclusions specified.</li>}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="w-full lg:w-1/3">
          <BookingForm price={pkg.pricePerPerson} />
        </div>

      </section>
    </main>
  );
}
