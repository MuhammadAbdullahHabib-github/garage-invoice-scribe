
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { FileDown, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoiceData, EMPTY_INVOICE, getDraftInvoice, saveInvoiceAsDraft } from "@/lib/invoice-types";
import { generatePDF } from "@/lib/pdf-generator";

const EditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData>({...EMPTY_INVOICE});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const draftInvoice = getDraftInvoice(id);
      
      if (draftInvoice) {
        setInvoice(draftInvoice);
      } else {
        toast.error("Invoice not found");
        navigate('/invoices');
      }
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

  const handleUpdateInvoice = () => {
    saveInvoiceAsDraft(invoice);
    toast.success("Invoice updated successfully");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading invoice...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Form Section */}
      <div className="bg-white border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Invoice Detail</h2>
          <InvoiceForm value={invoice} onChange={handleInvoiceChange} />
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="bg-gray-50 h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Payment Page</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>
        <div className="p-6 overflow-auto h-[calc(100vh-9rem)]">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10">
        <Button
          variant="outline"
          onClick={() => {
            saveInvoiceAsDraft(invoice);
            toast.success("Invoice saved as draft");
          }}
          disabled={isGenerating}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          onClick={handleUpdateInvoice}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isGenerating}
        >
          <Save className="mr-2 h-4 w-4" />
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditInvoice;
