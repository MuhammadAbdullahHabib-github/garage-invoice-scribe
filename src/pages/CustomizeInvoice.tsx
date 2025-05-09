
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Save, Upload, FileImage, Check, Layout, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { 
  InvoiceData, 
  EMPTY_INVOICE, 
  generateBillNumber 
} from "@/lib/invoice-types";
import { 
  updatePDFTemplateSettings, 
  getPDFTemplateSettings,
  PDF_TEMPLATES,
  getTemplateById,
  PDFTemplateSettings,
  PDFTemplate
} from "@/lib/pdf-generator";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Create the default placeholder invoice
const createPlaceholderInvoice = (): InvoiceData => ({
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

export default function CustomizeInvoice() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PDFTemplateSettings>(() => {
    const savedSettings = localStorage.getItem('pdfTemplateSettings');
    return savedSettings ? JSON.parse(savedSettings) : getPDFTemplateSettings();
  });
  
  const [previewInvoice] = useState<InvoiceData>(createPlaceholderInvoice());
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplate | undefined>(
    getTemplateById(settings.templateId || 'classic')
  );
  const [activeTab, setActiveTab] = useState("templates");

  // Apply template settings when selected template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.defaultSettings) {
      setSettings(prev => ({
        ...prev,
        templateId: selectedTemplate.id,
        headerColor: selectedTemplate.defaultSettings.headerColor || prev.headerColor,
        textColor: selectedTemplate.defaultSettings.textColor || prev.textColor,
        accentColor: selectedTemplate.defaultSettings.accentColor || prev.accentColor,
        fontFamily: selectedTemplate.defaultSettings.fontFamily || prev.fontFamily,
        showLines: selectedTemplate.defaultSettings.showLines ?? prev.showLines,
        companyInfoPosition: selectedTemplate.defaultSettings.companyInfoPosition || prev.companyInfoPosition,
        showLogo: selectedTemplate.defaultSettings.showLogo ?? prev.showLogo,
        showDiscount: selectedTemplate.defaultSettings.showDiscount ?? prev.showDiscount,
        showTax: selectedTemplate.defaultSettings.showTax ?? prev.showTax,
        dateFormat: selectedTemplate.defaultSettings.dateFormat || prev.dateFormat
      }));
    }
  }, [selectedTemplate]);

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

  const handleSelectChange = (name: string, value: string) => {
    setSettings({ ...settings, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked });
  };

  const handleTemplateSelect = (template: PDFTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSaveSettings = async () => {
    try {
      // If there's a logo file, we would typically upload it to a server
      // For now, we'll just store the data URL in localStorage
      if (logoFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Logo = reader.result as string;
          const updatedSettings = { 
            ...settings, 
            logoUrl: base64Logo,
            templateId: selectedTemplate?.id || 'classic'
          };
          
          // Save to localStorage
          localStorage.setItem('pdfTemplateSettings', JSON.stringify(updatedSettings));
          
          // Update PDF generator settings
          updatePDFTemplateSettings(updatedSettings);
          
          toast.success("Template settings saved successfully!");
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Save current settings without changing logo
        const updatedSettings = {
          ...settings,
          templateId: selectedTemplate?.id || 'classic'
        };
        localStorage.setItem('pdfTemplateSettings', JSON.stringify(updatedSettings));
        
        // Update PDF generator settings
        updatePDFTemplateSettings(updatedSettings);
        
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
        <div className="p-6 overflow-auto h-[calc(100vh-9rem)]">
          <h2 className="text-lg font-semibold mb-6">Customize PDF Template</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Company Info
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-6">
              {/* Template Selection */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-3">Choose Template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PDF_TEMPLATES.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all
                        ${selectedTemplate?.id === template.id 
                          ? 'border-green-500 ring-2 ring-green-500/30' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {/* Template thumbnail */}
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <div 
                          className="w-full h-24 mx-4" 
                          style={{ 
                            backgroundColor: template.defaultSettings.headerColor || '#2e7d32',
                            borderRadius: '4px'
                          }}
                        >
                          <div className="p-2 text-white text-xs">
                            <p className="font-bold">INVOICE TEMPLATE</p>
                            <p className="opacity-80">{template.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Template info */}
                      <div className="p-3">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="space-y-6">
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
              
              <div>
                <Label htmlFor="companyInfoPosition">Company Info Position</Label>
                <Select 
                  value={settings.companyInfoPosition} 
                  onValueChange={(value) => handleSelectChange('companyInfoPosition', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showLogo">Show Logo</Label>
                <Switch
                  id="showLogo"
                  checked={settings.showLogo}
                  onCheckedChange={(checked) => handleSwitchChange('showLogo', checked)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
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
              
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={handleSettingChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    id="accentColorText"
                    name="accentColor"
                    type="text"
                    value={settings.accentColor}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={settings.fontFamily} 
                  onValueChange={(value) => handleSelectChange('fontFamily', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times">Times New Roman</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                      <SelectItem value="Tahoma">Tahoma</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={settings.dateFormat} 
                  onValueChange={(value) => handleSelectChange('dateFormat', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (05/09/2025)</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY (09/05/2025)</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (2025-05-09)</SelectItem>
                      <SelectItem value="dd MMM yyyy">DD MMM YYYY (09 May 2025)</SelectItem>
                      <SelectItem value="MMMM dd, yyyy">MMMM DD, YYYY (May 09, 2025)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showLines">Show Table Lines</Label>
                <Switch
                  id="showLines"
                  checked={settings.showLines}
                  onCheckedChange={(checked) => handleSwitchChange('showLines', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showDiscount">Show Discount Section</Label>
                <Switch
                  id="showDiscount"
                  checked={settings.showDiscount}
                  onCheckedChange={(checked) => handleSwitchChange('showDiscount', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showTax">Show Tax Section</Label>
                <Switch
                  id="showTax"
                  checked={settings.showTax}
                  onCheckedChange={(checked) => handleSwitchChange('showTax', checked)}
                />
              </div>
            </TabsContent>
          </Tabs>
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
function CustomInvoicePreview({ invoice, settings }: { invoice: InvoiceData, settings: PDFTemplateSettings }) {
  // Format the date according to the selected format
  const formatDate = (date: Date) => {
    try {
      return format(date instanceof Date ? date : new Date(date), settings.dateFormat || 'MM/dd/yyyy');
    } catch (error) {
      return "Invalid date";
    }
  };

  // Use the selected template's styles
  const templateStyle = {
    headerBg: settings.headerColor || '#2e7d32',
    textColor: settings.textColor || '#000000',
    accentColor: settings.accentColor || settings.headerColor || '#2e7d32',
    fontFamily: settings.fontFamily || 'Helvetica',
  };

  return (
    <div 
      id="custom-invoice-preview" 
      className="bg-white p-6 shadow-lg rounded-lg max-w-[700px] mx-auto"
      style={{ fontFamily: templateStyle.fontFamily }}
    >
      {/* Custom Header */}
      <div style={{ backgroundColor: templateStyle.headerBg, padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div className={`flex ${
          settings.companyInfoPosition === 'center' 
            ? 'flex-col items-center text-center' 
            : settings.companyInfoPosition === 'right'
              ? 'justify-between items-start'
              : 'justify-between items-start flex-row-reverse'
        }`}>
          <div className={`${settings.companyInfoPosition === 'center' ? 'text-center' : ''}`}>
            <div style={{ color: templateStyle.textColor }}>
              <h1 className="text-xl font-bold">{settings.businessName}</h1>
              <p className="text-sm opacity-90">{settings.businessTagline}</p>
              <p className="text-xs mt-1 opacity-80">{settings.contactInfo}</p>
              <p className="text-xs opacity-80">{settings.address}</p>
            </div>
          </div>
          
          <div className={`${settings.companyInfoPosition === 'center' ? 'mt-3' : ''} flex items-center`}>
            {settings.showLogo && settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Business Logo" className="h-16 w-16 object-contain mr-3" />
            ) : settings.showLogo ? (
              <div className="h-16 w-16 bg-white/30 rounded-full flex items-center justify-center mr-3">
                <FileImage className="h-8 w-8 text-white" />
              </div>
            ) : null}
            
            {settings.companyInfoPosition !== 'center' && (
              <div className="text-right" style={{ color: templateStyle.textColor }}>
                <p className="text-sm font-semibold">INVOICE</p>
                <p className="text-sm">{invoice.billNo}</p>
              </div>
            )}
          </div>
          
          {settings.companyInfoPosition === 'center' && (
            <div className="mt-2" style={{ color: templateStyle.textColor }}>
              <p className="text-sm font-semibold">INVOICE #{invoice.billNo}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Due Date</h3>
            <p>{formatDate(invoice.date)}</p>
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
      <table className={`w-full mb-8 ${settings.showLines ? 'border-collapse' : ''}`}>
        <thead>
          <tr className={settings.showLines ? 'border-b border-gray-200' : 'border-b'}>
            <th className="pb-2 text-left w-12">S.No</th>
            <th className="pb-2 text-left">ITEM</th>
            <th className="pb-2 text-center">QTY</th>
            <th className="pb-2 text-right">UNIT PRICE</th>
            <th className="pb-2 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => (
            <tr key={item.id} className={settings.showLines ? 'border-b border-gray-100' : 'border-b'}>
              <td className="py-4 text-left">{index + 1}</td>
              <td className="py-4">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded mr-2 flex items-center justify-center" 
                    style={{ backgroundColor: `${templateStyle.accentColor}20` }}
                  >
                    <span style={{ color: templateStyle.accentColor }}>
                      {item.particulars.substring(0, 1).toUpperCase() || "I"}
                    </span>
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
          
          {settings.showDiscount && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Discount 20%</span>
              <span>${(invoice.total * 0.2).toFixed(2)}</span>
            </div>
          )}
          
          {settings.showTax && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Tax 10%</span>
              <span>${(invoice.total * 0.1).toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 font-medium border-t">
            <span>Total</span>
            <span>${(
              invoice.total * 
              (settings.showDiscount ? 0.8 : 1) + 
              (settings.showTax ? invoice.total * 0.1 : 0)
            ).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between py-2 font-bold" style={{ color: templateStyle.accentColor }}>
            <span>Amount due</span>
            <span>${(
              invoice.total * 
              (settings.showDiscount ? 0.8 : 1) + 
              (settings.showTax ? invoice.total * 0.1 : 0)
            ).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
