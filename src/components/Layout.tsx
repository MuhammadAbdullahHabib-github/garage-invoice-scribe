
import { useState } from "react";
import { SidebarProvider, SidebarRail, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
          <div className="flex items-center border-b p-4 gap-4">
            <SidebarTrigger />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-lg font-semibold">CAR LINE GARAGE</h1>
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8 w-[250px] bg-background"
                />
              </div>
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
