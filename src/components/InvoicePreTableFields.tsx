
import React from 'react';
import { InvoiceData } from '@/lib/invoice-types';
import { PDFTemplateSettings } from '@/lib/pdf-generator';
import { format } from 'date-fns';

interface InvoicePreTableFieldsProps {
  invoice: InvoiceData;
  settings: PDFTemplateSettings;
}

export const InvoicePreTableFields: React.FC<InvoicePreTableFieldsProps> = ({
  invoice,
  settings
}) => {
  // Format the date according to the selected format or use default
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not specified";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (settings.dateFormat) {
        return format(dateObj, settings.dateFormat);
      }
      return format(dateObj, "d MMMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="mb-8" style={{ position: 'relative', zIndex: 2 }}>
      {/* Dynamic fields based on settings */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          {settings.showMeterReading && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Meter Reading</h3>
              <p>{invoice.meterReading || "Not specified"}</p>
            </div>
          )}
          
          {settings.showVehicleInfo && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Vehicle Information</h3>
              <p className="font-medium">{invoice.vehicleType || "Not specified"}</p>
              {invoice.vehicleModel && <p className="text-sm text-gray-600">{invoice.vehicleModel}</p>}
              {invoice.vehicleNumber && <p className="text-sm text-gray-600">Reg: {invoice.vehicleNumber}</p>}
            </div>
          )}
          
          {settings.invoiceNumberPosition === 'under-header' && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Invoice Number</h3>
              <p className="font-medium">{invoice.billNo}</p>
            </div>
          )}
        </div>
        
        <div>
          {settings.showCustomerInfo && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Billed To</h3>
              {invoice.customer ? (
                <>
                  <p className="font-medium">{invoice.customer.name}</p>
                  <p className="text-sm text-gray-600">{invoice.customer.contact}</p>
                  {invoice.customer.address && (
                    <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No customer selected</p>
              )}
            </div>
          )}
          
          {settings.showDueDate && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Due Date</h3>
              <p>{invoice.dueDate ? formatDate(invoice.dueDate) : formatDate(invoice.date)}</p>
            </div>
          )}
          
          {settings.showInvoiceDate && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 mb-1">Invoice Date</h3>
              <p>{formatDate(invoice.date)}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom pre-table fields */}
      {settings.preTableCustomFields && settings.preTableCustomFields.length > 0 && (
        <div className="mt-4 border-t pt-4 border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {settings.preTableCustomFields.map((field) => (
              <div key={field.id} className="mb-2">
                <h3 className="text-xs text-gray-500 mb-1">{field.label}</h3>
                <p>{field.value || "Not specified"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreTableFields;
