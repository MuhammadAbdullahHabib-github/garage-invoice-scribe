
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
  templateId: string;
  // Advanced customization options
  accentColor: string;
  fontFamily: string;
  showLines: boolean;
  companyInfoPosition: 'left' | 'center' | 'right';
  showLogo: boolean;
  showDiscount: boolean;
  showTax: boolean;
  dateFormat: string;
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
      accentColor: '#2e7d32',
      fontFamily: 'Helvetica',
      showLines: true,
      companyInfoPosition: 'left',
      showLogo: true,
      showDiscount: true,
      showTax: true,
      dateFormat: 'MM/dd/yyyy'
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
      accentColor: '#1976d2',
      fontFamily: 'Arial',
      showLines: false,
      companyInfoPosition: 'right',
      showLogo: true,
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd MMM yyyy'
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
      accentColor: '#9575cd',
      fontFamily: 'Times',
      showLines: true,
      companyInfoPosition: 'center',
      showLogo: true,
      showDiscount: true,
      showTax: true,
      dateFormat: 'MMMM dd, yyyy'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A bold, colorful design for creative businesses',
    thumbnail: '/templates/creative-thumbnail.png',
    defaultSettings: {
      headerColor: '#ff4081',
      textColor: '#424242',
      accentColor: '#ff4081',
      fontFamily: 'Tahoma',
      showLines: false,
      companyInfoPosition: 'left',
      showLogo: true,
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd/MM/yyyy'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'A clean, simple design with minimal elements',
    thumbnail: '/templates/minimalist-thumbnail.png',
    defaultSettings: {
      headerColor: '#607d8b',
      textColor: '#37474f',
      accentColor: '#607d8b',
      fontFamily: 'Roboto',
      showLines: false,
      companyInfoPosition: 'right',
      showLogo: false,
      showDiscount: false,
      showTax: true,
      dateFormat: 'yyyy-MM-dd'
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
  templateId: "classic",
  accentColor: "#2e7d32",
  fontFamily: "Helvetica",
  showLines: true,
  companyInfoPosition: "left",
  showLogo: true,
  showDiscount: true,
  showTax: true,
  dateFormat: "MM/dd/yyyy"
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
      // Initialize new fields if they don't exist
      if (currentSettings.accentColor === undefined) currentSettings.accentColor = DEFAULT_SETTINGS.accentColor;
      if (currentSettings.fontFamily === undefined) currentSettings.fontFamily = DEFAULT_SETTINGS.fontFamily;
      if (currentSettings.showLines === undefined) currentSettings.showLines = DEFAULT_SETTINGS.showLines;
      if (currentSettings.companyInfoPosition === undefined) currentSettings.companyInfoPosition = DEFAULT_SETTINGS.companyInfoPosition;
      if (currentSettings.showLogo === undefined) currentSettings.showLogo = DEFAULT_SETTINGS.showLogo;
      if (currentSettings.showDiscount === undefined) currentSettings.showDiscount = DEFAULT_SETTINGS.showDiscount;
      if (currentSettings.showTax === undefined) currentSettings.showTax = DEFAULT_SETTINGS.showTax;
      if (currentSettings.dateFormat === undefined) currentSettings.dateFormat = DEFAULT_SETTINGS.dateFormat;
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
