
export interface Customer {
  id: string;
  name: string;
  contact: string;
  avatar?: string;
  address?: string; // Added address property
}

export interface LineItem {
  id: string;
  particulars: string;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id?: string; // Added id property
  billNo: string;
  date: Date;
  customer: Customer | null;
  vehicleNo: string;
  vehicleType: string;
  meterReading: string;
  vehicleModel?: string; // Added vehicleModel property
  vehicleNumber?: string; // Added vehicleNumber property
  dueDate?: Date | string; // Added dueDate property
  lineItems: LineItem[];
  total: number;
  isDraft?: boolean;
}

export const EMPTY_INVOICE: InvoiceData = {
  billNo: '',
  date: new Date(),
  customer: null,
  vehicleNo: '',
  vehicleType: '',
  meterReading: '',
  lineItems: [],
  total: 0,
  isDraft: true
};

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    contact: '0303 1234567',
    avatar: 'https://i.pravatar.cc/150?u=ahmed'
  },
  {
    id: '2',
    name: 'Sara Malik',
    contact: '0300 7654321',
    avatar: 'https://i.pravatar.cc/150?u=sara'
  },
  {
    id: '3',
    name: 'Imran Sheikh',
    contact: '0333 1122334',
    avatar: 'https://i.pravatar.cc/150?u=imran'
  }
];

export function calculateTotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function generateBillNumber(): string {
  const prefix = 'CLG';
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Function to save invoice as draft
export function saveInvoiceAsDraft(invoice: InvoiceData): void {
  const drafts = getDraftInvoices();
  invoice.isDraft = true;
  drafts[invoice.billNo] = invoice;
  
  localStorage.setItem('draftInvoices', JSON.stringify(drafts));
}

// Function to get all draft invoices
export function getDraftInvoices(): Record<string, InvoiceData> {
  const draftsString = localStorage.getItem('draftInvoices');
  if (!draftsString) return {};
  
  try {
    const drafts = JSON.parse(draftsString);
    
    // Convert date strings back to Date objects
    Object.values(drafts).forEach((invoice: any) => {
      invoice.date = new Date(invoice.date);
    });
    
    return drafts;
  } catch (error) {
    console.error('Error parsing draft invoices:', error);
    return {};
  }
}

// Function to get a specific draft invoice
export function getDraftInvoice(billNo: string): InvoiceData | null {
  const drafts = getDraftInvoices();
  return drafts[billNo] || null;
}

// Function to delete a draft invoice
export function deleteDraftInvoice(billNo: string): void {
  const drafts = getDraftInvoices();
  if (drafts[billNo]) {
    delete drafts[billNo];
    localStorage.setItem('draftInvoices', JSON.stringify(drafts));
  }
}
