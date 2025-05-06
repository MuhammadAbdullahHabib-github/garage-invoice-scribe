
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FileDown, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoiceData, EMPTY_INVOICE } from "@/lib/invoice-types";
import { generatePDF } from "@/lib/pdf-generator";

// Sample invoices for demonstration
const sampleInvoices = [
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

const EditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Find the invoice with the matching id
    const foundInvoice = sampleInvoices.find(inv => inv.billNo === id);
    
    if (foundInvoice) {
      setInvoice(foundInvoice);
    } else {
      toast.error("Invoice not found");
      navigate('/invoices');
    }
    
    setIsLoading(false);
  }, [id, navigate]);

  const handleInvoiceChange = (updatedInvoice: InvoiceData) => {
    setInvoice(updatedInvoice);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!invoice) return;
    
    try {
      setIsGenerating(true);
      await generatePDF(invoice, "invoice-preview");
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Invoice updated successfully");
    navigate('/invoices');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!invoice) {
    return <div className="flex items-center justify-center h-96">Invoice not found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Invoice #{invoice.billNo}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600"
            disabled={isGenerating}
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md shadow">
          <h2 className="text-lg font-semibold p-4 border-b">Invoice Detail</h2>
          <InvoiceForm value={invoice} onChange={handleInvoiceChange} />
        </div>
        <div className="overflow-auto bg-gray-50 rounded-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="flex gap-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                disabled={isGenerating}
              >
                <Printer className="mr-1 h-4 w-4" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isGenerating}
              >
                <FileDown className="mr-1 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          <div className="p-4">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
