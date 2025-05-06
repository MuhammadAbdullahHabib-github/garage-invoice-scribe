
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    // Format route segments to readable text (e.g., "invoices" -> "Invoices")
    const formatSegment = (segment: string) => {
      if (segment.includes('-')) {
        return segment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      }
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    };
    
    // Format page title based on the path
    if (segments.length === 0) {
      return [{ label: 'Create Invoice', path: '/', active: true }];
    } else if (segments[0] === 'invoices' && segments.length === 1) {
      return [
        { label: 'Invoices', path: '/invoices', active: true }
      ];
    } else if (segments[0] === 'invoices' && segments.length > 1) {
      return [
        { label: 'Invoices', path: '/invoices', active: false },
        { label: 'Edit Invoice', path: path, active: true }
      ];
    } else if (segments[0] === 'customers') {
      return [
        { label: 'Customers', path: '/customers', active: true }
      ];
    } else {
      return segments.map((segment, index) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        return { 
          label: formatSegment(segment), 
          path: segmentPath, 
          active: isLast 
        };
      });
    }
  };
  
  const breadcrumbItems = getBreadcrumbItems();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="relative flex min-h-screen w-full flex-col">
          <div className="flex items-center border-b p-4">
            <SidebarTrigger />
            <div className="flex-1 ml-2">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={item.path}>
                      {item.active ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
                      )}
                      {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
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
