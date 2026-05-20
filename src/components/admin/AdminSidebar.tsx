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
  SidebarSeparator,
} from "@/components/ui/sidebar";
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
  RiCompass3Line,
  RiSparkling2Line,
  RiNotification3Line,
  RiServiceLine,
} from "react-icons/ri";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: RiDashboardLine },
      { title: "Inquiries", href: "/admin/inquiries", icon: RiMailLine },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { title: "Packages", href: "/admin/packages", icon: RiSuitcaseLine },
      { title: "Destinations", href: "/admin/destinations", icon: RiMapPinLine },
      { title: "Activities", href: "/admin/activities", icon: RiRunLine },
      { title: "Cab Services", href: "/admin/cab", icon: RiTaxiLine },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Nav Groups", href: "/admin/nav-groups", icon: RiCompass3Line },
      { title: "What We Do", href: "/admin/services", icon: RiServiceLine },
      { title: "Why Choose Us", href: "/admin/why-choose-us", icon: RiSparkling2Line },
      { title: "Blogs", href: "/admin/blogs", icon: RiArticleLine },
      { title: "Testimonials", href: "/admin/testimonials", icon: RiStarLine },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Booking Popup", href: "/admin/booking-popup", icon: RiNotification3Line },
      { title: "SEO", href: "/admin/seo", icon: RiSearchLine },
      { title: "Settings", href: "/admin/settings", icon: RiSettings4Line },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-2">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
            <RiLandscapeLine className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="truncate text-sm font-bold tracking-tight">Himvigo</h2>
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navGroups.map((group, idx) => (
          <div key={group.label}>
            {idx > 0 && (
              <SidebarSeparator className="my-1 group-data-[collapsible=icon]:hidden" />
            )}
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={isActive}
                          className="gap-3 rounded-lg px-3 py-2 font-medium transition-all"
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={handleLogout}
              className="w-full justify-start gap-3 font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center"
            >
              <RiLogoutBoxLine className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
