import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Save, Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Textarea } from "@/components/ui/textarea";
import { 
  InvoiceData, 
  EMPTY_INVOICE, 
  generateBillNumber 
} from "@/lib/invoice-types";
import { updatePDFTemplateSettings } from "@/lib/pdf-generator";

const DEFAULT_SETTINGS = {
  businessName: "Car Line Garage",
  businessTagline: "Professional Auto Service",
  contactInfo: "Phone: 123-456-7890 | Email: info@carlinegarage.com",
  address: "123 Auto Street, Mechanic City",
  logoUrl: "",
  headerColor: "#2e7d32",
  textColor: "#000000"
};

export default function CustomizeInvoice() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('pdfTemplateSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData>({
    ...EMPTY_INVOICE,
    billNo: generateBillNumber(),
    date: new Date(),
    lineItems: [
      { id: '1', particulars: 'Oil Change', rate: 45.00, amount: 45.00 },
      { id: '2', particulars: 'Air Filter Replacement', rate: 25.00, amount: 25.00 },
      { id: '3', particulars: 'Brake Inspection', rate: 60.00, amount: 60.00 },
    ],
    total: 130.00,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      setSettings({ ...settings, logoUrl: tempUrl });
    }
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSaveSettings = async () => {
    try {
      // If there's a logo file, we would typically upload it to a server
      // For now, we'll just store the data URL in localStorage
      if (logoFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Logo = reader.result as string;
          const updatedSettings = { ...settings, logoUrl: base64Logo };
          
          // Save to localStorage
          localStorage.setItem('pdfTemplateSettings', JSON.stringify(updatedSettings));
          
          // Update PDF generator settings
          updatePDFTemplateSettings(updatedSettings);
          
          toast.success("Template settings saved successfully!");
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Save current settings without changing logo
        localStorage.setItem('pdfTemplateSettings', JSON.stringify(settings));
        
        // Update PDF generator settings
        updatePDFTemplateSettings(settings);
        
        toast.success("Template settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Form Section */}
      <div className="bg-white border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Customize PDF Template</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={settings.businessName}
                onChange={handleSettingChange}
              />
            </div>
            
            <div>
              <Label htmlFor="businessTagline">Business Tagline</Label>
              <Input
                id="businessTagline"
                name="businessTagline"
                value={settings.businessTagline}
                onChange={handleSettingChange}
              />
            </div>
            
            <div>
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={settings.contactInfo}
                onChange={handleSettingChange}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleSettingChange}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="logo">Business Logo</Label>
              <div className="flex items-center gap-3 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                {settings.logoUrl && (
                  <div className="h-10 w-10 relative">
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="headerColor">Header Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="headerColor"
                    name="headerColor"
                    type="color"
                    value={settings.headerColor}
                    onChange={handleSettingChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    id="headerColorText"
                    name="headerColor"
                    type="text"
                    value={settings.headerColor}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    name="textColor"
                    type="color"
                    value={settings.textColor}
                    onChange={handleSettingChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    id="textColorText"
                    name="textColor"
                    type="text"
                    value={settings.textColor}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="bg-gray-50 h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Template Preview</h2>
        </div>
        <div className="p-6 overflow-auto h-[calc(100vh-9rem)]">
          <CustomInvoicePreview invoice={previewInvoice} settings={settings} />
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveSettings}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </div>
    </div>
  );
}

// Custom Invoice Preview Component to show template customizations
function CustomInvoicePreview({ invoice, settings }: { invoice: InvoiceData, settings: any }) {
  return (
    <div 
      id="custom-invoice-preview" 
      className="bg-white p-6 shadow-lg rounded-lg max-w-[700px] mx-auto"
    >
      {/* Custom Header */}
      <div style={{ backgroundColor: settings.headerColor, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Business Logo" className="h-16 w-16 object-contain mr-3" />
            ) : (
              <div className="h-16 w-16 bg-white/30 rounded-full flex items-center justify-center mr-3">
                <FileImage className="h-8 w-8 text-white" />
              </div>
            )}
            <div style={{ color: settings.textColor }}>
              <h1 className="text-xl font-bold">{settings.businessName}</h1>
              <p className="text-sm opacity-90">{settings.businessTagline}</p>
              <p className="text-xs mt-1 opacity-80">{settings.contactInfo}</p>
              <p className="text-xs opacity-80">{settings.address}</p>
            </div>
          </div>
          <div className="text-right" style={{ color: settings.textColor }}>
            <p className="text-sm font-semibold">INVOICE</p>
            <p className="text-sm">{invoice.billNo}</p>
          </div>
        </div>
      </div>
      
      {/* Rest of the invoice remains the same */}
      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Due Date</h3>
            <p>{invoice.date ? new Date(invoice.date).toLocaleDateString() : "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500 mb-1">Billed To</h3>
            {invoice.customer ? (
              <>
                <p className="font-medium">{invoice.customer.name}</p>
                <p className="text-sm text-gray-600">{invoice.customer.contact}</p>
              </>
            ) : (
              <p className="text-gray-500">Customer Name</p>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Subject</h3>
            <p>{invoice.vehicleType || "Vehicle Service"}</p>
          </div>
        </div>
      </div>
      
      {/* Line Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b text-xs text-gray-500">
            <th className="pb-2 text-left w-12">S.No</th>
            <th className="pb-2 text-left">ITEM</th>
            <th className="pb-2 text-center">QTY</th>
            <th className="pb-2 text-right">UNIT PRICE</th>
            <th className="pb-2 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="py-4 text-left">{index + 1}</td>
              <td className="py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded mr-2 flex items-center justify-center">
                    {item.particulars.substring(0, 1).toUpperCase() || "I"}
                  </div>
                  <span>{item.particulars}</span>
                </div>
              </td>
              <td className="py-4 text-center">1</td>
              <td className="py-4 text-right">${(item.rate).toFixed(2)}</td>
              <td className="py-4 text-right">${(item.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-1/2">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Sub total</span>
            <span>${(invoice.total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Discount 20%</span>
            <span>${(invoice.total * 0.2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Tax 10%</span>
            <span>${(invoice.total * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-medium border-t">
            <span>Total</span>
            <span>${(invoice.total * 0.9 + invoice.total * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-green-600">
            <span>Amount due</span>
            <span>${(invoice.total * 0.9 + invoice.total * 0.1).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
