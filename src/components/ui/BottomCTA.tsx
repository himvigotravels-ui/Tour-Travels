import { RiCalendarCheckLine, RiCompass3Line, RiWhatsappLine, RiPhoneLine } from "react-icons/ri";
import Link from "next/link";
import { getSettings } from "@/lib/db/settings";

export const BottomCTA = async () => {
  const settings = await getSettings();

  return (
    <section className="py-32 bg-brand-blue relative overflow-hidden flex items-center justify-center">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent z-0"></div>
      
      <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none transform rotate-12">
        <RiCompass3Line className="w-[40rem] h-[40rem] text-white" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-brand-orange font-bold text-xs uppercase tracking-widest mb-8">
          <RiCalendarCheckLine className="w-4 h-4" /> {settings.bottom_cta_quote || 'Start Planning Today'}
        </div>
        <h2 className="text-4xl md:text-6xl font-outfit font-extrabold text-white mb-8 tracking-tight leading-tight">
          {settings.bottom_cta_headline || 'Ready for your Himalayan Adventure?'}
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 font-inter max-w-2xl mx-auto font-light leading-relaxed">
          {settings.bottom_cta_subheadline || "Get a free, no-obligation quote from our local travel experts within 24 hours. Let's make it happen."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="w-full sm:w-auto px-10 py-5 bg-brand-orange hover:bg-brand-orange/90 text-slate-900 font-extrabold rounded-2xl text-lg transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
             <RiCalendarCheckLine className="w-5 h-5" /> {settings.bottom_cta_quote || 'Get a Free Quote'}
          </Link>
          <a href={`tel:${settings.site_phone || '+919805514018'}`} className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold rounded-2xl text-lg transition-all text-center flex items-center justify-center gap-2">
            <RiPhoneLine className="w-5 h-5" /> Call: {settings.site_phone || '+91 98055 14018'}
          </a>
          <a href={`https://wa.me/${(settings.site_whatsapp || '919805514018').replace(/[^0-9]/g, '')}`} target="_blank" className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl text-lg transition-all flex items-center justify-center gap-2 shadow-lg">
            <RiWhatsappLine className="w-5 h-5" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
