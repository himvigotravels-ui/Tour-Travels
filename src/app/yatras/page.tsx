import { getAllYatras } from "@/lib/db/yatras";
import { PackageCard } from "@/components/ui/PackageCard";
import { BookingForm } from "@/components/packages/BookingForm";
import { RiArrowRightSLine } from "react-icons/ri";
import { Landmark } from "lucide-react";
import Link from "next/link";

import { getSettings } from "@/lib/db/settings";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata("yatras", {
    title: "Himalayan Yatras & Pilgrimages | Himvigo Tours",
    description:
      "Guided pilgrimage yatras across Himachal Pradesh — Manimahesh, Shrikhand Mahadev, Kinnaur Kailash and more. Trusted arrangements, experienced guides.",
    keywords:
      "himachal yatra, manimahesh yatra, shrikhand mahadev, kinnaur kailash, pilgrimage tours, temple circuits",
    path: "/yatras",
  });
}

export default async function YatrasPage(props: {
  searchParams: Promise<{ dest?: string; dur?: string; q?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const destQuery = searchParams.dest?.toLowerCase();
  const durQuery = searchParams.dur;
  const textQuery = searchParams.q?.toLowerCase();
  const sortQuery = searchParams.sort;

  const [allYatras, settings] = await Promise.all([
    getAllYatras(),
    getSettings(),
  ]);

  let yatras = [...allYatras];

  if (destQuery) {
    yatras = yatras.filter((pkg) => {
      const locationMatch =
        pkg.location.toLowerCase().replace(/\s+/g, "-").includes(destQuery) ||
        pkg.location.toLowerCase().includes(destQuery);
      const slugMatch = pkg.slug.includes(destQuery);
      return locationMatch || slugMatch;
    });
  }

  if (durQuery) {
    yatras = yatras.filter((pkg) => {
      if (durQuery === "3-5") return pkg.durationDays >= 3 && pkg.durationDays <= 5;
      if (durQuery === "6-8") return pkg.durationDays >= 6 && pkg.durationDays <= 8;
      if (durQuery === "9+") return pkg.durationDays >= 9;
      return true;
    });
  }

  if (textQuery) {
    yatras = yatras.filter(
      (pkg) =>
        pkg.title.toLowerCase().includes(textQuery) ||
        pkg.location.toLowerCase().includes(textQuery)
    );
  }

  if (sortQuery) {
    yatras.sort((a, b) => {
      if (sortQuery === "price-asc") return a.pricePerPerson - b.pricePerPerson;
      if (sortQuery === "price-desc") return b.pricePerPerson - a.pricePerPerson;
      if (sortQuery === "duration-asc") return a.durationDays - b.durationDays;
      return 0;
    });
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Full Height Hero Banner */}
      <section className="relative w-full h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destinations/kinnaur.png"
            alt="Himalayan pilgrimage yatra"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 font-inter text-sm md:text-base font-medium mb-6 transition-colors bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
          >
            Home <RiArrowRightSLine className="w-4 h-4 mx-1" />{" "}
            <span className="text-slate-300 font-normal">Yatras</span>
          </Link>
          <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 shadow-2xl">
            <Landmark className="w-4 h-4" /> Sacred Pilgrimages
          </div>
          <h1 className="text-5xl md:text-8xl font-outfit font-extrabold text-white drop-shadow-2xl leading-[1.1] mb-8">
            Himalayan{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Yatras
            </span>
          </h1>
          <p className="text-slate-200 mt-6 max-w-2xl mx-auto text-lg md:text-xl font-medium drop-shadow-lg opacity-90">
            {settings.service_yatras_desc ||
              "Guided pilgrimage yatras across Himachal Pradesh — trusted arrangements, experienced guides and comfortable stays for devotees."}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 w-full flex flex-col lg:flex-row gap-6 lg:gap-12 relative">
        {/* Yatras Grid */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-slate-600 font-medium text-center sm:text-left text-sm sm:text-base">
                Showing{" "}
                <span className="font-bold text-slate-900 text-base sm:text-lg mx-1">
                  {yatras.length}
                </span>{" "}
                pilgrimage yatras
              </h2>
            </div>
          </div>

          {yatras.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {yatras.map((pkg) => (
                <PackageCard key={pkg.id} tour={pkg} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
              <Landmark className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <p className="text-slate-500 font-bold text-xl font-outfit">
                No yatras available right now.
              </p>
              <p className="text-slate-400 mt-2 font-medium">
                Tag a package as a yatra from the admin to see it here.
              </p>
            </div>
          )}
        </div>

        {/* Booking Form Sidebar */}
        <div className="w-full lg:w-1/3">
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
