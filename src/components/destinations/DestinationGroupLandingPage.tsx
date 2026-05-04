"use client";

import { Compass, Star, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Destination {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
}

interface DestinationGroupLandingPageProps {
  groupName: string;
  destinations: Destination[];
  description?: string;
}

export default function DestinationGroupLandingPage({ groupName, destinations, description }: DestinationGroupLandingPageProps) {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center pt-24 bg-brand-blue overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" 
            alt={groupName} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 to-brand-blue z-[1]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full text-center">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-md bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Compass className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" /> Curated Destinations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-outfit font-extrabold text-white mb-6 drop-shadow-xl"
          >
            {groupName}
          </motion.h1>
          {description && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium prose prose-invert prose-slate"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((dest) => (
            <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
               <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2">{dest.tagline}</p>
                <h3 className="text-3xl font-outfit font-extrabold text-white mb-4">{dest.name}</h3>
                <div className="flex items-center text-white/80 font-bold text-sm group-hover:text-white transition-colors">
                  Explore Destination <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Compass className="w-20 h-20 text-slate-300 mx-auto mb-8" />
            <p className="text-slate-500 font-bold text-2xl italic">No destinations found in this group.</p>
          </div>
        )}
      </section>
    </main>
  );
}
