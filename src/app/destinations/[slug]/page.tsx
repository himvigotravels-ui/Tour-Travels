import { notFound } from "next/navigation";
import { PackageCard } from "@/components/ui/PackageCard";
import { BottomCTA } from "@/components/ui/BottomCTA";
import { getAllPackages } from "@/lib/db/packages";
import { getDestinationBySlug, getAllDestinations } from "@/lib/db/destinations";
import { getInternalPageBySlug } from "@/lib/db/pages";
import DestinationGroupLandingPage from "@/components/destinations/DestinationGroupLandingPage";
import { MapPin, Sun, Snowflake, Compass, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((dest) => ({
    slug: dest.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Real Destination wins over a same-slug nav-group; only fall through
  // to the nav-group when no destination exists with this slug.
  const destinationFirst = await getDestinationBySlug(slug);
  const internalPage = !destinationFirst
    ? await getInternalPageBySlug(slug)
    : null;
  if (internalPage && internalPage.type === "destination") {
    const title = internalPage.metaTitle || internalPage.title;
    const description =
      internalPage.metaDescription ||
      internalPage.description ||
      `Explore our best ${internalPage.title} and plan your dream trip with Himvigo.`;
    const ogImage = internalPage.ogImage || internalPage.coverImage || undefined;
    return {
      title,
      description,
      keywords: internalPage.metaKeywords || undefined,
      alternates: { canonical: `/destinations/${slug}` },
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  }

  const destination = destinationFirst;

  if (!destination) return {};

  const title = destination.metaTitle || `${destination.name} Travel Guide | Himvigo`;
  const description = destination.metaDescription || destination.description.substring(0, 160);

  return {
    title,
    description,
    keywords: destination.metaKeywords,
    alternates: {
      canonical: `/destinations/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: destination.image ? [{ url: destination.image }] : []
    },
    twitter: {
      title,
      description,
      images: destination.image ? [destination.image] : []
    }
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // A real Destination row wins over a same-slug nav-group. The nav-group
  // landing only renders when there's no destination with this slug —
  // i.e. when the slug names a curated *group* like "honeymoon-spots"
  // rather than an actual place.
  const destinationFirst = await getDestinationBySlug(slug);

  const internalPage = !destinationFirst
    ? await getInternalPageBySlug(slug)
    : null;
  if (internalPage && internalPage.type === "destination") {
    // Prefer manually-selected destinations; fall back to category-array matching
    const manualIds = (internalPage.destinations ?? []).map((d) => d.id);
    let groupDestinations;
    if (manualIds.length > 0) {
      const idOrder = new Map<string, number>(
        manualIds.map((id, idx) => [id, idx])
      );
      const allDestinations = await getAllDestinations();
      groupDestinations = allDestinations
        .filter((d) => d.id && manualIds.includes(d.id))
        .sort(
          (a, b) =>
            (idOrder.get(a.id ?? "") ?? 0) -
            (idOrder.get(b.id ?? "") ?? 0)
        );
    } else {
      const allDestinations = await getAllDestinations();
      groupDestinations = allDestinations.filter(
        (d) =>
          (d.categories || [])
            .map((c) => c.toLowerCase())
            .includes(slug.toLowerCase()) ||
          (d.categories || []).some(
            (c) => c.toLowerCase() === internalPage.title.toLowerCase()
          )
      );
    }

    return (
      <DestinationGroupLandingPage
        groupName={internalPage.title}
        destinations={groupDestinations}
        description={internalPage.description || undefined}
      />
    );
  }

  const destination = destinationFirst;

  if (!destination) {
    notFound();
  }

  const allPackages = await getAllPackages();
  const destinationPackages = allPackages.filter((pkg) => 
    pkg.location.toLowerCase().includes(destination.name.toLowerCase()) ||
    destination.name.toLowerCase().includes(pkg.location.toLowerCase())
  );

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 z-0">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-24">
          <h4 className="text-brand-orange font-bold uppercase tracking-[0.4em] text-sm md:text-base mb-6 drop-shadow-md">
            {destination.tagline}
          </h4>
          <h1 className="text-6xl md:text-9xl font-outfit font-extrabold text-white mb-6 drop-shadow-2xl tracking-tighter">
            {destination.name}
          </h1>
        </div>
      </section>

      {/* Info & Packages Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
          {/* Left: Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-outfit font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">About {destination.name}</h2>
            <div 
              className="text-slate-600 text-lg leading-relaxed mb-12 font-inter font-medium prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: destination.description }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-6">
                  <Compass className="w-6 h-6 text-brand-orange" /> Key Highlights
                </h3>
                <ul className="space-y-4">
                  {destination.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                      <ShieldCheck className="w-4 h-4 text-brand-blue" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-blue">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Best Time to Visit</h4>
                    <p className="text-slate-900 font-bold">{destination.bestTime}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-orange">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Altitude</h4>
                    <p className="text-slate-900 font-bold">{destination.altitude}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Vibe</h4>
                    <p className="text-slate-900 font-bold">{destination.vibe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Links / Custom Quote */}
          <div className="space-y-12">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Compass className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-outfit font-bold mb-6 relative z-10">Traveler Tips</h3>
              <div className="space-y-6 relative z-10">
                <p className="flex items-start gap-4 text-slate-300 leading-relaxed italic text-sm">
                  &quot;Always carry extra layers of clothing, even in summer. The mountain weather can change in minutes.&quot;
                </p>
                <p className="flex items-start gap-4 text-slate-300 leading-relaxed italic text-sm">
                  &quot;Respect local customs and monasteries. Always walk clockwise around shrines.&quot;
                </p>
                <p className="flex items-start gap-4 text-slate-300 leading-relaxed italic text-sm">
                  &quot;Carry enough cash as ATMs can be unreliable in high-altitude regions.&quot;
                </p>
              </div>
            </div>
            
            <div className="p-8 rounded-3xl bg-brand-orange text-slate-900 shadow-xl shadow-brand-orange/20">
              <h3 className="text-xl font-bold mb-4">Want a Custom Trip?</h3>
              <p className="text-sm font-medium mb-8 leading-relaxed">Our experts can create a personalized 100% customized itinerary for your trip to {destination.name}.</p>
              <Link href="/contact" className="block text-center py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-colors">
                Request Custom Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Full-width Packages Grid */}
        <div className="border-t border-slate-200 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue">
                Packages for {destination.name}
              </h2>
              <div className="h-1.5 w-24 bg-brand-orange mt-6 rounded-full" />
              <p className="text-slate-600 mt-6 font-inter text-lg">
                Explore our handpicked itineraries for {destination.name} and surrounding valleys.
              </p>
            </div>
            {destinationPackages.length > 0 && (
              <p className="bg-white px-6 py-2 rounded-full border border-slate-200 font-bold text-slate-500 shadow-sm">
                Showing {destinationPackages.length} Results
              </p>
            )}
          </div>

          {destinationPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationPackages.map((pkg) => (
                <PackageCard key={pkg.id} tour={pkg} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-300">
              <Compass className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <p className="text-slate-500 font-bold text-xl italic">No packages available for this destination yet.</p>
              <Link href="/contact" className="mt-8 inline-block text-brand-orange font-bold hover:underline">
                Inquire about custom {destination.name} trips &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
