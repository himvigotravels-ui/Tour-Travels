import Link from "next/link";
import { RiArrowRightSLine, RiMapPinLine, RiPhoneLine, RiMailLine, RiTimeLine, RiMapLine } from "react-icons/ri";
import { ContactForm } from "@/components/contact/ContactForm";

import { getSettings } from "@/lib/db/settings";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_contact_title || "Contact Us | Himvigo Tours",
    description: settings.seo_contact_description || "Get in touch with our local Himalayan travel experts.",
    keywords: settings.seo_contact_keywords || "contact, support, himvigo",
  };
}

export default async function ContactPage() {
  const settings = await getSettings();
  const siteEmail = settings.site_email || "himvigotours@gmail.com";
  const sitePhone = settings.site_phone || "+91 98055 14018";
  const siteAddress = settings.site_address || "VPO - Prini, Tehsil - Manali, District - Kullu, HP 175131";

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Cinematic Hero */}
      <section className="relative w-full h-[35vh] md:h-[45vh] min-h-[320px] md:min-h-[400px] flex items-center md:items-end pb-12 md:pb-16 bg-brand-blue overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-spiti.png" 
            alt="Cold desert mountains" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pt-20 md:pt-32 text-center md:text-left">
          <Link href="/" className="inline-flex items-center justify-center md:justify-start text-amber-400 hover:text-amber-300 font-inter text-xs md:text-base font-bold mb-3 md:mb-4 transition-colors uppercase tracking-widest">
            Home <RiArrowRightSLine className="w-3.5 h-3.5 mx-1" /> <span className="text-slate-300 font-normal">Contact</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-outfit font-extrabold text-white drop-shadow-xl leading-[1.1]">
            Let&apos;s Plan Your <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Escape</span>
          </h1>
          <p className="text-slate-300 mt-4 md:mt-6 text-lg md:text-xl font-medium max-w-xl hidden md:block">
            Whether you want a hardcore Spiti expedition or a relaxed Shimla retreat, our local experts are here to craft your itinerary.
          </p>
        </div>
      </section>

      {/* Main Contact Area */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24 w-full relative z-20 -mt-10 md:-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
          
          {/* Info Panel: lg:col-span-2 */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="relative z-10 flex-grow">
              <h2 className="text-3xl font-outfit font-extrabold mb-8 drop-shadow-sm">Reach Out</h2>
              
              <div className="space-y-8 flex-col">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-400 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 transition-colors">
                    <RiMapPinLine className="w-5 h-5" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 font-inter">HQ Location</p>
                    <p className="text-base font-medium text-slate-200 leading-relaxed font-inter">{siteAddress}</p>
                  </div>
                </div>
 
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-400 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 transition-colors">
                    <RiPhoneLine className="w-5 h-5" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 font-inter">Call Center</p>
                    <p className="text-lg font-bold text-white tracking-wide font-outfit">{sitePhone}</p>
                    <p className="text-sm text-slate-400 mt-1">Mon-Sun, 9am till 8pm</p>
                  </div>
                </div>
 
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-400 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 transition-colors">
                    <RiMailLine className="w-5 h-5" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 font-inter">Email Us</p>
                    <p className="text-base font-medium text-slate-200 transition-colors hover:text-amber-400">{siteEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center shadow-lg">
              <RiTimeLine className="w-6 h-6 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300 font-inter">We typically reply within</p>
              <p className="text-xl font-extrabold text-white font-outfit mt-1">2 Hours</p>
            </div>
          </div>

          {/* Contact Form: lg:col-span-3 */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-center relative overflow-hidden">
            {/* Subtle Form Decoration */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-forest-50 rounded-bl-[100px] -z-0"></div>
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Decorative Maps Section */}
      <section className="w-full bg-slate-200/50 relative overflow-hidden border-t border-slate-200">
        <div className="h-48 md:h-72 w-full flex flex-col items-center justify-center relative backdrop-blur-sm z-10 px-4 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-forest-700 mb-4 animate-bounce">
              <RiMapLine className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-outfit font-extrabold text-slate-900 mb-2">Our physical footprint</h3>
            <p className="text-slate-500 font-medium">Headquartered in the Queen of Hills, operating across the Himalayas.</p>
        </div>
        {/* Placeholder for real iframe if provided, otherwise a graphical pattern looks better for mockups */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] z-0"></div>
      </section>

    </main>
  );
}
