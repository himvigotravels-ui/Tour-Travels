import { PackageCard } from "@/components/ui/PackageCard";
import { SearchFilter } from "@/components/SearchFilter";
import RegionSlider from "@/components/home/RegionSlider";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import ActivitiesSlider from "@/components/home/ActivitiesSlider";
import BlogSection from "@/components/home/BlogSection";
import HeroSlider from "@/components/home/HeroSlider";
import { WhyChooseUs, Feature } from "@/components/home/WhyChooseUs";
import { ServiceCard } from "@/components/home/ServiceCard";
import { getFeaturedPackages } from "@/lib/db/packages";
import { getAllDestinations } from "@/lib/db/destinations";
import { getLatestBlogs } from "@/lib/db/blogs";
import { getAllTestimonials } from "@/lib/db/testimonials";
import { getAllActivities } from "@/lib/db/activities";
import { BottomCTA } from "@/components/ui/BottomCTA";
import {
  RiArrowRightLine,
  RiCompass3Line,
  RiCarLine,
  RiGroupLine,
  RiNavigationLine,
  RiStarSFill,
  RiPhoneLine,
  RiPlayCircleLine,
  RiArrowDownLine,
  RiVerifiedBadgeLine,
} from "react-icons/ri";
import Link from "next/link";
import { getSettings } from "@/lib/db/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_home_title || "Best Himachal Tour Packages & Spiti Valley Tours",
    description: settings.seo_home_description || "Experience the magic of Himachal Pradesh with Himvigo.",
    keywords: settings.seo_home_keywords || "himachal tours, spiti valley",
    alternates: {
      canonical: "/",
    },
  };
}


export default async function HomePage() {
  // Fetch all dynamic data from database
  const [packages, destinations, blogs, testimonials, activities, settings] = await Promise.all([
    getFeaturedPackages(),
    getAllDestinations(),
    getLatestBlogs(3),
    getAllTestimonials(),
    getAllActivities(),
    getSettings(),
  ]);

  let features: Feature[] = [];
  if (settings.why_choose_us_json) {
    try {
      const parsed = JSON.parse(settings.why_choose_us_json);
      if (Array.isArray(parsed)) features = parsed;
    } catch {
      features = [];
    }
  }
  if (features.length === 0) {
    features = [
      {
        title: "Verified Drivers",
        desc: "Every driver is background-checked and skilled in navigating Himachal's mountain roads safely.",
        image: "/hero-1.png",
        icon: "RiShieldCheckLine",
      },
      {
        title: "100% Local Experts",
        desc: "Our guides are born and raised in the Himalayas. They know the hidden trails, the local legends, and the best ways to keep you safe.",
        image: "/hero-2.png",
        icon: "RiGroupLine",
      },
      {
        title: "Award Winning",
        desc: "Recognised by Himachal Tourism for service quality and safety standards.",
        image: "/hero-3.png",
        icon: "RiTrophyLine",
      },
      {
        title: "Curated Itineraries",
        desc: "Hand-built journeys that balance adventure, culture and downtime.",
        image: "/hero-4.png",
        icon: "RiCompass3Line",
      },
      {
        title: "Comfortable Vehicles",
        desc: "Modern fleet maintained for long mountain drives with experienced chauffeurs.",
        image: "/hero-5.png",
        icon: "RiCarLine",
      },
      {
        title: "Flexible Booking",
        desc: "Easy rescheduling and transparent pricing — pay only for what you use.",
        image: "/hero-6.png",
        icon: "RiCheckboxCircleLine",
      },
    ];
  }

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
    "telephone": settings.site_phone || "+91-XXXXXXXXXX"
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative min-h-screen h-auto md:h-screen flex flex-col overflow-hidden bg-brand-blue pt-24">
        <HeroSlider />

        {/* Main content — left aligned for editorial confidence */}
        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left column — content */}
            <div className="lg:col-span-7 max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-3 py-1.5 backdrop-blur-md mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/95">
                  Premium Himalayan Travel Co.
                </span>
              </div>

              <h1 className="font-outfit text-4xl md:text-6xl lg:text-[5.2rem] font-extrabold text-white drop-shadow-2xl tracking-tight leading-[1.05] mb-6">
                {settings.hero_headline
                  ? settings.hero_headline
                      .split(" ")
                      .map((word: string, i: number) => {
                        if (
                          word.toLowerCase() === "himachal" ||
                          word.toLowerCase() === "himalayas"
                        ) {
                          return (
                            <span
                              key={i}
                              className="relative inline-block text-brand-orange ml-2"
                            >
                              {word}
                              <svg
                                className="absolute -bottom-2 left-0 w-[110%] -translate-x-[5%] h-5 text-brand-orange/80 z-[-1]"
                                viewBox="0 0 100 20"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M0,15 Q30,0 100,10"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          );
                        }
                        return i === 0 ? word : " " + word;
                      })
                  : "Find Your Soul in The Himalayas"}
              </h1>

              <p className="text-base md:text-lg text-slate-100/90 mb-8 font-inter max-w-xl drop-shadow-xl leading-relaxed">
                {settings.hero_subheadline ||
                  "Uncover the raw beauty of Spiti, scale the heights of Manali, and relax in the pines of Kasol. Authentic, secure, and unmatched."}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                <Link
                  href="/packages"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-orange/30 transition-all duration-300 hover:bg-brand-orange/90 hover:-translate-y-0.5 font-outfit"
                >
                  {settings.hero_cta_text || "Explore Packages"}
                  <RiArrowRightLine className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`tel:${settings.site_phone || "+917018318824"}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3.5 font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 font-outfit"
                >
                  <RiPhoneLine className="w-5 h-5" />
                  {settings.hero_cta_call || "Book a Cab"}
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    "from-amber-400 to-orange-500",
                    "from-emerald-400 to-teal-500",
                    "from-blue-400 to-indigo-500",
                    "from-rose-400 to-pink-500",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`h-9 w-9 rounded-full bg-gradient-to-br ${g} ring-2 ring-brand-blue shadow-md`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <RiStarSFill key={i} className="h-3.5 w-3.5" />
                    ))}
                    <span className="ml-1 text-sm font-bold text-white">
                      4.9
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-white/70">
                    Trusted by 10,000+ Himalayan travellers
                  </p>
                </div>
              </div>
            </div>

            {/* Right column — floating glass stat card */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative ml-auto max-w-sm">
                {/* Glow */}
                <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-orange/20 via-transparent to-blue-500/20 blur-3xl" />

                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center gap-2 mb-5">
                    <RiVerifiedBadgeLine className="h-5 w-5 text-brand-orange" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                      Why travellers pick us
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "12+", label: "Years\nin the mountains" },
                      { value: "1.5k+", label: "Curated\nexpeditions" },
                      { value: "100%", label: "Local\nguides & drivers" },
                      { value: "4.9★", label: "Verified\ntraveller rating" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-white/8 ring-1 ring-white/10 p-4 transition-colors hover:bg-white/15"
                      >
                        <div className="font-outfit text-2xl font-extrabold text-white">
                          {s.value}
                        </div>
                        <div className="mt-1 whitespace-pre-line text-[11px] font-medium leading-tight text-white/70">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini play row */}
                  <button className="group mt-5 flex w-full items-center gap-3 rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3 text-left transition-colors hover:bg-white/15">
                    <RiPlayCircleLine className="h-7 w-7 text-brand-orange transition-transform group-hover:scale-110" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Watch our story
                      </div>
                      <div className="text-[10px] text-white/60">
                        90 seconds · what we stand for
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 hidden md:flex items-center justify-center pb-2">
          <div className="flex flex-col items-center gap-1 text-white/60">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Scroll
            </span>
            <RiArrowDownLine className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative z-30 w-full max-w-5xl mx-auto px-4 pb-12 mt-auto pt-6">
          <SearchFilter />
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-blue">
                  What we do
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-4 leading-tight">
                Crafted experiences,<br />
                <span className="text-brand-orange">end&#8209;to&#8209;end.</span>
              </h2>
              <p className="text-slate-500 text-lg font-inter max-w-xl">
                From single-day cab transfers to multi-week curated journeys
                across Himachal — we own every step of the trip.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 font-bold text-brand-orange hover:text-brand-orange/80 transition-colors"
              >
                Talk to a planner
                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <ServiceCard
              title="Tour Packages"
              description={
                settings.service_packages_desc ||
                "Thoughtfully planned itineraries covering Himachal's most loved destinations."
              }
              href="/packages"
              ctaLabel="View packages"
              image="/hero-spiti.png"
              icon={<RiCompass3Line className="w-6 h-6" />}
              accent="blue"
            />
            <ServiceCard
              title="Cab Services"
              description={
                settings.service_cab_desc ||
                "Reliable cab service across Himachal Pradesh with verified, experienced drivers."
              }
              href="/cab"
              ctaLabel="Book a cab"
              image="/cab-fleet.png"
              icon={<RiCarLine className="w-6 h-6" />}
              accent="orange"
            />
            <ServiceCard
              title="Tempo Traveller"
              description={
                settings.service_tempo_desc ||
                "Traveling with a group? Our tempo travellers seat 9 to 26 passengers comfortably."
              }
              href="/contact"
              ctaLabel="Inquire for group"
              image="/taxi-hero.png"
              icon={<RiGroupLine className="w-6 h-6" />}
              accent="blue"
            />
            <ServiceCard
              title="Custom Travel Plans"
              description={
                settings.service_custom_desc ||
                "Not finding what you're looking for? Tell us what you have in mind."
              }
              href="/contact"
              ctaLabel="Create itinerary"
              image="/dharamshala.png"
              icon={<RiNavigationLine className="w-6 h-6" />}
              accent="orange"
            />
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-6 leading-tight">Featured Expeditions</h2>
            <p className="text-slate-500 text-lg font-inter">Handpicked itineraries designed for the ultimate Himalayan experience.</p>
          </div>
          <Link href="/packages" className="inline-flex items-center gap-2 font-bold text-brand-orange hover:text-brand-orange/80 transition-colors group">
            View All Packages
            <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} tour={pkg} />
          ))}
        </div>
      </section>

      {/* Popular Destinations Slider */}
      <section className="py-24 bg-brand-blue overflow-hidden w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8">
          <RegionSlider destinations={destinations} />
        </div>
      </section>

      {/* Why Choose Us - Enhanced Responsive Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-6 leading-tight">Why Choose Himvigo</h2>
            <p className="text-slate-500 text-lg font-inter">Experience the difference of traveling with true Himalayan experts.</p>
          </div>

          <WhyChooseUs features={features} />
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-28 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-6 leading-tight">Adventures Await</h2>
            <p className="text-slate-500 text-lg font-inter">Curated experiences to make your Himalayan trip unforgettable.</p>
          </div>
          <ActivitiesSlider activities={activities} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Blogs Section */}
      <BlogSection blogs={blogs} />

      <BottomCTA />
    </main>
  );
}
