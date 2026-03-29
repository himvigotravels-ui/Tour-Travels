"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Rahul Sharma", text: "The Spiti expedition was completely mind-blowing. The driver was highly experienced on dangerous roads and the homestays were incredibly warm.", pkg: "Spiti Valley Road Trip" },
  { name: "Priya Desai", text: "Booked a tempo traveller for my family of 10. Seamless experience from Chandigarh pickup to Manali drop. Highly recommended!", pkg: "Manali Premium Snow Retreat" },
  { name: "Arjun Mehta", text: "I wanted an offbeat track in Kinnaur, and HimachalTrek delivered. Local knowledge makes a huge difference.", pkg: "Custom Kinnaur Tour" },
  { name: "Samantha Lee", text: "Our Kasol trek was straight out of a movie. The organization was flawless, the guides were friendly and knew exactly where the best views were.", pkg: "Kasol & Kheerganga Backpacking" }
];

export default function TestimonialSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900">Traveler Stories</h2>
          <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full" />
        </div>
        
        {/* Custom Nav Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="custom-test-prev p-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button className="custom-test-next p-3 rounded-full bg-forest-600 hover:bg-forest-700 text-white transition-colors cursor-pointer group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        navigation={{
          prevEl: ".custom-test-prev",
          nextEl: ".custom-test-next",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        loop={true}
        className="pb-16"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i} className="h-auto">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 relative flex flex-col h-full cursor-grab active:cursor-grabbing">
              <div>
                <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-100" />
                <div className="flex text-amber-500 mb-6">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-600 font-inter text-base md:text-lg italic leading-relaxed mb-8 z-10 relative">&quot;{t.text}&quot;</p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">{t.name[0]}</div>
                <div>
                  <h4 className="font-bold text-slate-900 font-outfit text-base">{t.name}</h4>
                  <span className="text-[10px] md:text-xs text-amber-600 font-bold tracking-wide uppercase break-words line-clamp-1">{t.pkg}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Mobile nav indicator */}
      <div className="flex md:hidden justify-center items-center mt-2 w-full text-slate-400 text-xs font-bold tracking-widest uppercase">
        <ArrowLeft className="w-3 h-3 mr-2" /> Swipe to read more <ArrowRight className="w-3 h-3 ml-2" />
      </div>
    </div>
  );
}
