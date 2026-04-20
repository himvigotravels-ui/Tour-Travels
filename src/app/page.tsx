import { PackageCard } from "@/components/ui/PackageCard";
import { SearchFilter } from "@/components/SearchFilter";
import { BottomCTA } from "@/components/ui/BottomCTA";
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

export const metadata = {
  title: "Best Himachal Tour Packages & Spiti Valley Tours | Himvigo Tours",
  description: "Experience the magic of Himachal Pradesh with Himvigo. Premium, offbeat Spiti Valley tours and reliable Chandigarh to Manali cab services.",
};

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

  const features = [
    { icon: <ShieldCheck className="w-8 h-8 text-forest-700" />, title: "Quality & Safety", desc: "Your safety is our priority. We use well-maintained vehicles and verified stays." },
    { icon: <Compass className="w-8 h-8 text-forest-700" />, title: "Personalized Service", desc: "Every traveler is unique. We customize itineraries to match your preferences." },
    { icon: <Users className="w-8 h-8 text-forest-700" />, title: "Expert Local Guides", desc: "Our local experts know the Himalayas like the back of their hand." },
    { icon: <Trophy className="w-8 h-8 text-forest-700" />, title: "Best Price Guarantee", desc: "Premium experiences at competitive prices with zero hidden costs." },
  ];

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
          
          <div className="w-full relative z-50 flex justify-center">
            <SearchFilter />
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

      {/* Featured Packages Section */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-20 -mt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900">Featured Packages</h2>
            <div className="h-1.5 w-24 bg-forest-700 mt-6 rounded-full" />
            <p className="text-slate-600 mt-6 font-inter text-lg">Hand-picked adventures for the ultimate Himalayan experience.</p>
          </div>
          <Link href="/packages" className="group flex items-center font-bold text-forest-700 hover:text-forest-900 transition-colors text-lg">
            View All Packages <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Why Choose Himvigo</h2>
            <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-forest-700 mb-6 group-hover:bg-forest-600 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{f.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed font-inter">{f.desc}</p>
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
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
