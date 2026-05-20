import { RiShieldCheckLine, RiGroupLine, RiHeartLine, RiAwardLine } from "react-icons/ri";
import { ReactNode } from "react";
import { BottomCTA } from "@/components/ui/BottomCTA";
import { getSettings } from "@/lib/db/settings";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "About Us | Himvigo - Authentic Himalayan Experiences",
  description: "Learn about Himvigo's journey, our mission to provide authentic travel experiences, and the team behind your favorite Himalayan adventures.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  const trustUs = settings.about_trust_us_json 
    ? JSON.parse(settings.about_trust_us_json)
    : [
        { title: "Local to the Core", desc: "We don't hire third-party vendors. Every driver and guide is a native of the region you're visiting." },
        { title: "Unmatched Safety", desc: "Mountain roads require mountain skills. Our vehicles and drivers are vetted for extreme high-altitude conditions." },
        { title: "Sustainable Travel", desc: "A portion of our proceeds goes directly to supporting education in Spiti and Lahaul village schools." }
      ];

  const iconMap: Record<number, ReactNode> = {
    0: <RiGroupLine className="w-10 h-10" />,
    1: <RiShieldCheckLine className="w-10 h-10" />,
    2: <RiHeartLine className="w-10 h-10" />,
  };

  const bgMap: Record<number, string> = {
    0: "bg-brand-blue/5",
    1: "bg-brand-orange/5",
    2: "bg-slate-50",
  };

  const colorMap: Record<number, string> = {
    0: "text-brand-blue",
    1: "text-brand-orange",
    2: "text-slate-600",
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-spiti.png" 
            alt="Himvigo Travelers" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-24">
          <h4 className="text-brand-orange font-extrabold text-sm uppercase tracking-[0.3em] mb-6 drop-shadow-md">Our Story</h4>
          <h1 className="text-5xl md:text-8xl font-outfit font-extrabold text-white mb-8 drop-shadow-2xl">
            Born in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange/80 to-brand-orange">Himalayas</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-lg italic opacity-90">
            &quot;We don&apos;t just show you the mountains; we let you live them.&quot;
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-blue/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-orange/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
                  alt="Mountain View" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-[5s]"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <RiAwardLine className="w-8 h-8 text-brand-orange" />
                    <span className="text-2xl font-bold font-outfit">10+ Years</span>
                  </div>
                  <p className="text-slate-300 font-medium italic">Crafting local stories across Himachal.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">
                Authenticity is our only North Star.
              </h2>
              <div className="h-1.5 w-24 bg-brand-orange mt-6 rounded-full" />
              
              <div className="mt-10 space-y-8 text-lg text-slate-600 font-inter leading-relaxed">
                {settings.about_who_we_are ? settings.about_who_we_are.split('\n\n').map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                )) : (
                  <>
                    <p>
                      Himvigo started in a small wooden cabin in Manali with a simple belief: the real beauty of the Himalayas isn&apos;t in the overcrowded shopping streets, but in the silent valleys and home-cooked meals of remote villages.
                    </p>
                    <p>
                      Today, we are a network of local guides, drivers, and host families who shared this vision. We specialize in offbeat Spiti expeditions and luxury Kinnaur circuits, ensuring every traveler leaves with a piece of the mountains in their heart.
                    </p>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <h4 className="text-3xl font-extrabold text-slate-900 font-outfit">10k+</h4>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Happy Souls</p>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-slate-900 font-outfit">150+</h4>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Local Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900">Why Travelers Trust Us</h2>
            <div className="h-1.5 w-24 bg-brand-orange mt-6 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {trustUs.map((value: { title: string; desc: string }, i: number) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${bgMap[i % 3]} opacity-20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`} />
                <div className={`w-20 h-20 rounded-3xl ${bgMap[i % 3]} ${colorMap[i % 3]} flex items-center justify-center mb-8 transform group-hover:-rotate-6 transition-transform`}>
                  {iconMap[i] || <RiGroupLine className="w-10 h-10" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
