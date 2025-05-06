
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, FileText, Search, Trash2, X } from "lucide-react";
import { formatCurrency, InvoiceData, EMPTY_INVOICE } from "@/lib/invoice-types";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample invoices for demonstration
const sampleInvoices: InvoiceData[] = [
  {
    ...EMPTY_INVOICE,
    billNo: "CLG-123456",
    date: new Date(2023, 5, 15),
    customer: {
      id: "1",
      name: "Ahmed Khan",
      contact: "0303 1234567",
    },
    vehicleNo: "ABC-123",
    vehicleType: "Sedan",
    meterReading: "45,000 km",
    lineItems: [
      { id: "1", particulars: "Oil Change", rate: 1500, amount: 1500 },
      { id: "2", particulars: "Filter Replacement", rate: 800, amount: 800 },
    ],
    total: 2300,
  },
  {
    ...EMPTY_INVOICE,
    billNo: "CLG-789012",
    date: new Date(2023, 6, 20),
    customer: {
      id: "2",
      name: "Sara Malik",
      contact: "0300 7654321", 
    },
    vehicleNo: "XYZ-789",
    vehicleType: "SUV",
    meterReading: "32,000 km",
    lineItems: [
      { id: "1", particulars: "Brake Servicing", rate: 3500, amount: 3500 },
      { id: "2", particulars: "Wheel Alignment", rate: 1200, amount: 1200 },
    ],
    total: 4700,
  },
];

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceData[]>(sampleInvoices);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDeleteInvoice = () => {
    if (invoiceToDelete) {
      const updatedInvoices = invoices.filter(invoice => invoice.billNo !== invoiceToDelete);
      setInvoices(updatedInvoices);
      toast.success("Invoice deleted successfully");
      setInvoiceToDelete(null);
    }
  };

  const handleEditInvoice = (invoiceId: string) => {
    navigate(`/invoice/edit/${invoiceId}`);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Filter by search query
      const matchesQuery = searchQuery ? 
        (invoice.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         invoice.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         invoice.billNo.toLowerCase().includes(searchQuery.toLowerCase())) : true;
      
      // Filter by date
      const matchesDate = dateFilter ? 
        invoice.date.toDateString() === dateFilter.toDateString() : true;
      
      return matchesQuery && matchesDate;
    });
  }, [invoices, searchQuery, dateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button onClick={() => navigate("/")} className="bg-green-500 hover:bg-green-600">
          <FileText className="mr-2 h-4 w-4" /> Create New Invoice
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer, vehicle, or invoice ID"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={(date) => {
                setDateFilter(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {(searchQuery || dateFilter) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" /> Clear filters
          </Button>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.billNo}>
                <TableCell className="font-medium">{invoice.billNo}</TableCell>
                <TableCell>
                  {invoice.date.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>{invoice.customer?.name || "N/A"}</TableCell>
                <TableCell>{invoice.vehicleNo}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditInvoice(invoice.billNo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => setInvoiceToDelete(invoice.billNo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {invoices.length === 0 ? (
                    <>No invoices found. Create your first invoice.</>
                  ) : (
                    <>No matching invoices found. Try different search criteria.</>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
