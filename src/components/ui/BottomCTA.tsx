import { CalendarCheck, Compass } from "lucide-react";
import Link from "next/link";

export const BottomCTA = () => {
  return (
    <section className="py-32 bg-forest-900 relative overflow-hidden flex items-center justify-center">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-0"></div>
      
      <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none transform rotate-12">
        <Compass className="w-[40rem] h-[40rem] text-white" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-amber-400 font-bold text-xs uppercase tracking-widest mb-8">
          <CalendarCheck className="w-4 h-4" /> Start Planning Today
        </div>
        <h2 className="text-4xl md:text-6xl font-outfit font-extrabold text-white mb-8 tracking-tight leading-tight">
          Ready for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Himalayan</span> Adventure?
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 font-inter max-w-2xl mx-auto font-light leading-relaxed">
          Get a free, no-obligation quote from our local travel experts within 24 hours. Let&apos;s make it happen.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="w-full sm:w-auto px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold rounded-2xl text-lg transition-all shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)] hover:-translate-y-1">
            Start Planning Now
          </Link>
          <a href="tel:+919876543210" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm border border-white/20 font-bold rounded-2xl text-lg transition-all text-center">
            Call us: +91 98765 43210
          </a>
        </div>
      </div>
    </section>
  );
};
