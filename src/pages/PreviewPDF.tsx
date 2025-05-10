
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InvoicePreview } from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
import { InvoiceData } from '@/lib/invoice-types';
import { generatePDF } from '@/lib/pdf-generator';
import { FileText, Download } from 'lucide-react';

const PreviewPDF = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // In a real application, this would fetch from your backend
        // For now, let's get it from localStorage
        const storedInvoices = localStorage.getItem('invoices');
        if (storedInvoices) {
          const invoices = JSON.parse(storedInvoices);
          const foundInvoice = invoices.find((inv: InvoiceData) => inv.id === id);
          if (foundInvoice) {
            setInvoice(foundInvoice);
          }
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);
  
  const handleDownloadPDF = async () => {
    if (!invoice) return;
    
    try {
      await generatePDF(invoice, 'invoice-preview');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Not Found</h1>
        <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been deleted.</p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Invoice Preview</h1>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <div className="bg-gray-100 p-8 rounded-lg">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
};

export default PreviewPDF;
