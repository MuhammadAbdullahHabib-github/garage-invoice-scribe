
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="relative flex min-h-screen w-full flex-col">
          <div className="flex items-center border-b p-4 gap-4">
            <SidebarTrigger />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Invoices</h1>
                <span className="text-muted-foreground">|</span>
                <span>Create Invoice</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-[250px] bg-background rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
