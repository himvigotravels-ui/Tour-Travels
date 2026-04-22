import { 
  RiCarLine, 
  RiShieldCheckLine, 
  RiMapPinLine, 
  RiTimeLine, 
  RiStarSFill, 
  RiPhoneLine, 
  RiCheckboxCircleLine, 
  RiNavigationLine 
} from "react-icons/ri";
import { BottomCTA } from "@/components/ui/BottomCTA";
import Link from "next/link";

import { getSettings } from "@/lib/db/settings";
import { getCabVehicles, getCabRoutes } from "@/lib/db/cab";
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_cab_title || "Premium Cab Services Himachal | Himvigo Tours",
    description: settings.seo_cab_description || "Book reliable, safe, and premium cab services across Himachal Pradesh.",
    keywords: settings.seo_cab_keywords || "cab, taxi, himachal",
  };
}


export default async function CabPage() {
  const settings = await getSettings();
  const vehicles = await getCabVehicles();
  const routes = await getCabRoutes();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image with subtle parallax effect via scale */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/cab-hero-new.jpg" 
            alt="Himvigo Premium Fleet" 
            className="w-full h-full object-cover scale-105" 
          />
          {/* Elegant Dark Tint */}
          <div className="absolute inset-0 bg-slate-950/40 z-10"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-xl">
              Verified Mountain Fleet
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-outfit font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
              Reliable <span className="text-brand-orange italic">Cab</span> Services
            </h1>
            <p className="text-base md:text-lg text-slate-100 font-inter max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-md opacity-90">
              Safe rides and local expertise for your Himachal adventure. From airport transfers to high-altitude expeditions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto px-10 py-4 bg-white text-brand-blue font-bold rounded-full hover:bg-brand-orange hover:text-white transition-all duration-300 shadow-2xl">
                Book Your Ride
              </Link>
              <a href="tel:+919805514018" className="w-full sm:w-auto px-10 py-4 bg-brand-blue/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all">
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-brand-orange to-transparent opacity-50"></div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <RiShieldCheckLine className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">Verified</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-brand-orange mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <RiTimeLine className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">24/7 Support</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <RiNavigationLine className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">GPS Tracked</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-brand-orange mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <RiStarSFill className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">Fixed Price</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-outfit font-extrabold text-slate-900 leading-tight">
                Premium <span className="text-brand-orange">Mountain</span> Fleet
              </h2>
              <p className="text-slate-500 mt-6 text-lg font-inter">Specifically selected vehicles for mountain terrain safety and absolute comfort.</p>
            </div>
            <div className="h-px md:h-24 w-full md:w-px bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-blue/20 transition-all duration-500 group flex flex-col h-full">
                <div className="h-56 overflow-hidden relative">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-brand-blue text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {v.capacity}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] mb-2">{v.model}</span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{v.name}</h3>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {v.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-500 font-medium">
                        <RiCheckboxCircleLine className="w-4 h-4 text-brand-orange mr-3 shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="w-full text-center py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-orange transition-all duration-300 shadow-lg hover:shadow-brand-orange/20">
                    Get Best Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 leading-tight mb-8">
                Popular <span className="text-brand-orange">Transfer</span> Routes
              </h2>
              <p className="text-slate-600 text-lg font-inter leading-relaxed mb-12">
                Seamless point-to-point transfers from major airports and stations. Our pricing is transparent and includes fuel and driver allowance.
              </p>
              
              <div className="flex items-center gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center text-white shadow-xl">
                  <RiPhoneLine className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Direct Booking</h4>
                  <p className="text-brand-blue font-bold text-xl">+91 98055 14018</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {routes.map((route, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-brand-orange/20 hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <RiNavigationLine className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transfer Route</div>
                      <div className="font-bold text-slate-900 text-lg">{route.fromCity} to {route.toCity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-blue font-black text-xl">{route.price}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{route.duration}</div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 mt-6 font-medium italic text-center">
                * Indicative pricing. May vary by vehicle & season.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
