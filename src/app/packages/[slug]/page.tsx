import { getPackageBySlug } from "@/lib/db/packages";
import { notFound } from "next/navigation";
import { Clock, MapPin, Users, Car, Check, X, Star, Calendar, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PackageDetails({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Dynamic Hero Banner */}
      <section className="relative w-full h-[70vh] min-h-[550px] flex items-end pb-20 bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={pkg.image_urls[0]} 
            alt={pkg.title} 
            className="w-full h-full object-cover opacity-80"
          />
          {/* A cleaner, deeper gradient to ensure text readability from the bottom up */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-32">
          <Link href="/packages" className="inline-flex items-center text-amber-400 hover:text-amber-300 font-inter text-sm md:text-base font-medium mb-6 transition-colors">
            Packages <ChevronRight className="w-4 h-4 mx-1" /> <span className="text-slate-300 font-normal">{pkg.title}</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Star className="w-3 h-3 fill-amber-400" /> Bestseller
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-extrabold text-white mb-6 drop-shadow-xl leading-[1.1]">
                {pkg.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-slate-100 font-medium bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg font-inter">
                  <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                  {pkg.location}
                </div>
                <div className="flex items-center text-slate-100 font-medium bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg font-inter">
                  <Clock className="w-5 h-5 mr-2 text-amber-400" />
                  {pkg.duration_days} Days / {pkg.duration_nights} Nights
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-slate-300 text-sm font-medium mb-1 drop-shadow-md">Excellent Reviews</p>
              <div className="flex text-amber-400 mb-2 drop-shadow-md">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full flex flex-col lg:flex-row gap-12 relative -mt-8">
        
        {/* Main Content Column */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium mb-1 flex items-center"><Users className="w-4 h-4 mr-1"/> Group Size</span>
              <span className="text-slate-900 font-bold font-outfit">Up to {pkg.max_occupancy} px</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium mb-1 flex items-center"><Car className="w-4 h-4 mr-1"/> Vehicle</span>
              <span className="text-slate-900 font-bold font-outfit">{pkg.vehicle_type}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium mb-1 flex items-center"><Clock className="w-4 h-4 mr-1"/> Duration</span>
              <span className="text-slate-900 font-bold font-outfit">{pkg.duration_days}D / {pkg.duration_nights}N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-sm font-medium mb-1 flex items-center"><Star className="w-4 h-4 mr-1"/> Rating</span>
              <span className="text-slate-900 font-bold font-outfit">4.9/5 Excellent</span>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-forest-600 rounded-full mr-3"></div>
              Tour Overview
            </h2>
            <p className="text-slate-600 font-inter leading-relaxed text-lg">
              {pkg.description || "Get ready for an incredible adventure in Himachal Pradesh. Witness breathtaking views, experience rich local culture, and make memories that will last a lifetime."}
            </p>
          </div>

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl md:text-3xl font-bold font-outfit text-slate-900 mb-10 flex items-center">
                <div className="w-2 h-8 bg-amber-500 rounded-full mr-4"></div>
                Detailed Itinerary
              </h2>
              
              <div className="relative border-l-2 border-slate-100 ml-3 md:ml-6 pb-4">
                {pkg.itinerary.map((day, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-12 py-6 group">
                    {/* Circle marker */}
                    <div className="absolute left-[-1.1rem] top-8 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-forest-600 text-slate-50 font-bold text-sm shadow-sm ring-1 ring-slate-100 transition-transform duration-300 group-hover:bg-amber-500 group-hover:scale-110">
                      {day.day}
                    </div>
                    
                    <div className="bg-slate-50/50 group-hover:bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-slate-200">
                      <div className="flex flex-col mb-4">
                        <span className="text-amber-500 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-2 block">
                          Day {day.day}
                        </span>
                        <h3 className="font-outfit font-bold text-slate-900 text-xl md:text-2xl leading-snug">
                          {day.title}
                        </h3>
                      </div>
                      <div className="w-12 h-1 bg-forest-100 rounded-full mb-5 group-hover:bg-amber-400 transition-colors duration-300"></div>
                      <p className="text-slate-600 font-inter text-base leading-relaxed">
                        {day.activities}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-forest-50/50 p-8 rounded-3xl border border-forest-100">
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
                <Check className="w-6 h-6 text-forest-600 mr-2 bg-forest-100 p-1 rounded-full" />
                What&apos;s Included
              </h3>
              <ul className="space-y-4">
                {pkg.inclusions?.map((inc, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-forest-600 mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{inc}</span>
                  </li>
                )) || <li className="text-slate-500 italic">No inclusions specified.</li>}
              </ul>
            </div>
            
            <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6 flex items-center">
                <X className="w-6 h-6 text-red-500 mr-2 bg-red-100 p-1 rounded-full" />
                What&apos;s Excluded
              </h3>
              <ul className="space-y-4">
                {pkg.exclusions?.map((exc, i) => (
                  <li key={i} className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{exc}</span>
                  </li>
                )) || <li className="text-slate-500 italic">No exclusions specified.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 bg-white p-6 lg:p-7 rounded-3xl shadow-xl border border-slate-200 shadow-slate-200/50 flex flex-col">
            <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-100">
              <div>
                <span className="text-slate-500 font-medium text-xs block mb-1">Starting from</span>
                <span className="text-3xl font-outfit font-extrabold text-slate-900">₹{pkg.price_per_person.toLocaleString()}</span>
                <span className="text-slate-500 font-inter text-xs block mt-1">per person (approx)</span>
              </div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Save 15%
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="date" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Number of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 appearance-none cursor-pointer text-sm">
                    {[1,2,3,4,5,6,7,8,"9+"].map(n => <option key={n} value={n}>{n} {n===1 ? 'Person' : 'People'}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" />
              </div>

              <button type="submit" className="w-full py-3.5 mt-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Request Free Itinerary
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              Your information is secure and private
            </div>
            
            <div className="mt-3 text-center">
              <span className="text-slate-500 text-xs">Need help? Call us at </span>
              <a href="tel:+919876543210" className="text-forest-700 text-xs font-bold hover:underline">+91 98765 43210</a>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
