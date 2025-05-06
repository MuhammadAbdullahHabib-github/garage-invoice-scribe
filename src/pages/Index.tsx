
import { useState } from 'react';
import { toast } from "sonner";
import { FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import GarageLogo from "@/components/GarageLogo";
import { InvoiceData, EMPTY_INVOICE } from "@/lib/invoice-types";
import { generatePDF } from "@/lib/pdf-generator";

const Index = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    ...EMPTY_INVOICE,
    billNo: 'CLG-' + Date.now().toString().slice(-6),
    date: new Date(),
  });
  const [activeTab, setActiveTab] = useState<string>("edit");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <GarageLogo />
              <div>
                <h1 className="text-xl font-bold">CAR LINE GARAGE</h1>
                <p className="text-sm text-muted-foreground">Invoice Builder</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isGenerating}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleExportPDF}
                disabled={isGenerating}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mobile Tabs for Responsive Design */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <div className="bg-white rounded-md shadow">
                  <InvoiceForm value={invoice} onChange={handleInvoiceChange} />
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="overflow-auto">
                  <InvoicePreview invoice={invoice} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block bg-white rounded-md shadow">
            <InvoiceForm value={invoice} onChange={handleInvoiceChange} />
          </div>
          <div className="hidden lg:block overflow-auto">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
