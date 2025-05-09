
import { format } from "date-fns";
import GarageLogo from "./GarageLogo";
import { InvoiceData, formatCurrency } from "@/lib/invoice-types";
import { FileText, Download, FileImage } from "lucide-react";
import { getPDFTemplateSettings } from "@/lib/pdf-generator";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const settings = getPDFTemplateSettings();
  const useCustomHeader = !!settings && localStorage.getItem('pdfTemplateSettings');

  return (
    <div 
      id="invoice-preview" 
      className="bg-white p-6 shadow-lg rounded-lg max-w-[700px] mx-auto"
    >
      {/* Header */}
      {useCustomHeader ? (
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
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-4">
            <h3 className="text-xs text-gray-500 mb-1">Due Date</h3>
            <p>{invoice.date ? format(invoice.date, "d MMMM yyyy") : "Not specified"}</p>
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
          {invoice.lineItems.length > 0 ? (
            invoice.lineItems.map((item, index) => (
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
                <td className="py-4 text-right">${formatCurrency(item.rate)}</td>
                <td className="py-4 text-right">${formatCurrency(item.amount)}</td>
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
      <div className="flex justify-end mb-8">
        <div className="w-1/2">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Sub total</span>
            <span>${formatCurrency(invoice.total)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Discount 20%</span>
            <span>${formatCurrency(invoice.total * 0.2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Tax 10%</span>
            <span>${formatCurrency(invoice.total * 0.1)}</span>
          </div>
          <div className="flex justify-between py-2 font-medium border-t">
            <span>Total</span>
            <span>${formatCurrency(invoice.total * 0.9 + invoice.total * 0.1)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-green-600">
            <span>Amount due</span>
            <span>${formatCurrency(invoice.total * 0.9 + invoice.total * 0.1)}</span>
          </div>
        </div>
      </div>
      
      {/* Attachment */}
      <div>
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
