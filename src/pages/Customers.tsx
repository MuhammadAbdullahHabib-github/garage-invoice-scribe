
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Customer, SAMPLE_CUSTOMERS } from "@/lib/invoice-types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CustomerDialog } from "@/components/CustomerDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([...SAMPLE_CUSTOMERS]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleAddCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerToDelete);
      
      // Update both the state and the original SAMPLE_CUSTOMERS
      setCustomers(updatedCustomers);
      
      // Update the original array (in a real app this would be an API call)
      const index = SAMPLE_CUSTOMERS.findIndex(c => c.id === customerToDelete);
      if (index !== -1) {
        SAMPLE_CUSTOMERS.splice(index, 1);
      }
      
      toast.success("Customer deleted successfully");
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.contact}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setCustomerToDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No customers found. Add your first customer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <CustomerDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onAddCustomer={handleAddCustomer}
      />
      
      <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
