
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";

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

  // Add a new empty line item
  const addNewLine = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      particulars: '',
      rate: 0,
      amount: 0
    };
    
    handleLineItemsChange([...invoiceData.lineItems, newItem]);
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
        
        <div>
          <Label htmlFor="currency">Currency</Label>
          <div className="relative">
            <Button variant="outline" className="w-full justify-between mt-2">
              <div className="flex items-center">
                <div className="w-6 h-4 mr-2 overflow-hidden">
                  <span className="flex items-center justify-center text-xs">🇺🇸</span>
                </div>
                USD - United State Dollar
              </div>
              <span>▼</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Product</h3>
        
        <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium">
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-center">Qty*</div>
          <div className="col-span-3 text-center">Tax</div>
          <div className="col-span-2"></div>
        </div>
        
        {invoiceData.lineItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 mb-4 items-center">
            <div className="col-span-5 flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <Input 
                  value={item.particulars} 
                  placeholder="Item name" 
                  onChange={(e) => {
                    const newItems = [...invoiceData.lineItems];
                    newItems[index].particulars = e.target.value;
                    handleLineItemsChange(newItems);
                  }}
                  className="mb-1"
                />
                <Input 
                  value={item.rate || ''} 
                  type="number" 
                  placeholder="Price" 
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value) || 0;
                    const newItems = [...invoiceData.lineItems];
                    newItems[index].rate = rate;
                    newItems[index].amount = rate;
                    handleLineItemsChange(newItems);
                  }}
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <Input 
                type="number" 
                value="1"
                className="text-center" 
                onChange={() => {}}
              />
            </div>
            
            <div className="col-span-3">
              <Button variant="outline" className="w-full justify-between">
                10% <span>▼</span>
              </Button>
            </div>
            
            <div className="col-span-2 flex justify-end items-center">
              <Button variant="ghost" size="icon" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full border-dashed mt-2 text-green-600"
          onClick={addNewLine}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Line
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Add Coupon</h3>
          <Button variant="outline" className="w-full justify-between">
            Select... <span>▼</span>
          </Button>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Add Discount</h3>
          <Button variant="outline" className="w-full justify-between">
            Winter Sale 20% <span>▼</span>
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Notes</h3>
        <textarea 
          placeholder="Add Notes"
          className="w-full border rounded-md p-3 min-h-[100px] resize-none"
        ></textarea>
      </div>
    </div>
  );
}

export default InvoiceForm;
