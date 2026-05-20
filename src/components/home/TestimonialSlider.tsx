"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDoubleQuotesL,
  RiStarSFill,
  RiHeart3Fill,
} from "react-icons/ri";

import { TestimonialData } from "@/lib/db/testimonials";

const AVATAR_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
];

export default function TestimonialSlider({
  testimonials = [],
}: {
  testimonials: TestimonialData[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Duplicate items if too few to keep loop smooth
  const slideItems =
    testimonials.length > 0 && testimonials.length < 6
      ? [...testimonials, ...testimonials, ...testimonials].slice(0, 9)
      : testimonials;

  if (slideItems.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Editorial header */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 mb-4">
            <RiHeart3Fill className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
              Traveller Stories
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-4 leading-tight">
            What Our Travellers Say
          </h2>
          <p className="text-slate-500 text-lg font-inter max-w-xl">
            Over 5,000 families, couples, and adventurers have trusted Himvigo with their Himachal memories.
          </p>
        </div>

        {/* Custom Nav Buttons */}
        <div className="md:col-span-4 flex md:justify-end items-center gap-3">
          <button
            type="button"
            aria-label="Previous testimonial"
            className="custom-test-prev group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-brand-orange hover:text-brand-orange hover:shadow-md"
          >
            <RiArrowLeftLine className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            className="custom-test-next group inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-md transition-all hover:bg-brand-orange/90 hover:shadow-lg"
          >
            <RiArrowRightLine className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: ".custom-test-prev",
          nextEl: ".custom-test-next",
        }}
        autoplay={{ delay: 6000, disableOnInteraction: true }}
        loop={slideItems.length > 3}
        className="!pb-2"
      >
        {slideItems.map((t, i) => {
          const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
          return (
            <SwiperSlide key={i} className="!h-auto">
              <article className="group relative flex h-[340px] flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-slate-200/70 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-orange/30">
                {/* Big quote glyph */}
                <RiDoubleQuotesL className="absolute -top-2 -right-2 h-24 w-24 text-slate-100 group-hover:text-brand-orange/20 transition-colors duration-500" />

                {/* Stars */}
                <div className="flex gap-0.5 text-amber-500 mb-4 relative">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <RiStarSFill
                      key={idx}
                      className={`h-3.5 w-3.5 ${
                        idx < t.rating ? "" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote — fixed height region with line clamp keeps cards equal */}
                <p className="relative text-slate-700 font-inter leading-relaxed text-[15px] line-clamp-6 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Footer */}
                <div className="relative mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white font-bold shadow-md ring-2 ring-white`}
                  >
                    {t.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 font-outfit text-sm leading-tight truncate">
                      {t.name}
                    </h4>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-brand-orange line-clamp-1">
                      {t.packageName}
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Mobile swipe hint */}
      <div className="mt-4 flex md:hidden justify-center items-center gap-2 text-slate-400 text-[11px] font-bold tracking-widest uppercase">
        <RiArrowLeftLine className="h-3 w-3" />
        Swipe to read more
        <RiArrowRightLine className="h-3 w-3" />
      </div>
    </div>
  );
}
