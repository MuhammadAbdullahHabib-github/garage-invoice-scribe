
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from './invoice-types';

// Define the type for template settings
export interface PDFTemplateSettings {
  businessName: string;
  businessTagline: string;
  contactInfo: string;
  address: string;
  logoUrl: string;
  headerColor: string;
  textColor: string;
  templateId: string; // Added template ID
}

// Template definitions
export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultSettings: Partial<PDFTemplateSettings>;
}

// Available templates
export const PDF_TEMPLATES: PDFTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A professional, clean template with a colored header',
    thumbnail: '/templates/classic-thumbnail.png',
    defaultSettings: {
      headerColor: '#2e7d32',
      textColor: '#000000',
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A sleek, minimal design with accent colors',
    thumbnail: '/templates/modern-thumbnail.png',
    defaultSettings: {
      headerColor: '#1976d2',
      textColor: '#333333',
    }
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'A sophisticated template with formal styling',
    thumbnail: '/templates/elegant-thumbnail.png',
    defaultSettings: {
      headerColor: '#512da8',
      textColor: '#212121',
    }
  }
];

// Default template settings
const DEFAULT_SETTINGS: PDFTemplateSettings = {
  businessName: "Car Line Garage",
  businessTagline: "Professional Auto Service",
  contactInfo: "Phone: 123-456-7890 | Email: info@carlinegarage.com",
  address: "123 Auto Street, Mechanic City",
  logoUrl: "",
  headerColor: "#2e7d32",
  textColor: "#000000",
  templateId: "classic"
};

// Current template settings
let currentSettings: PDFTemplateSettings = { ...DEFAULT_SETTINGS };

// Function to update template settings
export const updatePDFTemplateSettings = (settings: PDFTemplateSettings): void => {
  currentSettings = { ...settings };
  localStorage.setItem('pdfTemplateSettings', JSON.stringify(settings));
};

// Function to get current template settings
export const getPDFTemplateSettings = (): PDFTemplateSettings => {
  const savedSettings = localStorage.getItem('pdfTemplateSettings');
  if (savedSettings) {
    try {
      currentSettings = JSON.parse(savedSettings);
      // Ensure templateId exists
      if (!currentSettings.templateId) {
        currentSettings.templateId = 'classic';
      }
    } catch (error) {
      console.error('Error parsing template settings:', error);
    }
  }
  return currentSettings;
};

// Function to get template by ID
export const getTemplateById = (id: string): PDFTemplate | undefined => {
  return PDF_TEMPLATES.find(template => template.id === id);
};

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
    
    // Get business name from template settings for the filename
    const settings = getPDFTemplateSettings();
    const businessName = settings.businessName.replace(/\s+/g, '_') || 'Car_Line_Garage';
    
    pdf.save(`${businessName}_Invoice_${invoiceData.billNo}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
