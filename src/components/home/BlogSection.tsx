import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

import { BlogData } from "@/lib/db/blogs";

export default function BlogSection({ blogs = [] }: { blogs: BlogData[] }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Travel Stories & Guides</h2>
            <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full" />
            <p className="text-slate-500 mt-6 font-inter text-lg max-w-2xl font-medium">Get inspired by our latest travel tips, destination guides, and stories from the heart of the Himalayas.</p>
          </div>
          <Link href="/blog" className="group flex items-center font-bold text-amber-600 hover:text-amber-700 transition-colors text-lg">
            Read All Blogs <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {blogs.map((blog, i) => (
            <Link key={i} href={`/blog/${blog.slug}`} className="group block">
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-lg">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/20">
                  Travel Guide
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> By {blog.author}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors font-outfit line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed font-inter text-sm line-clamp-3">
                {blog.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
