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
              className="object-cover"
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 bg-black/30 z-10"></div>
    </div>
  );
}
