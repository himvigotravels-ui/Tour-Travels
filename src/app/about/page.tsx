import { ShieldCheck, Users, Heart, Map, Award, Globe, MessageCircle } from "lucide-react";
import { BottomCTA } from "@/components/ui/BottomCTA";

export const metadata = {
  title: "About Us | HimachalTrek - Authentic Himalayan Experiences",
  description: "Learn about HimachalTrek's journey, our mission to provide authentic travel experiences, and the team behind your favorite Himalayan adventures.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/about-hero.png" 
            alt="HimachalTrek Travelers" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-amber-400 font-extrabold text-sm uppercase tracking-[0.3em] mb-4 drop-shadow-md">Our Story</h4>
          <h1 className="text-5xl md:text-8xl font-outfit font-extrabold text-white mb-6 drop-shadow-2xl">
            Born in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Himalayas</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-lg italic">
            "We don't just show you the mountains; we let you live them."
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-forest-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
                  alt="Mountain View" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-[5s]"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <Award className="w-8 h-8 text-amber-400" />
                    <span className="text-2xl font-bold font-outfit">10+ Years</span>
                  </div>
                  <p className="text-slate-300 font-medium italic">Crafting local stories across Himachal.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Authenticity is our only North Star.</h2>
              <div className="h-1.5 w-24 bg-forest-600 mt-6 rounded-full" />
              
              <div className="mt-10 space-y-8 text-lg text-slate-600 font-inter leading-relaxed">
                <p>
                  HimachalTrek started in a small wooden cabin in Manali with a simple belief: the real beauty of the Himalayas isn't in the overcrowded shopping streets, but in the silent valleys and home-cooked meals of remote villages.
                </p>
                <p>
                  Today, we are a network of local guides, drivers, and host families who shared this vision. We specialize in offbeat Spiti expeditions and luxury Kinnaur circuits, ensuring every traveler leaves with a piece of the mountains in their heart.
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <h4 className="text-3xl font-extrabold text-slate-900 font-outfit">2k+</h4>
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
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900">Why Travel With Us?</h2>
            <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Users className="w-10 h-10" />, 
                title: "Local to the Core", 
                desc: "We don't hire third-party vendors. Every driver and guide is a native of the region you're visiting.",
                bg: "bg-forest-50",
                color: "text-forest-600"
              },
              { 
                icon: <ShieldCheck className="w-10 h-10" />, 
                title: "Unmatched Safety", 
                desc: "Mountain roads require mountain skills. Our vehicles and drivers are vetted for extreme high-altitude conditions.",
                bg: "bg-amber-50",
                color: "text-amber-600"
              },
              { 
                icon: <Heart className="w-10 h-10" />, 
                title: "Sustainable Travel", 
                desc: "A portion of our proceeds goes directly to supporting education in Spiti and Lahaul village schools.",
                bg: "bg-red-50",
                color: "text-red-600"
              }
            ].map((value, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${value.bg} opacity-20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`} />
                <div className={`w-20 h-20 rounded-3xl ${value.bg} ${value.color} flex items-center justify-center mb-8 transform group-hover:-rotate-6 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founder / Team (Optional but adds trust) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-forest-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-400 opacity-5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-white/10 shrink-0 shadow-2xl transform hover:rotate-2 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10 text-center md:text-left">
                <MessageCircle className="w-12 h-12 text-amber-500 mb-6 mx-auto md:ml-0 opacity-50" />
                <h3 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-6 leading-tight">
                  "I started this because I wanted travelers to see the Himachal I grew up in — wild, honest, and welcoming."
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="h-px w-12 bg-amber-500 hidden md:block" />
                  <div>
                    <h4 className="text-xl font-bold text-white">Siddharth Sharma</h4>
                    <p className="text-amber-500 text-sm font-bold uppercase tracking-widest">Founder & Local Explorer</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
