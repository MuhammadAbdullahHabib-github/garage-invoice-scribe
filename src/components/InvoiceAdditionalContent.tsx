
import React from 'react';
import { PDFTemplateSettings } from '@/lib/pdf-generator';

interface InvoiceAdditionalContentProps {
  settings: PDFTemplateSettings;
  amount: string;
}

export const InvoiceAdditionalContent: React.FC<InvoiceAdditionalContentProps> = ({
  settings,
  amount
}) => {
  // Convert amount to words if needed
  const getAmountInWords = () => {
    // Simple implementation - would normally use a more robust library
    return `${amount} USD only`;
  };

  return (
    <>
      {/* Amount in Words */}
      {settings.includeAmountInWords && (
        <div className="mb-4 text-gray-600 text-sm italic" style={{ position: 'relative', zIndex: 2 }}>
          <div className="font-medium">Amount in words:</div>
          <div>{getAmountInWords()}</div>
        </div>
      )}
      
      {/* Notes Section */}
      {settings.includeNotes && settings.notes && (
        <div className="mb-6 text-gray-600 text-sm" style={{ position: 'relative', zIndex: 2 }}>
          <div className="font-medium mb-1">Notes:</div>
          <div className="whitespace-pre-line">{settings.notes}</div>
        </div>
      )}
      
      {/* Terms and Conditions */}
      {settings.includeTermsAndConditions && settings.termsAndConditions && (
        <div className="mb-6 text-gray-600 text-sm" style={{ position: 'relative', zIndex: 2 }}>
          <div className="font-medium mb-1">Terms & Conditions:</div>
          <div className="whitespace-pre-line">{settings.termsAndConditions}</div>
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
    </>
  );
};
