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
  headerStyle: 'full-color' | 'top-border' | 'minimal' | 'box' | 'side-color';
  invoiceNumberPosition: 'top-right' | 'top-left' | 'header-right' | 'header-left' | 'under-header';
  showLogo: boolean;
  logoPosition: 'left' | 'center' | 'right';
  showDiscount: boolean;
  showTax: boolean;
  dateFormat: string;
  // Custom fields
  customFields: CustomField[];
  // Pre-table fields options
  showMeterReading: boolean;
  showVehicleInfo: boolean;
  showCustomerInfo: boolean;
  showDueDate: boolean;
  showInvoiceDate: boolean;
  preTableCustomFields: CustomField[];
  // Design options
  borderStyle: 'none' | 'full' | 'header-only' | 'table-only';
  cornerStyle: 'square' | 'rounded';
  backgroundStyle: 'solid' | 'gradient' | 'pattern';
  backgroundValue: string;
  includeWatermark: boolean;
  watermarkText: string;
  includeSignatureLine: boolean;
  includeAmountInWords: boolean;
  includeFooterText: boolean;
  footerText: string;
  // Table style options
  tableHeaderStyle: 'filled' | 'bordered' | 'minimal';
  alternateRowColors: boolean;
  // Enhanced features
  includeTaxFields: boolean;
  includeTermsAndConditions: boolean;
  termsAndConditions: string;
  includeNotes: boolean;
  notes: string;
}

// Custom field type
export interface CustomField {
  id: string;
  label: string;
  value: string;
}

// Template definitions
export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultSettings: Partial<PDFTemplateSettings>;
}

// Available templates - expanded with new designs based on your image examples
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
      headerStyle: 'full-color',
      invoiceNumberPosition: 'top-right',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: true,
      showTax: true,
      dateFormat: 'MM/dd/yyyy',
      borderStyle: 'none',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: false,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'filled',
      alternateRowColors: false,
      includeTaxFields: true,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
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
      headerStyle: 'minimal',
      invoiceNumberPosition: 'top-right',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd MMM yyyy',
      borderStyle: 'none',
      cornerStyle: 'rounded',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: false,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'minimal',
      alternateRowColors: true,
      includeTaxFields: true,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
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
      headerStyle: 'top-border',
      invoiceNumberPosition: 'top-right',
      showLogo: true,
      logoPosition: 'center',
      showDiscount: true,
      showTax: true,
      dateFormat: 'MMMM dd, yyyy',
      borderStyle: 'full',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'bordered',
      alternateRowColors: false,
      includeTaxFields: true,
      includeTermsAndConditions: true,
      termsAndConditions: 'Payment is due within 30 days of receipt.',
      includeNotes: false,
      notes: ''
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
      headerStyle: 'box',
      invoiceNumberPosition: 'header-right',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'none',
      cornerStyle: 'rounded',
      backgroundStyle: 'gradient',
      backgroundValue: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: false,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'filled',
      alternateRowColors: true,
      includeTaxFields: true,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
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
      headerStyle: 'minimal',
      invoiceNumberPosition: 'top-right',
      showLogo: false,
      logoPosition: 'left',
      showDiscount: false,
      showTax: true,
      dateFormat: 'yyyy-MM-dd',
      borderStyle: 'none',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: false,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'minimal',
      alternateRowColors: false,
      includeTaxFields: false,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
    }
  },
  // Car Line templates based on the uploaded images
  {
    id: 'car-line',
    name: 'Car Line',
    description: 'Classic auto service invoice with detailed header',
    thumbnail: '/templates/car-line-thumbnail.png',
    defaultSettings: {
      headerColor: '#000000',
      textColor: '#000000',
      accentColor: '#333333',
      fontFamily: 'Arial',
      showLines: true,
      companyInfoPosition: 'center',
      headerStyle: 'full-color',
      invoiceNumberPosition: 'under-header',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: false,
      showTax: false,
      dateFormat: 'MM/dd/yyyy',
      borderStyle: 'full',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: true,
      watermarkText: 'Car Line Garage',
      includeSignatureLine: true,
      includeAmountInWords: false,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'bordered',
      alternateRowColors: false,
      includeTaxFields: false,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
    }
  },
  {
    id: 'teal-modern',
    name: 'Teal Modern',
    description: 'Vibrant teal header with clean layout',
    thumbnail: '/templates/teal-modern-thumbnail.png',
    defaultSettings: {
      headerColor: '#009688',
      textColor: '#ffffff',
      accentColor: '#009688',
      fontFamily: 'Roboto',
      showLines: true,
      companyInfoPosition: 'center',
      headerStyle: 'full-color',
      invoiceNumberPosition: 'header-right',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: false,
      showTax: false,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'none',
      cornerStyle: 'rounded',
      backgroundStyle: 'solid',
      backgroundValue: '#e0f2f1',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: true,
      footerText: 'Thank you for your business!',
      tableHeaderStyle: 'filled',
      alternateRowColors: true,
      includeTaxFields: false,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
    }
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    description: 'Clean design with colored text and simple borders',
    thumbnail: '/templates/bamboo-thumbnail.png',
    defaultSettings: {
      headerColor: '#00796b',
      textColor: '#00796b',
      accentColor: '#00796b',
      fontFamily: 'Times',
      showLines: true,
      companyInfoPosition: 'center',
      headerStyle: 'minimal',
      invoiceNumberPosition: 'under-header',
      showLogo: false,
      logoPosition: 'left',
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'full',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'bordered',
      alternateRowColors: false,
      includeTaxFields: true,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
    }
  },
  {
    id: 'yellow-stripe',
    name: 'Yellow Stripe',
    description: 'Modern design with diagonal yellow stripes',
    thumbnail: '/templates/yellow-stripe-thumbnail.png',
    defaultSettings: {
      headerColor: '#fdd835',
      textColor: '#000000',
      accentColor: '#fdd835',
      fontFamily: 'Arial',
      showLines: true,
      companyInfoPosition: 'left',
      headerStyle: 'side-color',
      invoiceNumberPosition: 'top-right',
      showLogo: false,
      logoPosition: 'left',
      showDiscount: true,
      showTax: true,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'none',
      cornerStyle: 'square',
      backgroundStyle: 'pattern',
      backgroundValue: 'diagonal-stripes',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: true,
      footerText: 'Terms & Conditions Apply',
      tableHeaderStyle: 'filled',
      alternateRowColors: true,
      includeTaxFields: true,
      includeTermsAndConditions: true,
      termsAndConditions: '1. All prices include tax\n2. Payment due upon receipt',
      includeNotes: false,
      notes: ''
    }
  },
  // New templates inspired by the uploaded images
  {
    id: 'graphical-market',
    name: 'Graphical Market',
    description: 'Teal header with simple table layout',
    thumbnail: '/templates/graphical-market-thumbnail.png',
    defaultSettings: {
      headerColor: '#00a99d',
      textColor: '#ffffff',
      accentColor: '#00a99d',
      fontFamily: 'Arial',
      showLines: true,
      companyInfoPosition: 'center',
      headerStyle: 'full-color',
      invoiceNumberPosition: 'under-header',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: false,
      showTax: false,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'none',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: false,
      footerText: '',
      tableHeaderStyle: 'filled',
      alternateRowColors: false,
      includeTaxFields: false,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
    }
  },
  {
    id: 'memo-style',
    name: 'Memo Style',
    description: 'Simple memo-style invoice with corporate header',
    thumbnail: '/templates/memo-style-thumbnail.png',
    defaultSettings: {
      headerColor: '#333333',
      textColor: '#000000',
      accentColor: '#333333',
      fontFamily: 'Arial',
      showLines: true,
      companyInfoPosition: 'left',
      headerStyle: 'box',
      invoiceNumberPosition: 'top-right',
      showLogo: true,
      logoPosition: 'left',
      showDiscount: false,
      showTax: true,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'full',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: true,
      footerText: 'Terms & Conditions:\n1. GST @ 18% or as per Govt. rule\n2. All disputes are subject to high court jurisdiction',
      tableHeaderStyle: 'bordered',
      alternateRowColors: false,
      includeTaxFields: true,
      includeTermsAndConditions: true,
      termsAndConditions: 'Payment due within 15 days',
      includeNotes: false,
      notes: ''
    }
  },
  {
    id: 'yellow-fold',
    name: 'Yellow Fold',
    description: 'Modern design with diagonal yellow header',
    thumbnail: '/templates/yellow-fold-thumbnail.png',
    defaultSettings: {
      headerColor: '#ffeb3b',
      textColor: '#000000',
      accentColor: '#ffeb3b',
      fontFamily: 'Arial',
      showLines: true,
      companyInfoPosition: 'left',
      headerStyle: 'side-color',
      invoiceNumberPosition: 'top-right',
      showLogo: false,
      logoPosition: 'left',
      showDiscount: false,
      showTax: true,
      dateFormat: 'dd/MM/yyyy',
      borderStyle: 'none',
      cornerStyle: 'square',
      backgroundStyle: 'solid',
      backgroundValue: '#ffffff',
      includeWatermark: false,
      watermarkText: '',
      includeSignatureLine: true,
      includeAmountInWords: true,
      includeFooterText: true,
      footerText: 'Terms & Conditions:',
      tableHeaderStyle: 'bordered',
      alternateRowColors: false,
      includeTaxFields: true,
      includeTermsAndConditions: false,
      termsAndConditions: '',
      includeNotes: false,
      notes: ''
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
  headerStyle: "full-color",
  invoiceNumberPosition: "top-right",
  showLogo: true,
  logoPosition: "left",
  showDiscount: true,
  showTax: true,
  dateFormat: "MM/dd/yyyy",
  customFields: [],
  // Pre-table fields
  showMeterReading: true,
  showVehicleInfo: true,
  showCustomerInfo: true,
  showDueDate: true,
  showInvoiceDate: true,
  preTableCustomFields: [],
  // Design options
  borderStyle: "none",
  cornerStyle: "square",
  backgroundStyle: "solid",
  backgroundValue: "#ffffff",
  includeWatermark: false,
  watermarkText: "",
  includeSignatureLine: true,
  includeAmountInWords: false,
  includeFooterText: false,
  footerText: "",
  tableHeaderStyle: "filled",
  alternateRowColors: false,
  includeTaxFields: false,
  includeTermsAndConditions: false,
  termsAndConditions: "",
  includeNotes: false,
  notes: ""
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
      
      // Initialize fields if they don't exist
      if (currentSettings.accentColor === undefined) currentSettings.accentColor = DEFAULT_SETTINGS.accentColor;
      if (currentSettings.fontFamily === undefined) currentSettings.fontFamily = DEFAULT_SETTINGS.fontFamily;
      if (currentSettings.showLines === undefined) currentSettings.showLines = DEFAULT_SETTINGS.showLines;
      if (currentSettings.companyInfoPosition === undefined) currentSettings.companyInfoPosition = DEFAULT_SETTINGS.companyInfoPosition;
      if (currentSettings.headerStyle === undefined) currentSettings.headerStyle = DEFAULT_SETTINGS.headerStyle;
      if (currentSettings.invoiceNumberPosition === undefined) currentSettings.invoiceNumberPosition = DEFAULT_SETTINGS.invoiceNumberPosition;
      if (currentSettings.showLogo === undefined) currentSettings.showLogo = DEFAULT_SETTINGS.showLogo;
      if (currentSettings.logoPosition === undefined) currentSettings.logoPosition = DEFAULT_SETTINGS.logoPosition;
      if (currentSettings.showDiscount === undefined) currentSettings.showDiscount = DEFAULT_SETTINGS.showDiscount;
      if (currentSettings.showTax === undefined) currentSettings.showTax = DEFAULT_SETTINGS.showTax;
      if (currentSettings.dateFormat === undefined) currentSettings.dateFormat = DEFAULT_SETTINGS.dateFormat;
      
      // Initialize pre-table fields
      if (currentSettings.showMeterReading === undefined) currentSettings.showMeterReading = DEFAULT_SETTINGS.showMeterReading;
      if (currentSettings.showVehicleInfo === undefined) currentSettings.showVehicleInfo = DEFAULT_SETTINGS.showVehicleInfo;
      if (currentSettings.showCustomerInfo === undefined) currentSettings.showCustomerInfo = DEFAULT_SETTINGS.showCustomerInfo;
      if (currentSettings.showDueDate === undefined) currentSettings.showDueDate = DEFAULT_SETTINGS.showDueDate;
      if (currentSettings.showInvoiceDate === undefined) currentSettings.showInvoiceDate = DEFAULT_SETTINGS.showInvoiceDate;
      if (currentSettings.preTableCustomFields === undefined) currentSettings.preTableCustomFields = DEFAULT_SETTINGS.preTableCustomFields;
      
      // Initialize design fields
      if (currentSettings.customFields === undefined) currentSettings.customFields = DEFAULT_SETTINGS.customFields;
      if (currentSettings.borderStyle === undefined) currentSettings.borderStyle = DEFAULT_SETTINGS.borderStyle;
      if (currentSettings.cornerStyle === undefined) currentSettings.cornerStyle = DEFAULT_SETTINGS.cornerStyle;
      if (currentSettings.backgroundStyle === undefined) currentSettings.backgroundStyle = DEFAULT_SETTINGS.backgroundStyle;
      if (currentSettings.backgroundValue === undefined) currentSettings.backgroundValue = DEFAULT_SETTINGS.backgroundValue;
      if (currentSettings.includeWatermark === undefined) currentSettings.includeWatermark = DEFAULT_SETTINGS.includeWatermark;
      if (currentSettings.watermarkText === undefined) currentSettings.watermarkText = DEFAULT_SETTINGS.watermarkText;
      if (currentSettings.includeSignatureLine === undefined) currentSettings.includeSignatureLine = DEFAULT_SETTINGS.includeSignatureLine;
      if (currentSettings.includeAmountInWords === undefined) currentSettings.includeAmountInWords = DEFAULT_SETTINGS.includeAmountInWords;
      if (currentSettings.includeFooterText === undefined) currentSettings.includeFooterText = DEFAULT_SETTINGS.includeFooterText;
      if (currentSettings.footerText === undefined) currentSettings.footerText = DEFAULT_SETTINGS.footerText;
      
      // Initialize new fields for enhanced features
      if (currentSettings.tableHeaderStyle === undefined) currentSettings.tableHeaderStyle = DEFAULT_SETTINGS.tableHeaderStyle;
      if (currentSettings.alternateRowColors === undefined) currentSettings.alternateRowColors = DEFAULT_SETTINGS.alternateRowColors;
      if (currentSettings.includeTaxFields === undefined) currentSettings.includeTaxFields = DEFAULT_SETTINGS.includeTaxFields;
      if (currentSettings.includeTermsAndConditions === undefined) currentSettings.includeTermsAndConditions = DEFAULT_SETTINGS.includeTermsAndConditions;
      if (currentSettings.termsAndConditions === undefined) currentSettings.termsAndConditions = DEFAULT_SETTINGS.termsAndConditions;
      if (currentSettings.includeNotes === undefined) currentSettings.includeNotes = DEFAULT_SETTINGS.includeNotes;
      if (currentSettings.notes === undefined) currentSettings.notes = DEFAULT_SETTINGS.notes;
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

// Helper functions for background patterns and gradients
export const getBackgroundPatternUrl = (patternName: string): string => {
  switch (patternName) {
    case 'diagonal-stripes':
      return '/patterns/diagonal-stripes.png';
    case 'dots':
      return '/patterns/dots.png';
    case 'grid':
      return '/patterns/grid.png';
    case 'waves':
      return '/patterns/waves.png';
    default:
      return '';
  }
};

export const getGradientPresets = (): {id: string, name: string, value: string}[] => {
  return [
    { 
      id: 'blue-purple', 
      name: 'Blue to Purple', 
      value: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)' 
    },
    { 
      id: 'orange-pink', 
      name: 'Orange to Pink', 
      value: 'linear-gradient(90deg, hsla(22, 100%, 78%, 1) 0%, hsla(2, 78%, 62%, 1) 100%)' 
    },
    { 
      id: 'green-yellow', 
      name: 'Green to Yellow', 
      value: 'linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)' 
    },
    { 
      id: 'soft-peach', 
      name: 'Soft Peach', 
      value: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)' 
    },
    { 
      id: 'light-blue', 
      name: 'Light Blue', 
      value: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)' 
    },
    { 
      id: 'warm-sunset', 
      name: 'Warm Sunset', 
      value: 'linear-gradient(90deg, #ee9ca7, #ffdde1)' 
    },
    { 
      id: 'cool-mint', 
      name: 'Cool Mint', 
      value: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)' 
    },
    { 
      id: 'gentle-care', 
      name: 'Gentle Care', 
      value: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)' 
    }
  ];
};
