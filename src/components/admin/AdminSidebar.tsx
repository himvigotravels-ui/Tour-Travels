"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  RiDashboardLine,
  RiSuitcaseLine,
  RiArticleLine,
  RiMapPinLine,
  RiStarLine,
  RiRunLine,
  RiTaxiLine,
  RiMailLine,
  RiSearchLine,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiLandscapeLine,
} from "react-icons/ri";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: RiDashboardLine },
  { title: "Packages", href: "/admin/packages", icon: RiSuitcaseLine },
  { title: "Blogs", href: "/admin/blogs", icon: RiArticleLine },
  { title: "Destinations", href: "/admin/destinations", icon: RiMapPinLine },
  { title: "Testimonials", href: "/admin/testimonials", icon: RiStarLine },
  { title: "Activities", href: "/admin/activities", icon: RiRunLine },
  { title: "Cab Services", href: "/admin/cab", icon: RiTaxiLine },
  { title: "Inquiries", href: "/admin/inquiries", icon: RiMailLine },
  { title: "SEO", href: "/admin/seo", icon: RiSearchLine },
  { title: "Settings", href: "/admin/settings", icon: RiSettings4Line },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="px-6 py-5 border-b border-sidebar-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
            <RiLandscapeLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Himvigo</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold px-3 mb-1">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(0, 7).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    className="gap-3 px-3 py-2.5 rounded-lg font-medium transition-all"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold px-3 mb-1">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.slice(7).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="gap-3 px-3 py-2.5 rounded-lg font-medium transition-all"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium"
        >
          <RiLogoutBoxLine className="w-4 h-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
