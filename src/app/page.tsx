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
  RiPhoneLine,
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
    getLatestBlogs(4),
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
      <section className="relative bg-white">
        {/* Cinematic image stage — content sits comfortably inside */}
        <div className="relative h-[80vh] min-h-[620px] max-h-[820px] overflow-hidden pt-24">
          <HeroSlider />

          <div className="relative z-10 h-full w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col justify-center">
            <div className="w-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/25 px-3 py-1.5 backdrop-blur-md mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Premium Himalayan Travel Co.
                </span>
              </div>

              <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl tracking-tight leading-[1.05] mb-5">
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
                                className="absolute -bottom-2 left-0 w-[110%] -translate-x-[5%] h-4 text-brand-orange/80 z-[-1]"
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
                  : "Your Himachal Adventure Starts Here"}
              </h1>

              <p className="text-base md:text-lg text-white/85 mb-7 font-inter drop-shadow-lg leading-relaxed">
                {settings.hero_subheadline ||
                  "Safe rides. Local expertise. Unforgettable journeys through the heart of the Himalayas."}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/packages"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-bold text-white shadow-xl shadow-brand-orange/30 transition-all duration-300 hover:bg-brand-orange/90 hover:-translate-y-0.5 font-outfit"
                >
                  {settings.hero_cta_text || "Plan Your Trip"}
                  <RiArrowRightLine className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`tel:${settings.site_phone || "+917018318824"}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 font-outfit"
                >
                  <RiPhoneLine className="w-5 h-5" />
                  {settings.hero_cta_call || "Call Us Now"}
                </a>
              </div>
            </div>
          </div>

          {/* Soft bottom fade so the photo blends into the next band */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.35) 65%, rgba(255,255,255,0.85) 90%, #fff 100%)",
            }}
          />
        </div>

        {/* Search band — clean and dedicated, no nested cards */}
        <div className="relative z-20 -mt-12 md:-mt-16 px-4">
          <div className="mx-auto w-full max-w-6xl">
            <SearchFilter />
          </div>
        </div>

        {/* Trust band — single tidy strip with separators */}
        <div className="px-4 mt-10 md:mt-14">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 overflow-hidden">
              {[
                { value: "12+", label: "Years in the mountains" },
                { value: "1.5k+", label: "Curated expeditions" },
                { value: "100%", label: "Local guides & drivers" },
                { value: "4.9★", label: "10,000+ reviews" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-1 py-5 px-3 text-center"
                >
                  <span className="font-outfit text-2xl md:text-3xl font-extrabold text-brand-blue leading-none">
                    {s.value}
                  </span>
                  <span className="text-[11px] md:text-xs font-medium text-slate-500 leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
      <section className="relative py-28 bg-white overflow-hidden">
        {/* Subtle radial highlight so the white doesn't feel flat */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(10,60,93,0.06),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                Things to do
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-4 leading-tight">
              Adventures Await
            </h2>
            <p className="text-slate-500 text-lg font-inter">
              Curated experiences to make your Himalayan trip unforgettable.
            </p>
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
