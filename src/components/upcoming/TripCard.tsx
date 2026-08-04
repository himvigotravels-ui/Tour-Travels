import Link from "next/link";
import { MapPin, CalendarDays, Clock, ArrowUpRight } from "lucide-react";
import type { UpcomingTrip } from "@/lib/db/upcomingTrips";

function parse(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MONTHS_LONG = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function dateRangeLabel(start: Date | null, end: Date | null): string {
  if (!start) return "Dates on request";
  const s = `${start.getDate()} ${MONTHS_LONG[start.getMonth()]}`;
  if (!end) return `${s} ${start.getFullYear()}`;
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const e = sameMonth
    ? `${end.getDate()} ${MONTHS_LONG[end.getMonth()]} ${end.getFullYear()}`
    : `${end.getDate()} ${MONTHS_LONG[end.getMonth()]} ${end.getFullYear()}`;
  return `${start.getDate()}${sameMonth ? "" : ` ${MONTHS_LONG[start.getMonth()]}`}–${e}`;
}

export function TripCard({ trip }: { trip: UpcomingTrip }) {
  const start = parse(trip.startDate);
  const end = parse(trip.endDate);
  const total = Math.max(trip.totalSeats || 0, trip.seatsLeft || 0);
  const left = Math.max(trip.seatsLeft || 0, 0);
  const booked = Math.max(total - left, 0);
  const bookedPct = total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;
  const almostGone = total > 0 && left > 0 && left <= Math.max(3, Math.ceil(total * 0.2));
  const highlights = (trip.highlights ?? []).slice(0, 3);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/70 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.15)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(10,60,93,0.35)]">
      {/* Image stage */}
      <div className="relative h-52 overflow-hidden">
        {trip.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-blue to-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

        {/* Date chip */}
        {start && (
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
              {MONTHS[start.getMonth()]}
            </span>
            <span className="font-outfit text-xl font-extrabold leading-none text-brand-blue">
              {String(start.getDate()).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Urgency / featured badge */}
        {almostGone ? (
          <div className="absolute right-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold text-white shadow-lg">
            {left} seat{left === 1 ? "" : "s"} left
          </div>
        ) : trip.isFeatured ? (
          <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand-blue shadow-lg backdrop-blur">
            Featured
          </div>
        ) : null}

        {/* Destination */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white drop-shadow">
          <MapPin className="h-4 w-4 text-brand-orange" />
          <span className="text-sm font-semibold">{trip.destination}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-outfit text-lg font-bold leading-snug text-brand-blue line-clamp-2">
          {trip.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-brand-orange" />
            {dateRangeLabel(start, end)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-orange" />
            {trip.durationDays}D / {trip.durationNights}N
          </span>
        </div>

        {highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Seats bar */}
        {total > 0 && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] font-medium">
              <span className="text-slate-400">{booked} booked</span>
              <span className={left <= 0 ? "text-slate-400" : "text-brand-orange"}>
                {left <= 0 ? "Fully booked" : `${left} left`}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-orange to-amber-400"
                style={{ width: `${bookedPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="text-[11px] font-medium text-slate-400">from</span>
            <p className="font-outfit text-xl font-extrabold leading-none text-brand-blue">
              ₹{Number(trip.pricePerPerson).toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] font-medium text-slate-400">per person</span>
          </div>
          <Link
            href={`/contact?trip=${encodeURIComponent(trip.title)}`}
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-brand-orange hover:shadow-brand-orange/30"
          >
            Reserve
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
