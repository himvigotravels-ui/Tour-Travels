import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiUser3Line,
  RiTimeLine,
  RiArrowRightUpLine,
  RiBookOpenLine,
  RiPriceTag3Line,
} from "react-icons/ri";
import { getBlogBySlug, getAllBlogs } from "@/lib/db/blogs";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function fmt(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const wordCount = blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Related posts — same category if possible, otherwise latest
  const all = await getAllBlogs();
  const related = all
    .filter((b) => b.slug !== blog.slug)
    .sort((a, b) =>
      a.category === blog.category && b.category !== blog.category ? -1 : 1
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: [blog.coverImage],
    datePublished: blog.publishedAt,
    author: [{ "@type": "Person", name: blog.author }],
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-brand-blue overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-orange/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[24rem] w-[24rem] rounded-full bg-blue-500/15 blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-3 py-1.5 backdrop-blur-md mb-6 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/15 transition-colors"
          >
            <RiArrowLeftLine className="h-3.5 w-3.5" />
            Back to all stories
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/20 ring-1 ring-brand-orange/30 px-3 py-1 mb-5">
            <RiBookOpenLine className="h-3 w-3 text-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-orange">
              {blog.category || "Travel Story"}
            </span>
          </div>

          <h1 className="font-outfit text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6 drop-shadow-2xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              {blog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <RiUser3Line className="h-3.5 w-3.5 text-brand-orange" />
              {blog.author}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="inline-flex items-center gap-1.5">
              <RiCalendarLine className="h-3.5 w-3.5 text-brand-orange" />
              {fmt(blog.publishedAt)}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="inline-flex items-center gap-1.5">
              <RiTimeLine className="h-3.5 w-3.5 text-brand-orange" />
              {readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* Cover image — overlaps hero/article */}
      {blog.coverImage && (
        <div className="relative -mt-12 md:-mt-20 px-4 md:px-8">
          <div className="mx-auto max-w-4xl aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={1600}
              height={900}
              unoptimized
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="relative max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20 w-full">
        <div
          className={[
            "prose prose-lg prose-slate max-w-none",
            "prose-headings:font-outfit prose-headings:font-bold prose-headings:text-brand-blue prose-headings:tracking-tight",
            "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5",
            "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
            "prose-p:text-slate-700 prose-p:leading-[1.85] prose-p:font-inter prose-p:text-[1.05rem]",
            "prose-li:text-slate-700 prose-li:font-inter prose-li:leading-[1.8]",
            "prose-strong:text-slate-900",
            "prose-a:text-brand-orange hover:prose-a:text-brand-orange/80 prose-a:no-underline hover:prose-a:underline",
            "prose-blockquote:border-brand-orange prose-blockquote:bg-amber-50/40 prose-blockquote:text-slate-700 prose-blockquote:not-italic prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl",
            "prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8",
            "prose-code:bg-slate-100 prose-code:text-brand-blue prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:bg-slate-900 prose-pre:rounded-2xl",
            "prose-hr:border-slate-200",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length ? (
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1">
              <RiPriceTag3Line className="h-3 w-3" /> Tags
            </span>
            {blog.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-brand-orange/10 hover:text-brand-orange transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Author footer */}
        <div className="mt-12 flex items-center gap-4 rounded-3xl bg-slate-50 ring-1 ring-slate-100 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white font-bold text-xl shadow-md">
            {blog.author?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              Written by
            </p>
            <p className="font-outfit text-base font-bold text-brand-blue">
              {blog.author}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Local Himvigo travel writer
            </p>
          </div>
        </div>
      </article>

      {/* Related stories */}
      {related.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 mb-3">
                  <RiBookOpenLine className="h-3 w-3 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                    Keep reading
                  </span>
                </div>
                <h2 className="font-outfit text-2xl md:text-3xl font-bold text-brand-blue">
                  More stories from the Himalayas
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange/80 transition-colors"
              >
                All stories
                <RiArrowRightUpLine className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link
                  key={b.slug}
                  href={`/blog/${b.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-xl hover:ring-slate-300 transition-all duration-300"
                >
                  {b.coverImage && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      <Image
                        src={b.coverImage}
                        alt={b.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      <RiCalendarLine className="h-3 w-3" />
                      {fmt(b.publishedAt)}
                    </div>
                    <h3 className="font-outfit text-base font-bold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-brand-orange">
                      {b.title}
                    </h3>
                    {b.excerpt && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {b.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  const title = blog.metaTitle || `${blog.title} | Himvigo Blog`;
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    blog.content.substring(0, 160).replace(/<[^>]*>/g, "");

  return {
    title,
    description,
    keywords: blog.metaKeywords || blog.tags?.join(", "),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      authors: [blog.author],
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
    twitter: {
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}
