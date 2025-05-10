
import { FileImage } from "lucide-react";
import { PDFTemplateSettings } from "@/lib/pdf-generator";

interface InvoiceHeaderProps {
  settings: PDFTemplateSettings;
  invoiceNumber: string;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ settings, invoiceNumber }) => {
  // Get header style
  const getHeaderStyle = () => {
    switch (settings.headerStyle) {
      case 'full-color':
        return {
          backgroundColor: settings.headerColor,
          padding: '20px',
          borderRadius: settings.cornerStyle === 'rounded' ? '8px 8px 0 0' : '0',
          color: settings.textColor
        };
      case 'top-border':
        return {
          borderTop: `5px solid ${settings.headerColor}`,
          padding: '20px',
          backgroundColor: 'transparent',
          color: settings.accentColor
        };
      case 'box':
        return {
          border: `2px solid ${settings.headerColor}`,
          padding: '20px',
          backgroundColor: 'transparent',
          color: settings.accentColor
        };
      case 'side-color':
        return {
          borderLeft: `8px solid ${settings.headerColor}`,
          padding: '20px',
          backgroundColor: 'transparent',
          color: settings.accentColor
        };
      case 'minimal':
      default:
        return {
          padding: '20px',
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${settings.accentColor}`,
          color: settings.accentColor
        };
    }
  };

  // Get logo position style
  const getLogoContainerStyle = () => {
    if (!settings.showLogo) return "";
    
    switch (settings.companyInfoPosition) {
      case 'center':
        return "flex justify-center w-full mb-3";
      case 'right':
        return settings.logoPosition === 'left' ? "mr-auto" : "ml-auto";
      case 'left':
      default:
        return settings.logoPosition === 'right' ? "ml-auto" : "mr-auto";
    }
  };

  // Calculate the layout for the invoice number based on position setting
  const getInvoiceNumberElement = () => {
    if (settings.invoiceNumberPosition === 'under-header') {
      return null; // We'll render it separately below the header
    }

    const isInHeader = settings.invoiceNumberPosition.startsWith('header-');
    
    if (isInHeader) {
      const alignment = settings.invoiceNumberPosition === 'header-right' ? 'text-right' : 'text-left';
      return (
        <div className={alignment}>
          <p className="text-sm font-semibold">INVOICE</p>
          <p className="text-sm">#{invoiceNumber}</p>
        </div>
      );
    }
    
    // For top positions (outside header)
    return null;
  };

  return (
    <div style={getHeaderStyle()} className="mb-8">
      <div className={`flex ${
        settings.companyInfoPosition === 'center' 
          ? 'flex-col items-center text-center' 
          : settings.companyInfoPosition === 'right'
            ? 'justify-between items-start'
            : 'justify-between items-start flex-row-reverse'
      }`}>
        {/* Company Info */}
        <div className={`${settings.companyInfoPosition === 'center' ? 'text-center' : ''}`}>
          <div>
            <h1 className="text-xl font-bold">{settings.businessName}</h1>
            <p className="text-sm opacity-90">{settings.businessTagline}</p>
            <p className="text-xs mt-1 opacity-80">{settings.contactInfo}</p>
            <p className="text-xs opacity-80">{settings.address}</p>
            
            {/* Custom fields */}
            {settings.customFields && settings.customFields.length > 0 && (
              <div className="mt-1">
                {settings.customFields.map(field => (
                  <p key={field.id} className="text-xs opacity-80">
                    {field.label}: {field.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Logo and/or Invoice Number */}
        <div className="flex items-center">
          {/* Logo */}
          {settings.showLogo && (
            <div className={getLogoContainerStyle()}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Business Logo" className="h-16 w-16 object-contain mr-3" />
              ) : (
                <div className="h-16 w-16 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <FileImage className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          )}
          
          {/* Invoice Number (if within header) */}
          {getInvoiceNumberElement()}
        </div>
        
        {/* Centered Invoice Number */}
        {settings.companyInfoPosition === 'center' && settings.invoiceNumberPosition.startsWith('header-') && (
          <div className="mt-2">
            <p className="text-sm font-semibold">INVOICE #{invoiceNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};
