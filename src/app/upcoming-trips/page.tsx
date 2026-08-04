import { getUpcomingTrips } from "@/lib/db/upcomingTrips";
import { TripCard } from "@/components/upcoming/TripCard";
import { BottomCTA } from "@/components/ui/BottomCTA";
import { RiArrowRightSLine } from "react-icons/ri";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata("upcoming-trips", {
    title: "Upcoming Group Trips & Fixed Departures | Himvigo",
    description:
      "Join a scheduled small-group departure across Himachal — locked dates, verified stays and guaranteed seats. Reserve your spot before they fill up.",
    keywords:
      "himachal group trips, fixed departures, upcoming tours, spiti group trip, himalayan group departure",
    path: "/upcoming-trips",
  });
}

export default async function UpcomingTripsPage() {
  const trips = await getUpcomingTrips();

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* Hero */}
      <section className="relative flex min-h-[62vh] w-full items-center justify-center overflow-hidden bg-slate-900 pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destinations/spiti.png"
            alt="Upcoming Himalayan group trips"
            className="h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-inter text-sm font-medium text-amber-400 backdrop-blur-sm transition-colors hover:text-amber-300"
          >
            Home <RiArrowRightSLine className="mx-1 h-4 w-4" />{" "}
            <span className="font-normal text-slate-300">Upcoming Trips</span>
          </Link>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-brand-orange shadow-2xl">
            <CalendarDays className="h-4 w-4" /> Fixed Departures
          </div>
          <h1 className="mb-6 font-outfit text-5xl font-extrabold leading-[1.05] text-white drop-shadow-2xl md:text-7xl">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Group Trips
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl font-inter text-lg font-medium text-slate-200 opacity-90 drop-shadow-lg md:text-xl">
            Scheduled small-group departures across Himachal — locked dates,
            verified stays and a guaranteed seat. Reserve before they sell out.
          </p>
        </div>
      </section>

      {/* Trips grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 lg:py-24">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-outfit text-2xl font-bold text-brand-blue md:text-3xl">
            {trips.length > 0
              ? `${trips.length} departure${trips.length === 1 ? "" : "s"} open`
              : "Departures"}
          </h2>
          <p className="max-w-md font-inter text-sm text-slate-500">
            Prices are per person on twin-sharing. Seats update in real time —
            book early to secure your preferred date.
          </p>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id ?? trip.slug} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-24 text-center">
            <CalendarDays className="mx-auto mb-6 h-16 w-16 text-slate-300" />
            <p className="font-outfit text-xl font-bold text-slate-500">
              No scheduled departures right now.
            </p>
            <p className="mt-2 font-medium text-slate-400">
              Tell us where you&apos;d like to go and we&apos;ll plan a custom trip.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-brand-blue px-8 py-3.5 font-bold text-white shadow-xl transition-all hover:bg-brand-blue/90"
            >
              Plan a custom trip
            </Link>
          </div>
        )}
      </section>

      <BottomCTA />
    </main>
  );
}
