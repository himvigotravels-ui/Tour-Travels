import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Share2, MessageCircle, Compass, ChevronRight } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "@/lib/db/blogs";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${readTimeMinutes} min read`;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-end pb-16 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
          <Link href="/blog" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6 font-bold text-sm uppercase tracking-[0.2em] group transition-colors drop-shadow-md">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Travel Blog
          </Link>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-extrabold text-white mb-8 drop-shadow-xl leading-[1.1] max-w-4xl">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" /> {new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-amber-500" /> {blog.author}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> {readTime}</span>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 md:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div 
              className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-outfit prose-headings:font-bold prose-headings:text-slate-900 
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-inter prose-p:text-[1.1rem]
              prose-li:text-slate-600 prose-li:font-inter prose-li:leading-[1.8]
              prose-img:rounded-3xl prose-img:shadow-lg prose-a:text-amber-600 hover:prose-a:text-amber-700"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Article Footer */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <button className="flex items-center gap-2 text-slate-500 hover:text-amber-500 font-bold uppercase text-sm tracking-wide transition-colors group">
                  <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Share
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-amber-500 font-bold uppercase text-sm tracking-wide transition-colors group">
                  <MessageCircle className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Comment
                </button>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-700 font-bold text-xl font-outfit">
                   {blog.author.charAt(0)}
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Written By</p>
                   <p className="text-slate-900 font-bold font-outfit">{blog.author}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              
              {/* Lead Magnet Box */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-inner relative z-10">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-outfit font-bold text-slate-900 mb-3 relative z-10">Free Himalayan Checklist</h3>
                <p className="text-slate-500 text-sm mb-6 font-inter leading-relaxed relative z-10">Don't pack without this. Get our ultimate high-altitude packing list sent directly to your inbox.</p>
                <form className="space-y-3 relative z-10">
                  <input type="email" placeholder="Your email address" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 text-sm font-inter transition-all" required />
                  <button type="submit" className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-forest-700 transition-colors shadow-md text-sm">Send Me The PDF</button>
                </form>
              </div>

              {/* Consultation CTA */}
              <div className="bg-forest-900 p-8 pt-10 rounded-3xl shadow-2xl shadow-forest-900/30 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-forest-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-3xl font-outfit font-extrabold text-white mb-4 relative z-10 leading-tight">Craving an adventure?</h3>
                  <p className="text-slate-300 font-medium mb-8 relative z-10 text-sm">Let our local experts craft a personalized itinerary specifically for your dates.</p>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-all relative z-10 shadow-lg group">
                    Plan Your Trip <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
              
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}
