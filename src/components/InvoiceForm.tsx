
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomerSelector } from "./CustomerSelector";
import { LineItemsTable } from "./LineItemsTable";
import { 
  InvoiceData, 
  EMPTY_INVOICE, 
  LineItem, 
  Customer,
  calculateTotal,
  generateBillNumber
} from "@/lib/invoice-types";

interface InvoiceFormProps {
  value: InvoiceData;
  onChange: (invoice: InvoiceData) => void;
}

export function InvoiceForm({ value, onChange }: InvoiceFormProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(value);

  // Generate a bill number on component mount if one doesn't exist
  useEffect(() => {
    if (!invoiceData.billNo) {
      setInvoiceData((prev) => ({
        ...prev,
        billNo: generateBillNumber()
      }));
    }
  }, []);

  // Update parent state when our local state changes
  useEffect(() => {
    onChange(invoiceData);
  }, [invoiceData, onChange]);
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setInvoiceData({ ...invoiceData, date });
    }
  };
  
  const handleCustomerChange = (customer: Customer | null) => {
    setInvoiceData({ ...invoiceData, customer });
  };
  
  const handleLineItemsChange = (lineItems: LineItem[]) => {
    const total = calculateTotal(lineItems);
    setInvoiceData({ ...invoiceData, lineItems, total });
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Billed to</h3>
          <CustomerSelector 
            value={invoiceData.customer} 
            onChange={handleCustomerChange} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={invoiceData.vehicleType || ''}
              onChange={(e) => handleInputChange("vehicleType", e.target.value)}
              placeholder="Subject"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoiceData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceData.date ? (
                    format(invoiceData.date, "d MMMM yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoiceData.date}
                  onSelect={handleDateChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Product</h3>
        <LineItemsTable items={invoiceData.lineItems} onChange={handleLineItemsChange} />
      </div>
    </div>
  );
}

export default InvoiceForm;
