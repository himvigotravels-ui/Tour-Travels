import { PackageCard } from "@/components/ui/PackageCard";
import { SearchFilter } from "@/components/SearchFilter";
import RegionSlider from "@/components/home/RegionSlider";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import ActivitiesSlider from "@/components/home/ActivitiesSlider";
import BlogSection from "@/components/home/BlogSection";
import HeroSlider from "@/components/home/HeroSlider";
import { getFeaturedPackages } from "@/lib/db/packages";
import { getAllDestinations } from "@/lib/db/destinations";
import { getLatestBlogs } from "@/lib/db/blogs";
import { getAllTestimonials } from "@/lib/db/testimonials";
import { getAllActivities } from "@/lib/db/activities";
import { ShieldCheck, Users, Star, ArrowRight, Trophy, Compass } from "lucide-react";
import Link from "next/link";
const features = [
  {
    title: "100% Local Experts",
    desc: "Our guides are born and raised in the Himalayas. They know the hidden trails, the local legends, and the best ways to keep you safe.",
    image: "/hero-1.png",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Unmatched Safety",
    desc: "From certified mountaineers to premium medical kits and GPS tracking, your safety is our ultimate priority on every expedition.",
    image: "/hero-2.png",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "Award-Winning Service",
    desc: "Recognized as the premier tour operator in Himachal, we deliver 5-star hospitality even in the most remote mountain terrains.",
    image: "/hero-spiti.png",
    icon: <Trophy className="w-6 h-6" />
  },
  {
    title: "Offbeat Explorations",
    desc: "Skip the crowded tourist traps. We take you to pristine, untouched locations that most travelers never get to see.",
    image: "/kasol.png",
    icon: <Compass className="w-6 h-6" />
  }
];

export default async function HomePage() {
  // Fetch all dynamic data from database
  const [packages, destinations, blogs, testimonials, activities] = await Promise.all([
    getFeaturedPackages(),
    getAllDestinations(),
    getLatestBlogs(3),
    getAllTestimonials(),
    getAllActivities(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Himvigo Tours",
    "image": "https://himvigo.com/logo.png",
    "description": "Premium Tour Operator in Himachal Pradesh.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Manali",
      "addressRegion": "Himachal Pradesh",
      "addressCountry": "IN"
    },
    "telephone": "+91-XXXXXXXXXX"
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-forest-900 pt-32 pb-24">
        <HeroSlider />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 mt-4 text-center">
          <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/20 text-white border border-white/40 text-sm font-bold tracking-wide mb-8 backdrop-blur-3xl shadow-2xl">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>4.9/5 Average Rating (2,000+ Reviews)</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-[6rem] font-outfit font-extrabold text-white mb-8 drop-shadow-2xl tracking-tight leading-[1.05] max-w-5xl mx-auto">
            Find Your Soul in <br className="hidden md:block"/> The{' '}
            <span className="relative inline-block text-amber-400">
              Himalayas
              <svg className="absolute -bottom-2 left-0 w-[110%] -translate-x-[5%] h-5 text-amber-500 z-[-1]" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q30,0 100,10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-100 mb-14 font-inter max-w-2xl mx-auto drop-shadow-xl font-medium leading-relaxed px-4">
            Uncover the raw beauty of Spiti, scale the heights of Manali, and relax in the pines of Kasol. Authentic, secure, and unmatched.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              href="/packages"
              className="px-8 py-4 w-full sm:w-auto rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 font-outfit"
            >
              Explore Packages <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/cab"
              className="px-8 py-4 w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center font-outfit"
            >
              Book a Cab
            </Link>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-10 px-2 py-8 mt-24 w-full max-w-4xl mx-auto relative z-10">
            <div className="text-center flex-1">
              <p className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">50+</p>
              <p className="text-xs md:text-sm font-inter text-slate-600 mt-1 uppercase tracking-widest font-bold">Curated Routes</p>
            </div>
            <div className="w-px h-12 bg-slate-300 hidden sm:block"></div>
            <div className="text-center flex-1">
              <p className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">10k+</p>
              <p className="text-xs md:text-sm font-inter text-slate-600 mt-1 uppercase tracking-widest font-bold">Happy Travelers</p>
            </div>
            <div className="w-px h-12 bg-slate-300 hidden sm:block"></div>
            <div className="text-center flex-1">
              <p className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">100%</p>
              <p className="text-xs md:text-sm font-inter text-slate-600 mt-1 uppercase tracking-widest font-bold">Local Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Filter Section */}
      <div className="relative z-30 -mt-16 max-w-5xl mx-auto px-4 w-full">
        <SearchFilter />
      </div>

      {/* Featured Packages Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 mb-6 leading-tight">Featured Expeditions</h2>
            <p className="text-slate-500 text-lg font-inter">Handpicked itineraries designed for the ultimate Himalayan experience.</p>
          </div>
          <Link href="/packages" className="inline-flex items-center gap-2 font-bold text-amber-600 hover:text-amber-700 transition-colors group">
            View All Packages
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} tour={pkg} />
          ))}
        </div>
      </section>

      {/* Popular Destinations Slider */}
      <section className="py-24 bg-slate-950 overflow-hidden w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8">
          <RegionSlider destinations={destinations} />
        </div>
      </section>

      {/* Why Choose Us - Interactive Expanding Cards */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Why Choose Himvigo</h2>
            <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full mx-auto" />
            <p className="mt-6 text-slate-500 text-lg max-w-2xl mx-auto">Experience the difference of traveling with true Himalayan experts.</p>
          </div>
          
          <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[500px] gap-4">
             {features.map((f, i) => (
               <div key={i} className="group relative flex-1 hover:flex-[3] transition-all duration-700 ease-in-out h-full overflow-hidden rounded-3xl cursor-pointer shadow-lg border border-slate-200">
                  <img src={f.image} alt={f.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 flex flex-col justify-end p-6 md:p-8 transition-all duration-500" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.1) 100%)" }}>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-400 shrink-0 border border-white/10 shadow-xl group-hover:bg-amber-500 group-hover:text-slate-900 group-hover:border-amber-400 transition-colors duration-500">
                           {f.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white font-outfit whitespace-nowrap overflow-hidden transition-all duration-500 md:w-0 md:opacity-0 group-hover:w-auto group-hover:opacity-100">
                          {f.title}
                        </h3>
                        {/* Mobile Title (visible when not hovered on desktop) */}
                        <h3 className="text-xl font-bold text-white font-outfit md:hidden">
                          {f.title}
                        </h3>
                     </div>
                     <div className="overflow-hidden transition-all duration-500 md:max-h-0 md:opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                       <p className="text-slate-200 font-medium leading-relaxed font-inter">
                         {f.desc}
                       </p>
                     </div>
                     {/* Mobile Description */}
                     <p className="text-slate-300 font-medium leading-relaxed font-inter text-sm md:hidden mt-2">
                       {f.desc}
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-28 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Adventures Await</h2>
            <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full mx-auto" />
          </div>
          <ActivitiesSlider activities={activities} />
        </div>
      </section>

      {/* Blogs Section */}
      <BlogSection blogs={blogs} />

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>
    </main>
  );
}
