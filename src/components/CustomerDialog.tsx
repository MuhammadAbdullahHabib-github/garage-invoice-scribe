
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Customer, SAMPLE_CUSTOMERS } from "@/lib/invoice-types";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCustomer?: (customer: Customer) => void;
}

export function CustomerDialog({ open, onOpenChange, onAddCustomer }: CustomerDialogProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !contact) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    
    // Create new customer object
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      name,
      contact,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '-').toLowerCase()}`
    };
    
    // In a real app, this would make an API call
    setTimeout(() => {
      // We're just adding to the sample customers array for demo purposes
      SAMPLE_CUSTOMERS.push(newCustomer);
      
      if (onAddCustomer) {
        onAddCustomer(newCustomer);
      }
      
      toast.success(`Customer ${name} created successfully`);
      setIsLoading(false);
      setName("");
      setContact("");
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details to add them to your customers list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
