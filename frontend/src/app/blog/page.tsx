import Link from "next/link";
import Image from "next/image";
import {
  RiArrowRightUpLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiUser3Line,
  RiTimeLine,
} from "react-icons/ri";
import { BottomCTA } from "@/components/ui/BottomCTA";
import { getAllBlogs } from "@/lib/db/blogs";
import { getSettings } from "@/lib/db/settings";

export const dynamic = "force-dynamic";

function fmt(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readMinutes(text: string | undefined) {
  if (!text) return 3;
  const words = text
    .replace(/<[^>]*>/g, "")
    .trim()
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_blog_title || "Travel Blog | Himvigo Tours",
    description:
      settings.seo_blog_description ||
      "Read the latest stories and guides from the Himalayas.",
    keywords: settings.seo_blog_keywords || "travel blog, himachal",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogListPage() {
  const blogs = await getAllBlogs();
  const [featured, ...rest] = blogs;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero band */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-brand-blue overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-orange/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[24rem] w-[24rem] rounded-full bg-blue-500/15 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-3 py-1.5 backdrop-blur-md mb-5">
              <RiBookOpenLine className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/95">
                Travel Stories
              </span>
            </div>
            <h1 className="font-outfit text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl tracking-tight leading-[1.05] mb-5">
              The Himalayas,
              <br />
              <span className="text-brand-orange">in their own words.</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 font-inter max-w-xl">
              Stories, guides, and travel notes from our local crew —
              everything you wish you knew before your first trip.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 w-full">
        {!blogs.length && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
            <p className="text-sm text-slate-500">
              No stories published yet. Check back soon.
            </p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-16 block overflow-hidden rounded-3xl bg-slate-900 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)] transition-shadow duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-200">
                {featured.coverImage && (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                )}
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-md backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10 text-white">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <RiCalendarLine className="h-3 w-3" />
                    {fmt(featured.publishedAt)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="inline-flex items-center gap-1.5">
                    <RiUser3Line className="h-3 w-3" />
                    {featured.author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="inline-flex items-center gap-1.5">
                    <RiTimeLine className="h-3 w-3" />
                    {readMinutes(featured.excerpt || featured.content)} min
                  </span>
                </div>
                <h2 className="font-outfit text-2xl md:text-4xl font-extrabold leading-tight mb-4 transition-colors group-hover:text-brand-orange">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-white/80 leading-relaxed mb-6 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/20 px-4 py-2 text-sm font-bold backdrop-blur transition-colors group-hover:bg-brand-orange group-hover:ring-brand-orange">
                  Read story
                  <RiArrowRightUpLine className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid of remaining posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rest.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-xl hover:ring-slate-300 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  {blog.coverImage && (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {blog.category && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur">
                      {blog.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <RiCalendarLine className="h-3 w-3" />
                      {fmt(blog.publishedAt)}
                    </span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                    <span>{readMinutes(blog.excerpt || blog.content)} min</span>
                  </div>
                  <h3 className="font-outfit text-lg font-bold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-brand-orange">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-orange">
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
        )}
      </section>

      <BottomCTA />
    </main>
  );
}
