
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  Save, 
  Upload, 
  FileImage, 
  Check, 
  Layout, 
  Palette, 
  FileText,
  File,
  Edit,
  Trash2,
  AlignLeft,
  LayoutGrid,
  SquareDashed,
  ColorPicker,
  Image,
  SquareSplitHorizontal,
  Text
} from "lucide-react";
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
  PDFTemplate,
  CustomField,
  getGradientPresets
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoicePreview } from "@/components/InvoicePreview";

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
  const [gradientPresets] = useState(getGradientPresets());
  
  // Custom fields state
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

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
        headerStyle: selectedTemplate.defaultSettings.headerStyle || prev.headerStyle,
        invoiceNumberPosition: selectedTemplate.defaultSettings.invoiceNumberPosition || prev.invoiceNumberPosition,
        showLogo: selectedTemplate.defaultSettings.showLogo ?? prev.showLogo,
        logoPosition: selectedTemplate.defaultSettings.logoPosition || prev.logoPosition,
        showDiscount: selectedTemplate.defaultSettings.showDiscount ?? prev.showDiscount,
        showTax: selectedTemplate.defaultSettings.showTax ?? prev.showTax,
        dateFormat: selectedTemplate.defaultSettings.dateFormat || prev.dateFormat,
        borderStyle: selectedTemplate.defaultSettings.borderStyle || prev.borderStyle,
        cornerStyle: selectedTemplate.defaultSettings.cornerStyle || prev.cornerStyle,
        backgroundStyle: selectedTemplate.defaultSettings.backgroundStyle || prev.backgroundStyle,
        backgroundValue: selectedTemplate.defaultSettings.backgroundValue || prev.backgroundValue,
        includeWatermark: selectedTemplate.defaultSettings.includeWatermark ?? prev.includeWatermark,
        watermarkText: selectedTemplate.defaultSettings.watermarkText || prev.businessName,
        includeSignatureLine: selectedTemplate.defaultSettings.includeSignatureLine ?? prev.includeSignatureLine,
        includeAmountInWords: selectedTemplate.defaultSettings.includeAmountInWords ?? prev.includeAmountInWords,
        includeFooterText: selectedTemplate.defaultSettings.includeFooterText ?? prev.includeFooterText,
        footerText: selectedTemplate.defaultSettings.footerText || prev.footerText,
        tableHeaderStyle: selectedTemplate.defaultSettings.tableHeaderStyle || prev.tableHeaderStyle,
        alternateRowColors: selectedTemplate.defaultSettings.alternateRowColors ?? prev.alternateRowColors,
        includeTaxFields: selectedTemplate.defaultSettings.includeTaxFields ?? prev.includeTaxFields,
        includeTermsAndConditions: selectedTemplate.defaultSettings.includeTermsAndConditions ?? prev.includeTermsAndConditions,
        termsAndConditions: selectedTemplate.defaultSettings.termsAndConditions || prev.termsAndConditions,
        includeNotes: selectedTemplate.defaultSettings.includeNotes ?? prev.includeNotes,
        notes: selectedTemplate.defaultSettings.notes || prev.notes
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

  const handleGradientSelect = (gradientValue: string) => {
    setSettings({ ...settings, backgroundValue: gradientValue });
  };

  // Add a new custom field
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) {
      toast.error("Field label cannot be empty");
      return;
    }

    if (editingFieldId) {
      // Update existing field
      const updatedFields = settings.customFields.map(field => 
        field.id === editingFieldId 
          ? { ...field, label: newFieldLabel, value: newFieldValue } 
          : field
      );
      
      setSettings({
        ...settings,
        customFields: updatedFields
      });
      
      setEditingFieldId(null);
    } else {
      // Add new field
      const newField: CustomField = {
        id: `field-${Date.now()}`,
        label: newFieldLabel,
        value: newFieldValue
      };
      
      setSettings({
        ...settings,
        customFields: [...(settings.customFields || []), newField]
      });
    }
    
    setNewFieldLabel("");
    setNewFieldValue("");
  };

  // Edit a custom field
  const handleEditField = (field: CustomField) => {
    setNewFieldLabel(field.label);
    setNewFieldValue(field.value);
    setEditingFieldId(field.id);
  };

  // Delete a custom field
  const handleDeleteField = (fieldId: string) => {
    setSettings({
      ...settings,
      customFields: settings.customFields.filter(field => field.id !== fieldId)
    });
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
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="header" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Header
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-6">
              {/* Template Selection */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-3">Choose Template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
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
              
              {/* Custom Fields */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Custom Fields</CardTitle>
                  <CardDescription>
                    Add any additional information to display in the invoice header
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {settings.customFields && settings.customFields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-gray-500">{field.value}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Field Label"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Field Value"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleAddCustomField}
                    >
                      {editingFieldId ? "Update" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="header" className="space-y-6">
              <div>
                <Label htmlFor="headerStyle">Header Style</Label>
                <Select 
                  value={settings.headerStyle} 
                  onValueChange={(value) => handleSelectChange('headerStyle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select header style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="full-color">Full Color Background</SelectItem>
                      <SelectItem value="top-border">Top Border</SelectItem>
                      <SelectItem value="box">Box Outline</SelectItem>
                      <SelectItem value="side-color">Side Color Bar</SelectItem>
                      <SelectItem value="minimal">Minimal (No Background)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="textColor">Header Text Color</Label>
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
              
              <div>
                <Label htmlFor="invoiceNumberPosition">Invoice Number Position</Label>
                <Select 
                  value={settings.invoiceNumberPosition} 
                  onValueChange={(value) => handleSelectChange('invoiceNumberPosition', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="top-right">Top Right (Outside Header)</SelectItem>
                      <SelectItem value="top-left">Top Left (Outside Header)</SelectItem>
                      <SelectItem value="header-right">Inside Header - Right</SelectItem>
                      <SelectItem value="header-left">Inside Header - Left</SelectItem>
                      <SelectItem value="under-header">Under Header</SelectItem>
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
              
              {settings.showLogo && (
                <div>
                  <Label htmlFor="logoPosition">Logo Position</Label>
                  <Select 
                    value={settings.logoPosition} 
                    onValueChange={(value) => handleSelectChange('logoPosition', value)}
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
              )}
            </TabsContent>
            
            <TabsContent value="design" className="space-y-6">
              <div>
                <Label htmlFor="accentColor">Accent Color (for headings, buttons)</Label>
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
              
              <div>
                <Label htmlFor="borderStyle">Document Border Style</Label>
                <Select 
                  value={settings.borderStyle} 
                  onValueChange={(value) => handleSelectChange('borderStyle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select border style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">No Border</SelectItem>
                      <SelectItem value="full">Full Border</SelectItem>
                      <SelectItem value="header-only">Header Border Only</SelectItem>
                      <SelectItem value="table-only">Table Border Only</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cornerStyle">Corner Style</Label>
                <Select 
                  value={settings.cornerStyle} 
                  onValueChange={(value) => handleSelectChange('cornerStyle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select corner style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="backgroundStyle" className="flex items-center gap-2">
                  <SquareDashed className="h-4 w-4" />
                  Background Style
                </Label>
                <Select 
                  value={settings.backgroundStyle} 
                  onValueChange={(value) => handleSelectChange('backgroundStyle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select background style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="solid">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="pattern">Pattern</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {settings.backgroundStyle === 'solid' && (
                <div>
                  <Label htmlFor="backgroundValue" className="flex items-center gap-2">
                    <ColorPicker className="h-4 w-4" />
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundValue"
                      name="backgroundValue"
                      type="color"
                      value={settings.backgroundValue}
                      onChange={handleSettingChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      name="backgroundValue"
                      type="text"
                      value={settings.backgroundValue}
                      onChange={handleSettingChange}
                    />
                  </div>
                </div>
              )}
              
              {settings.backgroundStyle === 'gradient' && (
                <div className="space-y-4">
                  <Label htmlFor="gradientPresets" className="flex items-center gap-2">
                    <ColorPicker className="h-4 w-4" />
                    Gradient Presets
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.map(preset => (
                      <div 
                        key={preset.id}
                        className={`h-12 rounded cursor-pointer transition-all hover:scale-105 ${
                          settings.backgroundValue === preset.value ? 'ring-2 ring-offset-2 ring-green-500' : ''
                        }`}
                        style={{ background: preset.value }}
                        title={preset.name}
                        onClick={() => handleGradientSelect(preset.value)}
                      />
                    ))}
                  </div>
                  
                  <Label htmlFor="backgroundValue">
                    Custom Gradient CSS
                  </Label>
                  <Input
                    id="backgroundValue"
                    name="backgroundValue"
                    type="text"
                    value={settings.backgroundValue}
                    onChange={handleSettingChange}
                    placeholder="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                  />
                </div>
              )}
              
              {settings.backgroundStyle === 'pattern' && (
                <div>
                  <Label htmlFor="backgroundValue" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Pattern
                  </Label>
                  <Select 
                    value={settings.backgroundValue} 
                    onValueChange={(value) => handleSelectChange('backgroundValue', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="diagonal-stripes">Diagonal Stripes</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="waves">Waves</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="tableHeaderStyle" className="flex items-center gap-2">
                  <SquareSplitHorizontal className="h-4 w-4" />
                  Table Header Style
                </Label>
                <Select 
                  value={settings.tableHeaderStyle} 
                  onValueChange={(value) => handleSelectChange('tableHeaderStyle', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select table header style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="filled">Filled Background</SelectItem>
                      <SelectItem value="bordered">Bordered</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showLines" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Show Table Lines
                </Label>
                <Switch
                  id="showLines"
                  checked={settings.showLines}
                  onCheckedChange={(checked) => handleSwitchChange('showLines', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="alternateRowColors">
                  Alternate Row Colors
                </Label>
                <Switch
                  id="alternateRowColors"
                  checked={settings.alternateRowColors}
                  onCheckedChange={(checked) => handleSwitchChange('alternateRowColors', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeWatermark">
                  Include Watermark
                </Label>
                <Switch
                  id="includeWatermark"
                  checked={settings.includeWatermark}
                  onCheckedChange={(checked) => handleSwitchChange('includeWatermark', checked)}
                />
              </div>
              
              {settings.includeWatermark && (
                <div>
                  <Label htmlFor="watermarkText">Watermark Text</Label>
                  <Input
                    id="watermarkText"
                    name="watermarkText"
                    value={settings.watermarkText}
                    onChange={handleSettingChange}
                    placeholder="Company Name"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="showDiscount" className="flex items-center gap-2">
                  <Text className="h-4 w-4" />
                  Show Discount Section
                </Label>
                <Switch
                  id="showDiscount"
                  checked={settings.showDiscount}
                  onCheckedChange={(checked) => handleSwitchChange('showDiscount', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showTax">
                  Show Tax Section
                </Label>
                <Switch
                  id="showTax"
                  checked={settings.showTax}
                  onCheckedChange={(checked) => handleSwitchChange('showTax', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeTaxFields">
                  Include Detailed Tax Fields (SGST/CGST)
                </Label>
                <Switch
                  id="includeTaxFields"
                  checked={settings.includeTaxFields}
                  onCheckedChange={(checked) => handleSwitchChange('includeTaxFields', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeSignatureLine">
                  Include Signature Line
                </Label>
                <Switch
                  id="includeSignatureLine"
                  checked={settings.includeSignatureLine}
                  onCheckedChange={(checked) => handleSwitchChange('includeSignatureLine', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeAmountInWords">
                  Include Amount In Words
                </Label>
                <Switch
                  id="includeAmountInWords"
                  checked={settings.includeAmountInWords}
                  onCheckedChange={(checked) => handleSwitchChange('includeAmountInWords', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeTermsAndConditions">
                  Include Terms & Conditions
                </Label>
                <Switch
                  id="includeTermsAndConditions"
                  checked={settings.includeTermsAndConditions}
                  onCheckedChange={(checked) => handleSwitchChange('includeTermsAndConditions', checked)}
                />
              </div>
              
              {settings.includeTermsAndConditions && (
                <div>
                  <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                  <Textarea
                    id="termsAndConditions"
                    name="termsAndConditions"
                    value={settings.termsAndConditions}
                    onChange={handleSettingChange}
                    placeholder="1. All payments are due within 30 days of receipt."
                    rows={3}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeNotes">
                  Include Notes Section
                </Label>
                <Switch
                  id="includeNotes"
                  checked={settings.includeNotes}
                  onCheckedChange={(checked) => handleSwitchChange('includeNotes', checked)}
                />
              </div>
              
              {settings.includeNotes && (
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={settings.notes}
                    onChange={handleSettingChange}
                    placeholder="Thank you for your business!"
                    rows={3}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeFooterText">
                  Include Footer Text
                </Label>
                <Switch
                  id="includeFooterText"
                  checked={settings.includeFooterText}
                  onCheckedChange={(checked) => handleSwitchChange('includeFooterText', checked)}
                />
              </div>
              
              {settings.includeFooterText && (
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleSettingChange}
                    placeholder="Thank you for your business!"
                    rows={2}
                  />
                </div>
              )}
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
          <InvoicePreview invoice={previewInvoice} />
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
