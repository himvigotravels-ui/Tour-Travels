import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { BottomCTA } from "@/components/ui/BottomCTA";
import { getAllBlogs } from "@/lib/db/blogs";

import { getSettings } from "@/lib/db/settings";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo_blog_title || "Travel Blog | Himvigo Tours",
    description: settings.seo_blog_description || "Read the latest stories and guides from the Himalayas.",
    keywords: settings.seo_blog_keywords || "travel blog, himachal",
  };
}

export default async function BlogListPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <section className="relative h-[40vh] flex items-center justify-center bg-brand-blue border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Blog Hero" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-outfit font-extrabold text-white mb-4">Travel <span className="text-brand-orange">Blog</span></h1>
          <p className="text-slate-200 text-lg font-medium">Stories and guides from the Himalayas</p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.map((blog, i) => (
            <Link key={i} href={`/blog/${blog.slug}`} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
               <div className="h-64 overflow-hidden relative">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/20">
                    {blog.category || "Travel Guide"}
                  </div>
               </div>
               <div className="p-8">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-orange transition-colors font-outfit">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed font-inter mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center font-bold text-brand-orange group-hover:text-brand-orange/80 transition-colors">
                    Read More <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="mt-24 p-10 md:p-16 bg-brand-blue/5 border border-brand-blue/10 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-6">
              Travel Newsletter
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6">Never miss a hidden gem.</h2>
            <p className="text-slate-600 font-inter text-lg">Join 15,000+ travelers getting our monthly insights, untouched destination guides, and exclusive early-bird package discounts.</p>
          </div>

          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <form className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl md:rounded-full border border-slate-200 shadow-xl shadow-slate-200/40">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full md:w-72 px-6 py-4 rounded-xl md:rounded-full bg-transparent outline-none text-slate-700 font-inter text-sm" 
                required 
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white font-bold rounded-xl md:rounded-full hover:bg-brand-orange/90 transition-colors shadow-md"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-4 text-center md:text-left font-medium flex items-center justify-center md:justify-start gap-1">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
      <BottomCTA />
    </main>
  );
}
