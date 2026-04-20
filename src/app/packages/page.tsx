import { getAllPackages } from "@/lib/db/packages";
import { PackageCard } from "@/components/ui/PackageCard";
import { PackageFilters, ClientFilterDispatcher } from "@/components/packages/PackageFilters";
import { SortDropdown } from "@/components/packages/SortDropdown";
import { BookingForm } from "@/components/packages/BookingForm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "All Tour Packages | Himvigo Tours",
  description: "Browse our premium selection of Himachal Pradesh itineraries, from Spiti Valley road trips to luxury Manali snow retreats.",
};

export default async function PackagesPage(props: { searchParams: Promise<{ dest?: string; dur?: string; cat?: string; q?: string; sort?: string }> }) {
  const searchParams = await props.searchParams;
  const destQuery = searchParams.dest?.toLowerCase();
  const durQuery = searchParams.dur; 
  const catQuery = searchParams.cat?.toLowerCase();
  const textQuery = searchParams.q?.toLowerCase();
  const sortQuery = searchParams.sort;
  
  let packages = await getAllPackages();
  
  if (destQuery) {
    packages = packages.filter(pkg => {
      const locationMatch = pkg.location.toLowerCase().replace(/\s+/g, '-').includes(destQuery) || pkg.location.toLowerCase().includes(destQuery);
      const slugMatch = pkg.slug.includes(destQuery);
      return locationMatch || slugMatch;
    });
  }

  if (durQuery) {
    packages = packages.filter(pkg => {
      if (durQuery === "3-5") return pkg.durationDays >= 3 && pkg.durationDays <= 5;
      if (durQuery === "6-8") return pkg.durationDays >= 6 && pkg.durationDays <= 8;
      if (durQuery === "9+") return pkg.durationDays >= 9;
      return true;
    });
  }

  if (catQuery) {
    packages = packages.filter(pkg => {
      const dbCategories = pkg.categories || [];
      // Also fallback to fuzzy searching description for category if categories array is missing
      const isTagged = dbCategories.some(c => c.toLowerCase() === catQuery);
      const isFuzzy = pkg.description?.toLowerCase().includes(catQuery) || pkg.title.toLowerCase().includes(catQuery);
      return isTagged || isFuzzy;
    });
  }

  if (textQuery) {
    packages = packages.filter(pkg => 
      pkg.title.toLowerCase().includes(textQuery) || 
      pkg.location.toLowerCase().includes(textQuery)
    );
  }

  if (sortQuery) {
    packages.sort((a, b) => {
      if (sortQuery === "price-asc") return a.pricePerPerson - b.pricePerPerson;
      if (sortQuery === "price-desc") return b.pricePerPerson - a.pricePerPerson;
      if (sortQuery === "duration-asc") return a.durationDays - b.durationDays;
      return 0; // "recommended"
    });
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Short Hero Banner */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-end pb-12 bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-spiti.png" 
            alt="Himalayan mountains" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 md:pt-32 pb-4 text-center md:text-left">
          <Link href="/" className="inline-flex items-center justify-center md:justify-start text-amber-400 hover:text-amber-300 font-inter text-sm md:text-base font-medium mb-3 md:mb-4 transition-colors">
            Home <ChevronRight className="w-4 h-4 mx-1" /> <span className="text-slate-300 font-normal">Packages</span>
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold text-white drop-shadow-xl leading-tight">
            Find Your Next <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Journey</span>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 w-full flex flex-col lg:flex-row gap-6 lg:gap-12 relative">
        
        {/* Hidden Modal Container */}
        <PackageFilters />

        {/* Packages Grid */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-slate-600 font-medium text-center sm:text-left text-sm sm:text-base">
                Showing <span className="font-bold text-slate-900 text-base sm:text-lg mx-1">{packages.length}</span> curated tours
              </h2>
              {/* Dispatch Component (Button) */}
              <ClientFilterDispatcher />
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Sort by:</span>
              <SortDropdown />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} tour={pkg} />
            ))}
          </div>
        </div>

        {/* Booking Form Sidebar */}
        <div className="w-full lg:w-1/3">
           <BookingForm />
        </div>
      </section>
    </main>
  );
}
