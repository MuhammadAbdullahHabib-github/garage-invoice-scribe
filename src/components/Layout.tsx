
import { SidebarProvider, SidebarRail, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarRail />
        <SidebarInset className="relative flex min-h-screen w-full flex-col">
          <div className="flex items-center border-b p-4">
            <SidebarTrigger />
            <div className="ml-2 flex-1">
              <h1 className="text-lg font-semibold">CAR LINE GARAGE</h1>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
