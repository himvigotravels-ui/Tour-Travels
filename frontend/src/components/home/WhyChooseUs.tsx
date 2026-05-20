"use client";

import {
  RiShieldCheckLine,
  RiGroupLine,
  RiTrophyLine,
  RiCompass3Line,
  RiCarLine,
  RiCheckboxCircleLine,
  RiNavigationLine,
  RiStarSFill,
} from "react-icons/ri";

export interface Feature {
  title: string;
  desc: string;
  /** Optional admin-uploaded icon image (preferred). */
  iconImage?: string;
  /** Optional fallback Ri icon name. */
  icon?: string;
  /** Legacy field — bigger image. We'll fall back to it as the icon if iconImage is missing. */
  image?: string;
}

const FALLBACK_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  RiShieldCheckLine,
  RiGroupLine,
  RiTrophyLine,
  RiCompass3Line,
  RiCarLine,
  RiCheckboxCircleLine,
  RiNavigationLine,
  RiStarSFill,
};

interface Props {
  features: Feature[];
}

export function WhyChooseUs({ features }: Props) {
  if (!features?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {features.map((f, i) => {
        const FallbackIcon =
          (f.icon && FALLBACK_ICONS[f.icon]) || RiCompass3Line;
        const iconSrc = f.iconImage || f.image;
        return (
          <article
            key={i}
            className="group relative flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-orange/30"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange transition-transform duration-300 group-hover:scale-110 overflow-hidden">
              {iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <FallbackIcon className="h-7 w-7" />
              )}
            </div>
            <h3 className="font-outfit text-lg font-bold text-brand-blue mb-2 leading-tight">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
          </article>
        );
      })}
    </div>
  );
}
