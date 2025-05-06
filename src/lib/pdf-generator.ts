
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from './invoice-types';

export const generatePDF = async (
  invoiceData: InvoiceData,
  elementId: string
): Promise<void> => {
  try {
    const input = document.getElementById(elementId);
    if (!input) throw new Error('Element not found');

    const canvas = await html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Choose page size based on number of line items
    const isLargeInvoice = invoiceData.lineItems.length > 10;
    const pageSize = isLargeInvoice ? 'a4' : 'a5';
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize
    });

    const imgProps = pdf.getImageProperties(imgData);
    
    // Calculate dimensions to fit the page
    let pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // If content is too tall, scale it down
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      const ratio = pdf.internal.pageSize.getHeight() / pdfHeight;
      pdfWidth = pdfWidth * ratio;
      pdfHeight = pdfHeight * ratio;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Car_Line_Garage_Invoice_${invoiceData.billNo}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
