"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

export default function HeroSlider() {
  const images = ["/hero-1.png", "/hero-2.png"];

  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} className="w-full h-full">
            <Image
              src={src}
              alt={`Himalayan landscape ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover opacity-80"
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-slate-950/80 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-80 z-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent"></div>
      </div>
    </div>
  );
}
