
import React from 'react';
import { PDFTemplateSettings } from '@/lib/pdf-generator';
import { InvoiceHeader } from './InvoiceHeader';

interface InvoiceHeaderTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
  currentTemplateId: string;
}

export const InvoiceHeaderTemplates: React.FC<InvoiceHeaderTemplatesProps> = ({
  onSelectTemplate,
  currentTemplateId
}) => {
  // Template definitions based on the provided images
  const templates = [
    {
      id: 'car-line',
      name: 'Car Line Garage',
      settings: {
        businessName: "Car Line Garage",
        businessTagline: "Professional Auto Service",
        contactInfo: "Phone: 030-35419671 | Email: carlinegarage1@gmail.com",
        address: "Car Line Garage 10-B1 Samsani Road Johar Town, Lahore Punjab",
        logoUrl: "/lovable-uploads/b4672c93-0cae-41c1-9001-9eb088db3e82.png", // Car line logo
        headerColor: "#333333",
        textColor: "#000000",
        accentColor: "#333333",
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "left",
        headerStyle: "minimal",
        invoiceNumberPosition: "top-right",
        showLogo: true,
        logoPosition: "left"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'memo-style',
      name: 'Memo Style',
      settings: {
        businessName: "YOUR COMPANY NAME",
        businessTagline: "Write here your company slogan",
        contactInfo: "Mob: 1234-567890 | Email: yourcompany@gmail.com",
        address: "Write here your company address",
        logoUrl: "",
        headerColor: "#333333",
        textColor: "#000000",
        accentColor: "#333333",
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "center",
        headerStyle: "box",
        invoiceNumberPosition: "under-header",
        showLogo: true,
        logoPosition: "left"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'graphical-market',
      name: 'Graphical Market',
      settings: {
        businessName: "GRAPHICAL MARKET",
        businessTagline: "Cash Memo",
        contactInfo: "First Floor, D/T Mansion-1207",
        address: "Address: 75/A New Street, Road#1, House 75, Near Park Street",
        logoUrl: "", 
        headerColor: "#00a99d", // Teal color
        textColor: "#ffffff",
        accentColor: "#00a99d",
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "center",
        headerStyle: "full-color",
        invoiceNumberPosition: "under-header",
        showLogo: true,
        logoPosition: "left"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'yellow-fold',
      name: 'Yellow Fold',
      settings: {
        businessName: "COMPANY NAME",
        businessTagline: "Your Company Slogan",
        contactInfo: "youremail@email.com | www.companyname.com | 0123456789",
        address: "Address Line 1, Address Line 2, Address Line 3, Address Line 4",
        logoUrl: "",
        headerColor: "#ffeb3b", // Yellow
        textColor: "#000000",
        accentColor: "#000000",
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "left",
        headerStyle: "side-color",
        invoiceNumberPosition: "top-right",
        showLogo: false,
        logoPosition: "left",
        backgroundStyle: "pattern",
        backgroundValue: "diagonal-stripes",
        cornerStyle: "square"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'bamboo',
      name: 'Bamboo Cafeteria',
      settings: {
        businessName: "BAMBOO CAFETERIA",
        businessTagline: "Tax invoice bill",
        contactInfo: "",
        address: "Street 12 Downtown Shoppe No1 France",
        logoUrl: "",
        headerColor: "#00796b", // Teal
        textColor: "#00796b",
        accentColor: "#00796b",
        fontFamily: "Times",
        showLines: true,
        companyInfoPosition: "center",
        headerStyle: "minimal",
        invoiceNumberPosition: "under-header",
        showLogo: false,
        logoPosition: "left",
        borderStyle: "full"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'company-memo',
      name: 'Company Memo',
      settings: {
        businessName: "COMPANY NAME",
        businessTagline: "",
        contactInfo: "www.example.com",
        address: "ADDRESS/CONTACT HERE: Mob: 123-4567890",
        logoUrl: "",
        headerColor: "#000000",
        textColor: "#000000",
        accentColor: "#000000",
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "center",
        headerStyle: "minimal",
        invoiceNumberPosition: "top-right",
        showLogo: true,
        logoPosition: "center",
        borderStyle: "none"
      } as Partial<PDFTemplateSettings>
    },
    {
      id: 'colorful-memo',
      name: 'Colorful Memo',
      settings: {
        businessName: "LOREM IPSUM",
        businessTagline: "CASH MEMO",
        contactInfo: "",
        address: "",
        logoUrl: "",
        headerColor: "#1976d2", // Blue
        textColor: "#ffffff",
        accentColor: "#e91e63", // Pink
        fontFamily: "Arial",
        showLines: true,
        companyInfoPosition: "left",
        headerStyle: "full-color",
        invoiceNumberPosition: "top-right",
        showLogo: true,
        logoPosition: "left",
        borderStyle: "none",
        cornerStyle: "rounded"
      } as Partial<PDFTemplateSettings>
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className={`border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-all ${
              currentTemplateId === template.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="font-medium text-sm">{template.name}</h3>
            </div>
            <div className="p-4 bg-white" style={{ height: '150px', overflow: 'hidden' }}>
              <div className="transform scale-[0.6] origin-top-left">
                <div className="w-[500px]">
                  <InvoiceHeader 
                    settings={template.settings as PDFTemplateSettings} 
                    invoiceNumber="INV-12345" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceHeaderTemplates;
