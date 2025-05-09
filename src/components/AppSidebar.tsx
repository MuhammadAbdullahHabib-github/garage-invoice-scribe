
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, Users, FileImage } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import GarageLogo from "./GarageLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="floating" className="z-50">
      <div className="p-3 flex items-center justify-center">
        <GarageLogo className="h-8 w-8" />
      </div>
      
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/")}
              isActive={location.pathname === "/"}
              tooltip="Create Invoice"
            >
              <FileText className="h-5 w-5" />
              <span>Create Invoice</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/invoices")}
              isActive={location.pathname === "/invoices"}
              tooltip="View Invoices"
            >
              <FileText className="h-5 w-5" />
              <span>Invoices</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/customers")} 
              isActive={location.pathname === "/customers"}
              tooltip="Customers"
            >
              <Users className="h-5 w-5" />
              <span>Customers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/customize-invoice")} 
              isActive={location.pathname === "/customize-invoice"}
              tooltip="Customize Invoice"
            >
              <FileImage className="h-5 w-5" />
              <span>Invoice Template</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
          
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start mt-2 text-red-500 hover:text-red-600 rounded-lg"
            onClick={() => alert('Logout functionality would go here')}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
          
          <div className="pt-4 pb-2 px-2">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=user" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
              <div className="ml-2 overflow-hidden">
                <p className="text-sm font-medium">Car Line Garage</p>
                <p className="text-xs text-muted-foreground truncate">admin@carlinegarage.com</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
