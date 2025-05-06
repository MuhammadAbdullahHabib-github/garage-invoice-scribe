
export interface Customer {
  id: string;
  name: string;
  contact: string;
  avatar?: string;
}

export interface LineItem {
  id: string;
  particulars: string;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  billNo: string;
  date: Date;
  customer: Customer | null;
  vehicleNo: string;
  vehicleType: string;
  meterReading: string;
  lineItems: LineItem[];
  total: number;
}

export const EMPTY_INVOICE: InvoiceData = {
  billNo: '',
  date: new Date(),
  customer: null,
  vehicleNo: '',
  vehicleType: '',
  meterReading: '',
  lineItems: [],
  total: 0
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
