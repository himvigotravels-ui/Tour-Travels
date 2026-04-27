import Link from "next/link";
import Image from "next/image";
import {
  RiArrowRightUpLine,
  RiCalendarLine,
  RiUser3Line,
  RiBookOpenLine,
} from "react-icons/ri";

import { BlogData } from "@/lib/db/blogs";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readingMinutes(text: string | undefined) {
  if (!text) return 3;
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export default function BlogSection({ blogs = [] }: { blogs: BlogData[] }) {
  if (!blogs.length) return null;

  const [featured, ...rest] = blogs;
  const others = rest.slice(0, 3);

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Soft brand accent backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(10,60,93,0.05),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 mb-4">
              <RiBookOpenLine className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                Travel Stories
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-4 leading-tight">
              Stories &amp; Guides<br />
              <span className="text-brand-orange">from the Himalayas.</span>
            </h2>
            <p className="text-slate-500 text-lg font-inter max-w-xl">
              Travel tips, hidden routes and first-hand journals from our
              guides and travellers.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-bold text-brand-orange hover:text-brand-orange/80 transition-colors"
            >
              Read all stories
              <RiArrowRightUpLine className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* Magazine grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group lg:col-span-7 relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)]"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              {featured.coverImage && (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

              {/* Top tag */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-md backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Featured
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7 text-white">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <RiCalendarLine className="h-3 w-3" />
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="inline-flex items-center gap-1.5">
                    <RiUser3Line className="h-3 w-3" />
                    {featured.author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{readingMinutes(featured.excerpt)} min read</span>
                </div>
                <h3 className="font-outfit text-2xl md:text-4xl font-extrabold leading-tight line-clamp-3 mb-3 transition-colors group-hover:text-brand-orange">
                  {featured.title}
                </h3>
                <p className="hidden md:block text-sm md:text-base text-white/85 line-clamp-2 max-w-xl">
                  {featured.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur transition-colors group-hover:bg-brand-orange group-hover:ring-brand-orange">
                  Read story
                  <RiArrowRightUpLine className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                </span>
              </div>
            </div>
          </Link>

          {/* Right column — stacked cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {others.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm hover:shadow-xl hover:ring-slate-300 transition-all duration-300 flex flex-col sm:flex-row lg:flex-row"
              >
                <div className="relative h-44 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden bg-slate-200">
                  {blog.coverImage && (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <RiCalendarLine className="h-3 w-3" />
                      {formatDate(blog.publishedAt)}
                    </span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                    <span>{readingMinutes(blog.excerpt)} min</span>
                  </div>
                  <h3 className="font-outfit text-base font-bold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-brand-orange">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 hidden sm:block">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-bold text-brand-orange">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange/10">
                      <RiUser3Line className="h-3 w-3" />
                    </span>
                    <span className="truncate">{blog.author}</span>
                    <RiArrowRightUpLine className="ml-auto h-3.5 w-3.5 transition-transform group-hover:rotate-45 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
