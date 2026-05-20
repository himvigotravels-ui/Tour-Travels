import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AdminSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-1 h-5" />
            <span className="text-xs font-medium text-muted-foreground">
              Admin
            </span>
          </header>
          <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
