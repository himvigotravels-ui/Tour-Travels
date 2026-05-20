import {
  RiCalendarCheckLine,
  RiWhatsappLine,
  RiPhoneLine,
  RiArrowRightUpLine,
  RiSparkling2Line,
  RiMapPinLine,
} from "react-icons/ri";
import Link from "next/link";
import { getSettings } from "@/lib/db/settings";

export const BottomCTA = async () => {
  const settings = await getSettings();
  const phone = settings.site_phone || "+919805514018";
  const whatsapp = (settings.site_whatsapp || "919805514018").replace(
    /[^0-9]/g,
    ""
  );

  return (
    <section className="relative isolate overflow-hidden bg-brand-blue text-white">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand-orange/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[24rem] w-[24rem] rounded-full bg-blue-500/20 blur-[120px]" />
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Mountain silhouette */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 w-full text-slate-950/40"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0,200 L0,140 L120,90 L240,130 L360,70 L480,110 L600,50 L720,100 L840,40 L960,90 L1080,30 L1200,80 L1320,50 L1440,100 L1440,200 Z" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left — content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-3 py-1.5 backdrop-blur-md mb-6">
              <RiSparkling2Line className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/95">
                {settings.bottom_cta_quote || "Plan your trip"}
              </span>
            </div>

            <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
              {settings.bottom_cta_headline ||
                "Your mountains are waiting."}
              <br />
              <span className="text-brand-orange">Let&apos;s make the trip yours.</span>
            </h2>

            <p className="text-base md:text-lg text-white/75 max-w-xl leading-relaxed mb-8">
              {settings.bottom_cta_subheadline ||
                "Tell us where you want to go and we'll handle comfortable rides, local hosts and recommendations only an insider would know."}
            </p>

            {/* Primary CTA + inline contact */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-orange/30 transition-all duration-300 hover:bg-brand-orange/90 hover:-translate-y-0.5"
              >
                <RiCalendarCheckLine className="h-5 w-5" />
                {settings.bottom_cta_quote || "Get a free quote"}
                <RiArrowRightUpLine className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/50 font-medium">or</span>
                <a
                  href={`tel:${phone}`}
                  className="group inline-flex items-center gap-1.5 font-semibold text-white/90 hover:text-brand-orange transition-colors"
                >
                  <RiPhoneLine className="h-4 w-4" />
                  Call us
                </a>
                <span className="h-3 w-px bg-white/20" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-semibold text-white/90 hover:text-emerald-400 transition-colors"
                >
                  <RiWhatsappLine className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] font-medium text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Reply within 24 hours
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                100% local guides &amp; drivers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Custom itineraries, no obligation
              </span>
            </div>
          </div>

          {/* Right — quote-card mock */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative ml-auto max-w-sm">
              {/* Glow */}
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-orange/30 via-transparent to-blue-400/20 blur-3xl" />

              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Trip request
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Going to",
                      value: "Spiti & Kinnaur",
                      icon: RiMapPinLine,
                    },
                    {
                      label: "Travellers",
                      value: "2 adults · 1 kid",
                      icon: RiSparkling2Line,
                    },
                    {
                      label: "Dates",
                      value: "May 14 – May 22",
                      icon: RiCalendarCheckLine,
                    },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange ring-1 ring-brand-orange/30">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                            {row.label}
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {row.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/contact"
                  className="group mt-5 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-brand-blue shadow-lg transition-all hover:shadow-xl"
                >
                  <span>Send my request</span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-white transition-transform group-hover:rotate-45">
                    <RiArrowRightUpLine className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
