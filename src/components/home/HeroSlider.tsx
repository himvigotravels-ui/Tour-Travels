"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

export default function HeroSlider() {
  const images = ["/hero-1.png", "/hero-2.png", "/hero-spiti.png"];

  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay]}
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} className="w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={src}
                alt={`Himalayan landscape ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Tint gradients for headline legibility (no blur) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/30" />
    </div>
  );
}
