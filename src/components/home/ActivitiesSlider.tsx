"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Compass, Zap, MapPin } from "lucide-react";

import { ActivityData } from "@/lib/db/activities";

const IconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
};

export default function ActivitiesSlider({ activities = [] }: { activities: ActivityData[] }) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: ".activities-next",
          prevEl: ".activities-prev",
        }}
        pagination={{ clickable: true, el: ".activities-pagination" }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="pb-16"
      >
        {activities.map((act, i) => (
          <SwiperSlide key={i}>
            <div className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50">
              <img 
                src={act.image} 
                alt={act.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500 text-slate-900 shadow-lg">
                    {IconMap[act.icon] || <Compass className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {act.location}
                  </span>
                </div>
                <h3 className="text-3xl font-outfit font-extrabold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-slate-200 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {act.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Controls */}
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="activities-pagination !static !w-auto"></div>
      </div>
    </div>
  );
}
