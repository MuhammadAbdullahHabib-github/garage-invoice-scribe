
import { format } from "date-fns";
import GarageLogo from "./GarageLogo";
import { InvoiceData, formatCurrency } from "@/lib/invoice-types";
import { FileText, Download, FileImage, File } from "lucide-react";
import { getPDFTemplateSettings } from "@/lib/pdf-generator";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const settings = getPDFTemplateSettings();
  const useCustomHeader = !!settings && localStorage.getItem('pdfTemplateSettings');

  // Format the date according to the selected format or use default
  const formatDate = (date: Date) => {
    try {
      if (settings.dateFormat) {
        return format(date instanceof Date ? date : new Date(date), settings.dateFormat);
      }
      return format(date instanceof Date ? date : new Date(date), "d MMMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Calculate final amount based on settings
  const calculateFinalAmount = () => {
    let amount = invoice.total;
    
    if (settings.showDiscount) {
      amount = amount * 0.8; // Apply 20% discount
    }
    
    if (settings.showTax) {
      amount = amount + (invoice.total * 0.1); // Add 10% tax on original amount
    }
    
    return formatCurrency(amount);
  };

  // Convert amount to words if needed
  const getAmountInWords = () => {
    const amount = parseFloat(calculateFinalAmount());
    // Simple implementation - would normally use a more robust library
    return `${amount} USD only`;
  };

  // Get border style based on settings
  const getBorderStyle = () => {
    switch (settings.borderStyle) {
      case 'full':
        return 'border border-gray-300';
      case 'header-only':
        return 'border-t border-l border-r border-gray-300';
      case 'table-only':
        return '';
      default:
        return '';
    }
  };

  // Get corner style
  const getCornerStyle = () => {
    return settings.cornerStyle === 'rounded' ? 'rounded-lg' : '';
  };

  // Get background style
  const getBackgroundStyles = () => {
    switch (settings.backgroundStyle) {
      case 'gradient':
        return { background: settings.backgroundValue || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' };
      case 'pattern':
        return { backgroundImage: `url('/patterns/${settings.backgroundValue}.png')` };
      default:
        return { backgroundColor: settings.backgroundValue || '#ffffff' };
    }
  };

  return (
    <div 
      id="invoice-preview" 
      className={`bg-white p-6 shadow-lg max-w-[700px] mx-auto ${getCornerStyle()} ${getBorderStyle()}`}
      style={{ 
        fontFamily: settings.fontFamily || 'inherit',
        position: 'relative',
        overflow: 'hidden',
        ...getBackgroundStyles()
      }}
    >
      {/* Watermark */}
      {settings.includeWatermark && settings.watermarkText && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div 
            className="transform rotate-45 text-gray-100"
            style={{ 
              fontSize: '8rem', 
              opacity: 0.1,
              fontWeight: 'bold',
              userSelect: 'none'
            }}
          >
            {settings.watermarkText}
          </div>
        </div>
      )}
      
      {/* Header */}
      {useCustomHeader ? (
        <div style={{ 
          backgroundColor: settings.headerColor, 
          padding: '20px', 
          borderRadius: settings.cornerStyle === 'rounded' ? '8px' : '0',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2
        }}>
          <div className={`flex ${
            settings.companyInfoPosition === 'center' 
              ? 'flex-col items-center text-center' 
              : settings.companyInfoPosition === 'right'
                ? 'justify-between items-start'
                : 'justify-between items-start flex-row-reverse'
          }`}>
            <div className={`${settings.companyInfoPosition === 'center' ? 'text-center' : ''}`}>
              <div style={{ color: settings.textColor }}>
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
            
            <div className={`${settings.companyInfoPosition === 'center' ? 'mt-3' : ''} flex items-center`}>
              {settings.showLogo && settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Business Logo" className="h-16 w-16 object-contain mr-3" />
              ) : settings.showLogo ? (
                <div className="h-16 w-16 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <FileImage className="h-8 w-8 text-white" />
                </div>
              ) : null}
              
              {settings.companyInfoPosition !== 'center' && (
                <div className="text-right" style={{ color: settings.textColor }}>
                  <p className="text-sm font-semibold">INVOICE</p>
                  <p className="text-sm">{invoice.billNo}</p>
                </div>
              )}
            </div>
            
            {settings.companyInfoPosition === 'center' && (
              <div className="mt-2" style={{ color: settings.textColor }}>
                <p className="text-sm font-semibold">INVOICE #{invoice.billNo}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <GarageLogo size="md" className="text-green-500" />
            <div className="ml-2">
              <h1 className="text-xl font-bold">Monny</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">INV {invoice.billNo}</p>
          </div>
        </div>
      )}
      
      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-8 mb-8" style={{ position: 'relative', zIndex: 2 }}>
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Due Date</h3>
            <p>{invoice.date ? formatDate(invoice.date) : "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500 mb-1">Billed To</h3>
            {invoice.customer ? (
              <>
                <p className="font-medium">{invoice.customer.name}</p>
                <p className="text-sm text-gray-600">{invoice.customer.contact}</p>
              </>
            ) : (
              <p className="text-gray-500">No customer selected</p>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Subject</h3>
            <p>{invoice.vehicleType || "Not specified"}</p>
          </div>
        </div>
      </div>
      
      {/* Line Items Table */}
      <table 
        className={`w-full mb-8 ${
          useCustomHeader && settings.showLines ? 'border-collapse' : ''
        } ${
          settings.borderStyle === 'table-only' || settings.borderStyle === 'full' 
          ? 'border border-gray-300' : ''
        }`}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <thead>
          <tr 
            className={`
              ${useCustomHeader && settings.showLines ? 'border-b border-gray-200' : 'border-b text-xs text-gray-500'}
              ${settings.borderStyle === 'table-only' || settings.borderStyle === 'full' ? 'bg-gray-50' : ''}
            `}
            style={settings.accentColor ? { color: settings.accentColor } : {}}
          >
            <th className="pb-2 pt-2 text-left w-12 px-2">S.No</th>
            <th className="pb-2 pt-2 text-left px-2">ITEM</th>
            <th className="pb-2 pt-2 text-center px-2">QTY</th>
            <th className="pb-2 pt-2 text-right px-2">UNIT PRICE</th>
            <th className="pb-2 pt-2 text-right px-2">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.length > 0 ? (
            invoice.lineItems.map((item, index) => (
              <tr 
                key={item.id} 
                className={`
                  ${useCustomHeader && settings.showLines ? 'border-b border-gray-100' : 'border-b'}
                  ${settings.borderStyle === 'table-only' || settings.borderStyle === 'full' 
                    ? 'border-t border-gray-200' : ''}
                `}
              >
                <td className="py-4 text-left px-2">{index + 1}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 bg-gray-100 rounded mr-2 flex items-center justify-center"
                      style={useCustomHeader ? { 
                        backgroundColor: `${settings.accentColor || settings.headerColor}20`,
                        color: settings.accentColor || settings.headerColor 
                      } : {}}
                    >
                      {item.particulars.substring(0, 1).toUpperCase() || "I"}
                    </div>
                    <span>{item.particulars}</span>
                  </div>
                </td>
                <td className="py-4 text-center px-2">1</td>
                <td className="py-4 text-right px-2">${formatCurrency(item.rate)}</td>
                <td className="py-4 text-right px-2">${formatCurrency(item.amount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No items added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Summary */}
      <div className="flex justify-end mb-8" style={{ position: 'relative', zIndex: 2 }}>
        <div className="w-1/2">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Sub total</span>
            <span>${formatCurrency(invoice.total)}</span>
          </div>
          
          {!useCustomHeader || settings.showDiscount ? (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Discount 20%</span>
              <span>${formatCurrency(invoice.total * 0.2)}</span>
            </div>
          ) : null}
          
          {!useCustomHeader || settings.showTax ? (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Tax 10%</span>
              <span>${formatCurrency(invoice.total * 0.1)}</span>
            </div>
          ) : null}
          
          <div className="flex justify-between py-2 font-medium border-t">
            <span>Total</span>
            <span>${calculateFinalAmount()}</span>
          </div>
          
          <div className="flex justify-between py-2 font-bold"
            style={useCustomHeader ? { color: settings.accentColor || settings.headerColor } : { color: 'rgb(22 163 74)' }}
          >
            <span>Amount due</span>
            <span>${calculateFinalAmount()}</span>
          </div>
        </div>
      </div>
      
      {/* Amount in Words */}
      {settings.includeAmountInWords && (
        <div className="mb-4 text-gray-600 text-sm italic" style={{ position: 'relative', zIndex: 2 }}>
          <div className="font-medium">Amount in words:</div>
          <div>{getAmountInWords()}</div>
        </div>
      )}
      
      {/* Footer text */}
      {settings.includeFooterText && settings.footerText && (
        <div 
          className="mb-6 text-center text-sm text-gray-500"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {settings.footerText}
        </div>
      )}
      
      {/* Signature Line */}
      {settings.includeSignatureLine && (
        <div 
          className="flex justify-end mb-4"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div className="text-center">
            <div className="w-40 border-t border-gray-400 pt-1"></div>
            <p className="text-xs text-gray-500">Authorized Signature</p>
          </div>
        </div>
      )}
      
      {/* Attachment */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 className="text-sm font-medium mb-2">Attachment</h3>
        <div className="flex items-center justify-between border rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Product list.PDF</p>
              <p className="text-xs text-gray-500">512kb</p>
            </div>
          </div>
          <button className="text-green-500 flex items-center text-sm">
            <Download className="h-4 w-4 mr-1" /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
