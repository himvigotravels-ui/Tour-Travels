"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

export default function HeroSlider() {
  const images = ["/hero-1.png", "/hero-2.png", "/hero-spiti.png"];

  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1800}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
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
                className="object-cover scale-105 motion-safe:animate-[kenburns_20s_ease-in-out_infinite_alternate]"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Multi-stop gradient for cinematic depth */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/80" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/30" />
      {/* Subtle vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.5)_100%)]" />

      <style jsx global>{`
        @keyframes kenburns {
          0% {
            transform: scale(1.05) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-2%, -1%);
          }
        }
      `}</style>
    </div>
  );
}
