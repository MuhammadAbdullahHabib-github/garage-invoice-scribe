
import { format } from "date-fns";
import GarageLogo from "./GarageLogo";
import { InvoiceData, formatCurrency } from "@/lib/invoice-types";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div 
      id="invoice-preview" 
      className="bg-white p-6 shadow-lg min-h-[842px] max-w-[595px] mx-auto"
    >
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <GarageLogo size="lg" className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-garage-primary">CAR LINE GARAGE</h1>
              <p className="text-sm text-gray-600">Expert car care for a smooth, safe ride.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">M. SHAFIQUE 0303 5419671</p>
            <p className="font-semibold">M. SHAKEEL 0303 7433396</p>
          </div>
        </div>
        <div className="mt-2 text-sm text-center">
          <p className="text-gray-600">10R1 Samsani Road Shadywall Chowk Johar Town, Lahore.</p>
        </div>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><span className="font-semibold">Bill No:</span> {invoice.billNo}</p>
          {invoice.customer && (
            <p><span className="font-semibold">Customer:</span> {invoice.customer.name}</p>
          )}
          {invoice.customer && (
            <p><span className="font-semibold">Contact:</span> {invoice.customer.contact}</p>
          )}
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Date:</span> {format(invoice.date, "dd/MM/yyyy")}</p>
          {invoice.vehicleNo && (
            <p><span className="font-semibold">Vehicle No:</span> {invoice.vehicleNo}</p>
          )}
          {invoice.vehicleType && (
            <p><span className="font-semibold">Type:</span> {invoice.vehicleType}</p>
          )}
          {invoice.meterReading && (
            <p><span className="font-semibold">Meter Reading:</span> {invoice.meterReading}</p>
          )}
        </div>
      </div>
      
      {/* Line Items Table */}
      <div className="relative mb-6">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <GarageLogo size="lg" className="w-48 h-48" />
        </div>
        
        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-garage-primary">
              <th className="py-2 px-4 text-left w-16">S.No</th>
              <th className="py-2 px-4 text-left">PARTICULARS</th>
              <th className="py-2 px-4 text-right w-24">Rate</th>
              <th className="py-2 px-4 text-right w-32">Amount (Rs & P.)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length > 0 ? (
              invoice.lineItems.map((item, index) => (
                <tr key={item.id} className="border-b border-dotted">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.particulars || "-"}</td>
                  <td className="py-2 px-4 text-right">
                    {item.rate ? formatCurrency(item.rate) : "-"}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {item.amount ? formatCurrency(item.amount) : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No items added yet
                </td>
              </tr>
            )}
            
            {/* Empty rows to fill space */}
            {invoice.lineItems.length < 10 && Array(10 - invoice.lineItems.length).fill(0).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b border-dotted">
                <td className="py-2 px-4">&nbsp;</td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
              </tr>
            ))}
            
            {/* Total */}
            <tr className="font-bold">
              <td colSpan={2} className="py-2 px-4 text-right">
                Total:
              </td>
              <td colSpan={2} className="py-2 px-4 text-right">
                Rs. {formatCurrency(invoice.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="mt-12">
        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="border-t border-black pt-2 text-center">
              <p className="font-semibold">Authorised Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
