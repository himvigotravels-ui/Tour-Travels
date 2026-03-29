"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const destinations = [
  { name: "Spiti Valley", slug: "spiti-valley", img: "/hero-spiti.png", tag: "The Middle Land" },
  { name: "Manali", slug: "manali", img: "/placeholder-mountain.png", tag: "Valley of the Gods" },
  { name: "Kasol", slug: "kasol", img: "/kasol.png", tag: "Mini Israel" },
  { name: "Shimla", slug: "shimla", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80", tag: "Queen of Hills" },
  { name: "Dharamshala", slug: "dharamshala", img: "/dharamshala.png", tag: "Little Lhasa" },
];

export default function RegionSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch on arrows

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white tracking-tight">Explore by Region</h2>
          <div className="h-1.5 w-24 bg-amber-500 mt-5 rounded-full" />
        </div>
        
        {/* Custom Nav Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="custom-prev-btn p-3 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors cursor-pointer group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button className="custom-next-btn p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1.15}
        centeredSlides={false}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4 }
        }}
        navigation={{
          prevEl: ".custom-prev-btn",
          nextEl: ".custom-next-btn",
        }}
        autoplay={{ delay: 3500, disableOnInteraction: true }}
        loop={true}
        className="!overflow-visible" // Important for slidesPerView fraction
      >
        {destinations.map((dest, i) => (
          <SwiperSlide key={i} className="h-full">
            <Link href={`/destinations`} className="block w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl border border-white/10 select-none">
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors duration-500 z-10" />
              <img src={dest.img} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt={dest.name} />
              
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent flex flex-col justify-end p-6 md:p-8 transition-opacity duration-300">
                <span className="text-amber-400 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-2 md:mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-md">
                  {dest.tag}
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold font-outfit tracking-tight drop-shadow-lg text-white group-hover:text-amber-50 transition-colors">
                  {dest.name}
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Mobile nav indicator */}
      <div className="flex md:hidden justify-center items-center mt-8 w-full text-white/40 text-sm font-medium tracking-widest uppercase">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Swipe <ArrowRight className="w-3.5 h-3.5 ml-2" />
      </div>
    </div>
  );
}
