import Link from "next/link";

export const dynamic = 'force-dynamic';
import { 
  RiArrowRightLine, 
  RiMapPinLine, 
  RiMapLine, 
  RiSunLine, 
  RiSnowflakeLine, 
  RiCompass3Line 
} from "react-icons/ri";
import Image from "next/image";
import { BottomCTA } from "@/components/ui/BottomCTA";

import { getSettings } from "@/lib/db/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_destinations_title || "Explore Destinations | Himvigo Tours",
    description: settings.seo_destinations_description || "Explore the magical regions of Himachal Pradesh.",
    keywords: settings.seo_destinations_keywords || "destinations, spiti, manali",
  };
}

import { getAllDestinations } from "@/lib/db/destinations";

export default async function DestinationsPage() {
  const destinationsData = await getAllDestinations();
  const settings = await getSettings();
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-brand-blue">
        {/* Background Layer with Parallax & Blend */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80" 
            alt="Majestic Spiti landscape" 
            className="w-full h-full object-cover scale-105 animate-pulse" 
            style={{ animationDuration: '25s' }} 
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/* Topographic pattern layered over the image */}
          <div className="absolute inset-0 z-20 opacity-15 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        {/* Text Area */}
        <div className="relative z-30 w-full max-w-5xl mx-auto px-4 text-center pt-24">
          <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-slate-900/50 border border-white/10 text-brand-orange font-bold text-xs uppercase tracking-widest mb-8 shadow-2xl">
            <RiCompass3Line className="w-4 h-4" /> Discover the Himalayas
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-outfit font-extrabold text-white mb-8 drop-shadow-2xl tracking-tight leading-[1.05]">
            Magical Destinations <br className="hidden md:block" />
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-brand-orange/70 to-brand-orange inline-block">
              Wait For You
              {/* Dynamic Underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-brand-orange z-[-1] opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-100 font-inter max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-xl mix-blend-screen">
            From the arid majestic deserts of Spiti to the blooming valleys of Kullu, explore the diverse landscapes of Himachal Pradesh based on what moves your soul.
          </p>
        </div>
      </section>

      {/* Regions List */}
      <section className="py-12 relative z-20">
        {destinationsData.map((dest, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={dest.slug} className={`py-24 ${isEven ? 'bg-slate-50' : 'bg-white border-y border-slate-100'}`}>
              <div className={`max-w-7xl mx-auto px-4 md:px-8 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative group">
                  <div className="relative h-[400px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  {/* Floating Badge */}
                  <div className={`absolute top-8 ${isEven ? '-right-6' : '-left-6'} hidden lg:flex flex-col items-center justify-center w-28 h-28 bg-white rounded-full shadow-xl border border-slate-100 z-10 hover:scale-110 transition-transform duration-300 cursor-default`}>
                    <RiCompass3Line className="w-8 h-8 text-brand-orange mb-1" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Explore</span>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h4 className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-3 font-inter">{dest.tagline}</h4>
                  <h2 className="text-4xl md:text-6xl font-outfit font-extrabold text-slate-900 mb-6 drop-shadow-sm">{dest.name}</h2>
                  
                  <p className="text-slate-600 font-inter text-lg leading-relaxed mb-8">
                    {dest.description}
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div>
                      <h5 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <RiSunLine className="w-4 h-4 text-brand-blue" /> Best Time
                      </h5>
                      <p className="text-slate-900 font-semibold">{dest.bestTime}</p>
                    </div>
                    <div>
                      <h5 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <RiMapPinLine className="w-4 h-4 text-brand-blue" /> Altitude
                      </h5>
                      <p className="text-slate-900 font-semibold">{dest.altitude}</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Highlights</h5>
                    <div className="flex flex-wrap gap-2">
                      {dest.highlights.map((highlight, idx) => (
                        <span key={idx} className="bg-brand-blue/5 text-brand-blue font-medium px-4 py-2 rounded-xl text-sm border border-brand-blue/10">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Link 
                      href={`/destinations/${dest.slug}`}
                      className="inline-flex items-center gap-3 bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 font-outfit text-lg shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-1 group"
                    >
                      View {dest.name} Detail <RiArrowRightLine className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </section>
      
      {/* Shared Dark Cinematic Bottom CTA Component */}
      <BottomCTA />

    </main>
  );
}
