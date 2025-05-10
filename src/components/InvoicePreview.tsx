
import { format } from "date-fns";
import GarageLogo from "./GarageLogo";
import { InvoiceData, formatCurrency } from "@/lib/invoice-types";
import { FileText, Download, FileImage, File } from "lucide-react";
import { getPDFTemplateSettings, getBackgroundPatternUrl } from "@/lib/pdf-generator";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoicePreTableFields } from "./InvoicePreTableFields";
import { InvoiceAdditionalContent } from "./InvoiceAdditionalContent";
import { useEffect, useState } from "react";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const [settings, setSettings] = useState(getPDFTemplateSettings());
  const useCustomHeader = !!settings && localStorage.getItem('pdfTemplateSettings');

  // Listen for settings changes and update in real-time
  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getPDFTemplateSettings());
    };

    // Create a custom event for settings changes
    window.addEventListener('pdfSettingsChanged', handleSettingsChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('pdfSettingsChanged', handleSettingsChange);
    };
  }, []);

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
        return { backgroundImage: `url('${getBackgroundPatternUrl(settings.backgroundValue)}')` };
      default:
        return { backgroundColor: settings.backgroundValue || '#ffffff' };
    }
  };

  // Get table header style
  const getTableHeaderStyle = () => {
    switch (settings.tableHeaderStyle) {
      case 'filled':
        return {
          backgroundColor: `${settings.accentColor}20`, // Light version of accent color
          color: settings.accentColor,
          borderBottom: '1px solid #e2e8f0'
        };
      case 'bordered':
        return {
          backgroundColor: 'transparent',
          color: settings.accentColor,
          borderBottom: `2px solid ${settings.accentColor}`
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'transparent',
          color: settings.accentColor,
          borderBottom: '1px solid #e2e8f0'
        };
    }
  };

  // Get row style based on index and settings
  const getRowStyle = (index: number) => {
    if (settings.alternateRowColors && index % 2 === 1) {
      return { backgroundColor: `${settings.accentColor}05` }; // Very light version of accent color
    }
    return {};
  };

  // Render the top invoice number if applicable
  const renderTopInvoiceNumber = () => {
    if (settings.invoiceNumberPosition === 'top-right' || settings.invoiceNumberPosition === 'top-left') {
      const alignment = settings.invoiceNumberPosition === 'top-right' ? 'text-right' : 'text-left';
      return (
        <div className={`${alignment} mb-4`}>
          <p className="text-sm text-gray-500">INV {invoice.billNo}</p>
        </div>
      );
    }
    return null;
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
      
      {/* Top Invoice Number (if positioned there) */}
      {renderTopInvoiceNumber()}
      
      {/* Header */}
      {useCustomHeader ? (
        <InvoiceHeader settings={settings} invoiceNumber={invoice.billNo} />
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
      
      {/* Pre-table fields */}
      {useCustomHeader && (
        <InvoicePreTableFields invoice={invoice} settings={settings} />
      )}
      
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
            style={getTableHeaderStyle()}
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
                style={getRowStyle(index)}
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
          
          {(!useCustomHeader || settings.showDiscount) && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Discount 20%</span>
              <span>${formatCurrency(invoice.total * 0.2)}</span>
            </div>
          )}
          
          {(!useCustomHeader || settings.showTax) && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Tax 10%</span>
              <span>${formatCurrency(invoice.total * 0.1)}</span>
            </div>
          )}
          
          {/* Additional tax fields if enabled */}
          {settings.includeTaxFields && (
            <>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">SGST 9%</span>
                <span>${formatCurrency(invoice.total * 0.09)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">CGST 9%</span>
                <span>${formatCurrency(invoice.total * 0.09)}</span>
              </div>
            </>
          )}
          
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
      
      {/* Additional content (amount in words, notes, terms, etc.) */}
      <InvoiceAdditionalContent settings={settings} amount={calculateFinalAmount()} />
      
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
