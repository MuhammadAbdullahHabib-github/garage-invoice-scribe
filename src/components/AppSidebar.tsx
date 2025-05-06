
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogOut, Plus, Users } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CustomerDialog } from "@/components/CustomerDialog";

export function AppSidebar() {
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="p-2">
            <h2 className="text-lg font-bold">CAR LINE GARAGE</h2>
            <p className="text-sm text-muted-foreground">Invoice System</p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate("/")}
                isActive={location.pathname === "/"}
                tooltip="Create Invoice"
              >
                <FileText />
                <span>Create Invoice</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate("/invoices")}
                isActive={location.pathname === "/invoices"}
                tooltip="View Invoices"
              >
                <FileText />
                <span>Invoices</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate("/customers")} 
                isActive={location.pathname === "/customers"}
                tooltip="Customers"
              >
                <Users />
                <span>Customers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarSeparator />
          
          <div className="px-3 py-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => setIsCustomerDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Customer
            </Button>
          </div>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="px-3 py-2">
            <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <CustomerDialog 
        open={isCustomerDialogOpen} 
        onOpenChange={setIsCustomerDialogOpen} 
      />
    </>
  );
}
