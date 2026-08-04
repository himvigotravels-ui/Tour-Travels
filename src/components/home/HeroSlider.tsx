"use client";

export default function HeroSlider() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Autoplaying looped hero video (muted + playsInline so it
          autoplays on mobile). Poster shows instantly while it loads. */}
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-spiti.png"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Tint gradients for headline legibility (no blur) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/30" />
    </div>
  );
}
