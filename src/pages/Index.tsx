
import { useState } from 'react';
import { toast } from "sonner";
import { FileDown, Printer, Save, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoiceData, EMPTY_INVOICE, saveInvoiceAsDraft } from "@/lib/invoice-types";
import { generatePDF } from "@/lib/pdf-generator";

const Index = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    ...EMPTY_INVOICE,
    billNo: 'CLG-' + Date.now().toString().slice(-6),
    date: new Date(),
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

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

  const handleSaveAsDraft = () => {
    saveInvoiceAsDraft(invoice);
    toast.success("Invoice saved as draft");
  };

  const handleSendInvoice = () => {
    toast.success("Invoice sent successfully!");
  };

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
            <Button variant="outline" size="sm">
              <Mail className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
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
          onClick={handleSaveAsDraft}
          disabled={isGenerating}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          onClick={handleSendInvoice}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isGenerating}
        >
          Send Invoice
        </Button>
      </div>
    </div>
  );
};

export default Index;
