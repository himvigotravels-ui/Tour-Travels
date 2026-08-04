import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { CalendarDays } from "lucide-react";
import { TripCard } from "@/components/upcoming/TripCard";
import type { UpcomingTrip } from "@/lib/db/upcomingTrips";

export default function UpcomingTrips({ trips }: { trips: UpcomingTrip[] }) {
  if (!trips || trips.length === 0) return null;
  const shown = trips.slice(0, 3);

  return (
    <section className="relative overflow-hidden border-y border-slate-200/70 bg-gradient-to-b from-white via-slate-50 to-slate-100 py-24">
      {/* Soft brand glows so the gradient has depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.07),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(10,60,93,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-blue">
                Fixed Departures
              </span>
            </div>
            <h2 className="font-outfit text-3xl font-bold leading-tight text-brand-blue md:text-5xl">
              Upcoming Group Trips
            </h2>
            <p className="mt-4 font-inter text-lg text-slate-500">
              Join a scheduled small-group departure — locked dates, verified
              stays and a guaranteed seat. Reserve before they fill up.
            </p>
          </div>

          <Link
            href="/upcoming-trips"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-blue px-5 py-3 font-bold text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-brand-blue/90 hover:-translate-y-0.5"
          >
            <CalendarDays className="h-5 w-5" />
            View all trips
            <RiArrowRightLine className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((trip) => (
            <TripCard key={trip.id ?? trip.slug} trip={trip} />
          ))}
        </div>

        {/* Footnote CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-4 text-center sm:flex-row sm:text-left">
          <p className="font-inter text-sm text-slate-600">
            Can&apos;t find a date that works?{" "}
            <span className="font-semibold text-brand-blue">
              We&apos;ll craft a private departure around your schedule.
            </span>
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-bold text-brand-orange transition-colors hover:text-brand-orange/80"
          >
            Plan a custom trip
            <RiArrowRightLine className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
