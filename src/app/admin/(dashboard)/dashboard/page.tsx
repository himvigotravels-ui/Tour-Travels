import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RiSuitcaseLine,
  RiArticleLine,
  RiMapPinLine,
  RiMailLine,
  RiStarLine,
  RiRunLine,
  RiTaxiLine,
  RiArrowRightUpLine,
} from "react-icons/ri";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    packagesCount,
    blogsCount,
    destinationsCount,
    testimonialCount,
    activitiesCount,
    inquiriesCount,
    recentInquiries,
  ] = await Promise.all([
    prisma.package.count(),
    prisma.blog.count(),
    prisma.destination.count(),
    prisma.testimonial.count(),
    prisma.activity.count(),
    prisma.inquiry.count(),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { title: "Packages", value: packagesCount, icon: RiSuitcaseLine, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/admin/packages" },
    { title: "Blogs", value: blogsCount, icon: RiArticleLine, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/blogs" },
    { title: "Destinations", value: destinationsCount, icon: RiMapPinLine, color: "text-amber-500", bg: "bg-amber-500/10", href: "/admin/destinations" },
    { title: "Testimonials", value: testimonialCount, icon: RiStarLine, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/testimonials" },
    { title: "Activities", value: activitiesCount, icon: RiRunLine, color: "text-rose-500", bg: "bg-rose-500/10", href: "/admin/activities" },
    { title: "Inquiries", value: inquiriesCount, icon: RiMailLine, color: "text-cyan-500", bg: "bg-cyan-500/10", href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Himvigo admin panel. Manage all your website content from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>View all</span>
                  <RiArrowRightUpLine className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Inquiries</CardTitle>
          <Link href="/admin/inquiries" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            View all <RiArrowRightUpLine className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No inquiries yet. They will appear here when submitted.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {inquiry.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {inquiry.fromCity && inquiry.toCity ? `${inquiry.fromCity} → ${inquiry.toCity}` : inquiry.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={inquiry.status === "new" ? "default" : inquiry.status === "contacted" ? "secondary" : "outline"}>
                      {inquiry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
